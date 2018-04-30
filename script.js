const h = 300;
let userScore;
const barW = 500;
const barH = 50;
const barCountsH = 20;
const barY = 20;

const confAdj = 25;
const barAdj = 10;
const confInt = 0.4;
const confIntCounts = 10;
const scaleColor = chroma.scale(['#EEEEEE','#19ABB5']);
const sessionTest = './transcript.json';
const sessionGood = './good_wav.json';
const sessionBad = './bad_wav.json';
const session = sessionBad;
let sessionAudio, sessionType;
if(session == sessionGood){
  sessionAudio = 'http://sri.utah.edu/psychtest/r01/hi_goodtherapy.wav';
  sessionType = 'good';
}else if(session == sessionBad){
  sessionAudio = 'http://sri.utah.edu/psychtest/r01/hi_badtherapy.wav';
  sessionType = 'bad';
}

//variation randomization
const variationArr = [
  {variation: 'narrative description'},
  {variation: 'confidence'},
  {variation: 'manipulation'},
  {variation: 'similar sessions'},
  {variation: 'influential n-grams'}
];
const randomIndex = Math.floor(Math.random() * 5);
const variationTest = variationArr[randomIndex].variation; //will ultimately be variable to define variation

let listenMaxDur = 0;
let outputDurSec = 0;
let variation;
let rating;
let dataObj = {};

const scaleX = d3.scaleLinear().domain([0, 5]).range([0, barW]);
const scaleP = d3.scaleLinear().domain([0, 100]).range([0, barW]);

const windowW = window.innerWidth;

const aboutAlg = 'This is text about the algorithm';

d3.select('#welcome').selectAll('.btn')
  .on('click',function(d){
    d3.select('#welcome')
      .style('display','none')
      .classed('hidden',true);
    d3.select('#audio')
      .style('display','block')
      .classed('hidden',false);
  });

playSession();
d3.select('.audio-container')
  .append('a')
  .attr('class','btn btn-next')
  .html('next');

d3.select('#audio').selectAll('.btn')
  .on('click',function(d){
    stopPlayer(0);
    d3.select('#audio')
      .style('display','none')
      .classed('hidden',true);
    d3.select('#rating')
      .style('display','block')
      .classed('hidden',false);
    d3.select('#slider-rating')
      .attr('defaultValue',0)
      .attr('value',0);
  });

d3.select('#rating').selectAll('.btn')
  .on('click',function(d){
    userScore = rating;
    d3.select('#rating')
      .style('display','none')
      .classed('hidden',true);
    d3.select('#selection')
      .classed('hidden',false)
      .style('display','block');
  });

d3.select('#selection').selectAll('.btn')
  .on('click',function(d){
    variation = this.innerHTML;
    d3.select('#selection')
      .style('display','none')
      .classed('hidden',true);
    d3.select('#header')
      .classed('hidden',false);
    d3.select('#content')
      .classed('hidden',false);
    d3.select('#next')
      .classed('hidden',false);
    createVariation(variation);
  })

  rating = document.getElementById('slider-rating').value;
  d3.select('#rating-val').html(rating);
  d3.select('#slider-rating')
    .style('height','10px')
    .style('background','linear-gradient(to right, #19ABB5, #19ABB5 ' + ((rating/5)*100) + '%, #EEEEEE ' + ((rating/5)*100) + '%, #EEEEEE)')
    .style('border-radius','10px')
    .on('input',function(){
      rating = document.getElementById('slider-rating').value;
      document.getElementById('rating-val').innerHTML = rating;
      d3.select('#slider-rating')
        .style('background','linear-gradient(to right, #19ABB5, #19ABB5 ' + ((rating/5)*100) + '%, #EEEEEE ' + ((rating/5)*100) + '%, #EEEEEE)');
    })


