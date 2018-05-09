/* VARIABLES */

const h = 300;
const barW = 500;
const barH = 50;
const barY = 20;

// text about algorithm: for narrative and confidence variations
const aboutAlg = 'This is text about the algorithm';

// confidence variation variables
const confAdj = 25;
const secondLnAdj = 18;
const barAdj = 10;
const confInt = 0.4; // manually assigned confidence interval (+/- empathy score)
const scaleColor = chroma.scale(['#EEEEEE','#19ABB5']);

// transcripts
const sessionTest = './output/transcript.json';
const sessionGood = './output/good_wav.json';
const sessionBad = './output/bad_wav.json';

// variables for output to survey
let listenMaxDur = 0;
let outputDurSec = 0;
let interaction = 0;
let session;
let userScore;
let variation;
let rating;
let dataObj = {};

const scaleX = d3.scaleLinear().domain([0, 5]).range([0, barW]);
const scaleP = d3.scaleLinear().domain([0, 100]).range([0, barW]);
const windowW = window.innerWidth;

// session randomization
const sessionArr = [
  {session: sessionGood},
  {session: sessionBad},
];
const randomSessIndex = Math.floor(Math.random() * 2);
session = sessionArr[randomSessIndex].session;
// session = sessionGood; //manually set session
let sessionAudio, sessionType;
if(session == sessionGood){
  sessionAudio = './audio/hi_goodtherapy_clip.wav';
  sessionType = 'good';
}else if(session == sessionBad){
  sessionAudio = './audio/hi_badtherapy_clip.wav';
  sessionType = 'bad';
}

// variation randomization
const variationArr = [
  {variation: 'narrative description'},
  {variation: 'confidence'},
  {variation: 'manipulation'},
  {variation: 'similar sessions'},
  {variation: 'influential n-grams'}
];
const randomVarIndex = Math.floor(Math.random() * 5);
variation = variationArr[randomVarIndex].variation;
variation = 'influential n-grams'; //manually set variation

/* WELCOME SCREEN */
d3.select('#welcome').selectAll('.btn')
  .on('click',function(d){
    d3.select('#welcome')
      .style('display','none')
      .classed('hidden',true);
    d3.select('#audio')
      .style('display','block')
      .classed('hidden',false);
  });

/* SESSION AUDIO SCREEN */
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

/* SESSION RATING SCREEN */
// rating = document.getElementById('slider-rating').value;
// d3.select('#rating-val').html(rating);
// d3.select('#number-rating')
// below code for slider input
// d3.select('#slider-rating')
//   .style('height','10px')
//   .style('background','linear-gradient(to right, #19ABB5, #19ABB5 ' + ((rating/5)*100) + '%, #EEEEEE ' + ((rating/5)*100) + '%, #EEEEEE)')
//   .style('border-radius','10px')
//   .on('input',function(){
//     rating = document.getElementById('slider-rating').value;
//     document.getElementById('rating-val').innerHTML = rating;
//     d3.select('#slider-rating')
//       .style('background','linear-gradient(to right, #19ABB5, #19ABB5 ' + ((rating/5)*100) + '%, #EEEEEE ' + ((rating/5)*100) + '%, #EEEEEE)');
//   });

d3.select('#rating').selectAll('.btn')
  .on('click',function(d){
      rating = document.getElementById('number-rating').value;
      userScore = rating;
      d3.select('#rating')
        .style('display','none')
        .classed('hidden',true);
      d3.select('#header')
        .classed('hidden',false);
      d3.select('#content')
        .classed('hidden',false);
      d3.select('#next')
        .classed('hidden',false);
      createVariation(variation);
  });