function createVariation(variation){
  const durSecInterval = setInterval(function(){
    outputDurSec++;
  },1000);

  const headerMargin = windowW - d3.select('#header').node().clientWidth;
  d3.select('#header')
    .style('margin-left', '-'+(headerMargin/2)+'px')
    .style('margin-right', '-'+(headerMargin/2)+'px');

  const w = d3.select('#content-empathy').node().clientWidth;

  if(variation == 'narrative description'){
    createDescription();
  }

  d3.json(session,function(data){

    const mlScore = data.scores.globals.empathy;

    const percentOpenQuestions = data.scores.behaviorCounts.percentOpenQuestions.percentOpenQuestions;
    const closedQuestions = data.scores.behaviorCounts.percentOpenQuestions.closedQuestions;
    const openQuestions = data.scores.behaviorCounts.percentOpenQuestions.openQuestions;

    const percentComplexReflections = data.scores.behaviorCounts.percentComplexReflections.percentComplexReflections;
    const complexReflections = data.scores.behaviorCounts.percentComplexReflections.complexReflections;
    const simpleReflections = data.scores.behaviorCounts.percentComplexReflections.simpleReflections;

    /* RANDOMLY ASSIGN CONF SCORES */
    const openArr = [];
    const closeArr = [];
    const complexArr = [];
    const simpleArr = [];

    data.session.talkTurn.forEach(function(d){
      d.codes[1] = (Number(Math.random().toFixed(3))/2) + 0.5; // confidence score
      d.influence = (Number(Math.random().toFixed(3))*2) - 1; // influence score
      // console.log(d.influence);
      if(d.codes[0]=='QUO'){
        openArr.push({
          id: d.id,
          confidence: d.codes[1]
        })
      }
      if(d.codes[0]=='QUC'){
        closeArr.push({
          id: d.id,
          confidence: d.codes[1]
        })
      }
      if(d.codes[0]=='REC'){
        complexArr.push({
          id: d.id,
          confidence: d.codes[1]
        })
      }
      if(d.codes[0]=='RES'){
        simpleArr.push({
          id: d.id,
          confidence: d.codes[1]
        })
      }
    });

if(variation == 'confidence'){
  openArr.sort(function(a,b){
    return b.confidence - a.confidence;
  });
  closeArr.sort(function(a,b){
    return a.confidence - b.confidence;
  });
  complexArr.sort(function(a,b){
    return b.confidence - a.confidence;
  });
  simpleArr.sort(function(a,b){
    return a.confidence - b.confidence;
  });
};

    /* HEADER */

    const sessionNumber = d3.select('#header-title')
      .append('h6')
      .attr('class','header-text')
      .html('HUMAN INTERPRETABILITY STUDY');


    /************* EMPATHY BARS *************/

    const svgEmpathy = d3.select('#content-empathy')
      .append('svg');

    svgEmpathy
      .attr('class','bars-empathy')
      .attr('id','svg-empathy')
      .attr('width',w)
      .attr('height',h);

    const mlScoreG = svgEmpathy
      .append('g')
      .attr('id','mlScoreG')
      .attr('transform','translate(0,160)');

    const userScoreG = svgEmpathy
      .append('g')
      .attr('id','userScoreG')
      .attr('transform','translate(0,40)');

    const userScoreT = userScoreG.append('text')
      .attr('class','textScore userScore')
      .attr('id','textScore-user')
      .attr('x','0px');

    userScoreT.append('tspan')
      .text('You rated the session ')
      .style('font-weight','lighter');

    userScoreT.append('tspan')
      .attr('id','userNum')
      .text(userScore)
      .style('font-weight','bold');

    userScoreG.append('rect')
      .attr('class','rect-background userScore');

    const mlScoreT = mlScoreG.append('text')
      .attr('class','textScore mlScore')
      .attr('id','textScore-ml')
      .attr('x','0px');

    mlScoreT.append('tspan')
      .text('The algorithm rated the session ')
      .style('font-weight','lighter');

    mlScoreT.append('tspan')
      .attr('id','mlNum')
      .text(mlScore.toFixed(2))
      .style('font-weight','bold');

    mlScoreT.append('tspan')
      .attr('id','mlNumChange');

    mlScoreG.append('rect')
      .attr('class','rect-background mlScore');

    if(variation == 'confidence'){

      d3.select('#mlNum')
        .style('fill','#19ABB5');

      const gradient = mlScoreG.append('linearGradient')
        .attr('id','gradient');

      gradient.append('stop')
        .attr('offset','1%')
        .attr('stop-color','#EEEEEE');

      gradient.append('stop')
        .attr('offset','45%')
        .attr('stop-color','#19ABB5');

      gradient.append('stop')
        .attr('offset','55%')
        .attr('stop-color','#19ABB5');

      gradient.append('stop')
        .attr('offset','99%')
        .attr('stop-color','#EEEEEE');

      mlScoreG.append('rect')
        .attr('class','rect-gradient mlScore')
        .attr('id','mlScore')
        .attr('width',scaleX(confInt*2))
        .attr('height',barH)
        .attr('x',scaleX(mlScore-confInt))
        .attr('y',barY+confAdj+barAdj+'px')
        .style('fill','url(#gradient)');

      userScoreG.append('rect')
        .attr('class','rect-foreground userScore')
        .attr('id','userScore')
        .attr('width',4)
        .attr('height',barH+'px')
        .attr('x',scaleX(userScore)-2)
        .attr('y',barY+barAdj+'px')
        .style('fill','black');

      mlScoreT
        .attr('y',confAdj+'px');

      userScoreG.selectAll('.rect-background')
        .attr('y',barY+barAdj+'px');

      mlScoreG.selectAll('.rect-background')
        .attr('y',barY+confAdj+barAdj+'px');

      makeConfidenceLabels(mlScore,confInt);

    } else{

      userScoreG.append('rect')
        .attr('class','rect-foreground userScore')
        .attr('id','userScore')
        .attr('width',scaleX(userScore));

      mlScoreG.append('rect')
        .attr('class','rect-foreground mlScore')
        .attr('id','mlScore')
        .attr('width',scaleX(mlScore));

      svgEmpathy.selectAll('.rect-foreground')
        .attr('height',barH+'px')
        .attr('x','0px')
        .attr('y',barY+'px');

      svgEmpathy.selectAll('.rect-background')
        .attr('y',barY+'px');

    };

    svgEmpathy.selectAll('.rect-background')
      .attr('width',barW+'px')
      .attr('height',barH+'px')
      .attr('x','0px');

    if(variation == 'manipulation' || variation == 'influential n-grams'){

      mlScoreG.append('rect')
        .attr('class','rect-foreground mlScore mlScoreChange')
        .attr('id','scoreChangeNeg')
        .attr('x',0)
        .attr('width',scaleX(mlScore));

      mlScoreG.append('rect')
        .attr('class','rect-background mlScore mlScoreChange')
        .attr('id','scoreChangePos')
        .attr('x',scaleX(mlScore))
        .attr('width',scaleX(5-mlScore));

      mlScoreG.selectAll('.mlScoreChange')
        .attr('height',barH/10)
        .attr('y',barY+(9*barH/20));

      mlScoreG.append('circle')
      .attr('id','scoreChange')
      .attr('cx',scaleX(mlScore))
      .attr('cy',barY+(barH/2))
      .attr('r',barH/8)
      .style('opacity',0);
    }

    /************* LOWER LEFT CONTENT *************/

    if(variation == 'manipulation'){

      d3.select('#content-empathy')
        .append('h6')
        .attr('id','title-counts')
        .html('BEHAVIOR COUNTS');

      d3.select('#content-empathy')
        .append('p')
        .attr('id','desc-counts')
        .style('width',barW+'px')
        .style('margin-top','20px')
        .style('font-size','12px')
        .html('Here are some measures correlated with empathy. '+
        'Drag the sliders to see how the empathy score and session transcript change when these measures change.')

      const svgCounts = d3.select('#content-empathy')
        .append('svg')
        .attr('id','#counts-svg');

      svgCounts
        .attr('class','bars-counts')
        .attr('id','svg-counts')
        .attr('height',h)
        .attr('width',w);

      const openQG = svgCounts
        .append('g')
        .attr('class','openQG')
        .attr('id','openQG');

      const complexRG = svgCounts
        .append('g')
        .attr('class','complexRG')
        .attr('id','complexRG');

      openQG.attr('transform','translate(0,40)');
      complexRG.attr('transform','translate(0,140)');

      const openQT = openQG.append('text')
        .attr('class','textCounts openQ')
        .attr('x','0px');

      openQT.append('tspan')
        .text('Questions: ')
        .style('font-weight','lighter');

      openQT.append('tspan')
        .attr('id','openQ-perc')
        .text(Math.round(percentOpenQuestions) + '% Open')
        .style('font-weight','bold');

      const complexRT = complexRG.append('text')
        .attr('class','textCounts complexR')
        .attr('x','0px');

      complexRT.append('tspan')
        .text('Reflections: ')
        .style('font-weight','lighter');

      complexRT.append('tspan')
        .attr('id','complexQ-perc')
        .text(Math.round(percentComplexReflections) + '% Complex')
        .style('font-weight','bold');

      const sliderObj = {
        openPerc: percentOpenQuestions,
        openCount: openQuestions,
        closedCount: closedQuestions,
        complexPerc: percentComplexReflections,
        complexCount: complexReflections,
        simpleCount: simpleReflections
      };
      const questionsObj = {
        open: openArr,
        close: closeArr
      };
      const reflectionsObj = {
        complex: complexArr,
        simple: simpleArr
      };
      createSliders(sliderObj,questionsObj,reflectionsObj,mlScore);

    }else if(variation == 'confidence' || variation == 'narrative description'){
      d3.select('#content-empathy')
        .append('h6')
        .attr('id','title-aboutAlg')
        .html('ABOUT THE ALGORITHM');

      d3.select('#content-empathy')
        .append('p')
        .attr('id','desc-aboutAlg')
        .style('width',barW+'px')
        .html(aboutAlg);
    }else if(variation == 'influential n-grams'){
      influenceLegend(data.session.talkTurn);
    }

    /************** SESSION TRANSCRIPT **************/

    if(variation == 'influential n-grams'){
      influenceFunctionality(mlScore);
    }

    d3.select('#content-session')
      .append('div')
      .attr('id','container-session');

    // text for each talk turn
    d3.select('#container-session').selectAll('.session-text')
      .data(data.session.talkTurn)
      .enter()
      .append('div')
      .attr('class',function(d){
        if(d.speaker == 'therapist'){
          return 'session-div therapist-div';
        }
        else{
          return 'session-div client-div';
        }
      })
      .append('text')
      .attr('class',function(d){
        if(d.speaker == 'therapist' && d.codes[0]=='QUO'){
          return 'session-text therapist-text openQ-text';
        }
        else if(d.speaker == 'therapist' && d.codes[0]=='REC'){
          return 'session-text therapist-text complexR-text';
        }
        else if(d.speaker == 'therapist'){
          return 'session-text therapist-text';
        }
        else{
          return 'session-text client-text';
        }
      })
      .attr('id',function(d){
        return d.speaker + '-' + d.id;
      })
      .append('tspan')
      .attr('class',function(d){
        return d.speaker + '-original';
      })
      .attr('id',function(d){
        return d.speaker + '-original-' + d.id;
      })
      .text(function(d){
        return d.asrText;
      });



    if(variation == 'similar sessions'){
      similarSessions();
    }
    else if(variation == 'influential n-grams'){
      influence();
    }else if(variation == 'manipulation'){
      d3.select('#btn-to-survey')
        .style('position','relative')
        .style('top','-160px');
    }

  });

  dataObj.user = 'placeholder';
  dataObj.rating = rating;
  dataObj.session = sessionType;
  dataObj.listenTime = +listenMaxDur.toFixed(0);
  dataObj.variation = variation;

  d3.select('#btn-to-survey')
    .on('click',function(){
      dataObj.outputTime = outputDurSec;
      clearInterval(durSecInterval);
      console.log(dataObj);
    })

};