/* CREATE VARIATION-BASED OUTPUT SCREEN */
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

    /* VARIABLES */
    const mlScore = data.scores.globals.empathy;
    const percentOpenQuestions = data.scores.behaviorCounts.percentOpenQuestions.percentOpenQuestions;
    const closedQuestions = data.scores.behaviorCounts.percentOpenQuestions.closedQuestions;
    const openQuestions = data.scores.behaviorCounts.percentOpenQuestions.openQuestions;
    const percentComplexReflections = data.scores.behaviorCounts.percentComplexReflections.percentComplexReflections;
    const complexReflections = data.scores.behaviorCounts.percentComplexReflections.complexReflections;
    const simpleReflections = data.scores.behaviorCounts.percentComplexReflections.simpleReflections;

    const openArr = [];
    const closeArr = [];
    const complexArr = [];
    const simpleArr = [];

    data.session.talkTurn.forEach(function(d){
      d.influence = (Number(Math.random().toFixed(3))*2) - 1; // randomize influence scores per talk turn - placeholder for real output
      if(d.codes[0]=='QUO'){
        openArr.push({
          id: d.id,
        })
      }
      if(d.codes[0]=='QUC'){
        closeArr.push({
          id: d.id,
        })
      }
      if(d.codes[0]=='REC'){
        complexArr.push({
          id: d.id,
        })
      }
      if(d.codes[0]=='RES'){
        simpleArr.push({
          id: d.id,
        })
      }
    });

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
      .text('You rated the session ');
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
      .text('The algorithm rated the session ');
    mlScoreT.append('tspan')
      .attr('id','mlNum')
      .text(mlScore.toFixed(2))
      .style('font-weight','bold');
    mlScoreT.append('tspan')
      .attr('id','mlNumChange');

    mlScoreG.append('rect')
      .attr('class','rect-background mlScore');

    if(variation == 'confidence'){
      makeEmpathyBars(mlScore);
      makeConfidenceLabels(mlScore);
    }else{
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

    // append visual indicators for empathy score changes by user interaction
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
      createSliders(sliderObj,questionsObj,reflectionsObj,mlScore,w);

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
      .attr('id','container-session')
      .append('div')
      .attr('id','manipulation-tracking');

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
      d3.select('#container-session')
        .style('height','580px'); // to accomodate for accordion expansion
      similarSessions();
    }
    else if(variation == 'influential n-grams'){
      d3.select('#container-session')
        .style('margin-top','30px');
      influence();
    }else if(variation == 'manipulation'){
      d3.select('#container-session')
        .style('height','540px');
      d3.select('#manipulation-tracking')
        .style('height','540px');
      trackingH = document.getElementById('manipulation-tracking').clientHeight;
      trackingW = document.getElementById('manipulation-tracking').clientWidth;
      d3.select('#manipulation-tracking')
        .append('svg')
        .attr('id','tracking-svg')
        .attr('width',trackingW)
        .attr('height',trackingH);
      d3.select('#btn-to-survey')
        .style('position','relative')
        .style('top','-160px');
    }

  });

  var generateId = function () {
  return '_' + Math.random().toString(36).substr(2, 9);
  };

  dataObj.user = generateId();
  dataObj.rating = rating;
  dataObj.session = sessionType;
  dataObj.listenTime = +listenMaxDur.toFixed(0);
  dataObj.variation = variation.replace(/ /g,"_");
  d3.json('http://api.db-ip.com/v2/free/self', function(data) {
    dataObj.ip = data.ipAddress;
  });

  d3.select('#btn-to-survey')
    .style('color','black')
    .on('click',function(){
      dataObj.interactionCount = interaction;
      dataObj.outputTime = outputDurSec;
      clearInterval(durSecInterval);
      d3.select(this).attr('href','https://sri.utah.edu/epnew/bypass/anon.jsp?gid=4196738'+
        '&randomsessionid=' + dataObj.user +
        '&ip=' + dataObj.ip +
        '&empathy=' + dataObj.rating +
        '&sessiongoodbad=' + dataObj.session +
        '&listentime=' + dataObj.listenTime +
        '&variation=' + dataObj.variation +
        '&timespentlooking=' + dataObj.outputTime +
        '&interactioncount=' + dataObj.interactionCount);
    })

};
