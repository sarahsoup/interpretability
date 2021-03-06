/* VARIABLES */
const h = 300;
const barW = 500;
const barH = 50;
const barY = 20;
const scoreMax = 7;

// text about algorithm: for narrative and confidence variations
const aboutAlg = 'This software employs a machine-learning algorithm that was trained on a dataset of 300,000 utterances from 356 session recordings. ' +
  'These sessions were hand-labelled by an 8-person coding team of human therapists. '+
  'By analyzing these data, the software identified patterns that correlated with the human ratings. '+
  'For example, the coding team may have given higher empathy ratings to sessions where therapists repeated clients’ statements than sessions where therapists used phrases like “you’re wrong.” '+
  'This system has a 0.93 correlation with human predictions, which means that the machine is nearly as likely to agree with another human who rates the session as two human raters are with each other.';

// confidence variation variables
const confAdj = 25;
const secondLnAdj = (18*2);
const barAdj = 10;
const confInt = 0.94; // manually assigned confidence interval (+/- empathy score)
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

const scaleX = d3.scaleLinear().domain([0, scoreMax]).range([0, barW]);
const scaleP = d3.scaleLinear().domain([0, 100]).range([0, barW]);
const windowW = window.innerWidth;

// session randomization
const sessionArr = [
  {session: sessionGood},
  {session: sessionBad},
];
const randomSessIndex = Math.floor(Math.random() * 2);
session = sessionArr[randomSessIndex].session;
// session = sessionBad; //manually set session
let sessionAudio, sessionType;
if(session == sessionGood){
  sessionAudio = 'http://sri.utah.edu/psychtest/r01/hi_goodtherapy_enhanced.wav';
  sessionType = 'good';
}else if(session == sessionBad){
  // sessionAudio = './audio/hi_badtherapy_clip_enhanced.wav';
  sessionAudio = 'http://sri.utah.edu/psychtest/r01/hi_badtherapy.wav';
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
// variation = variationArr[2].variation; //manually set variation

/* WELCOME SCREEN */
d3.select('#welcome').selectAll('.btn')
  .on('click',function(d){
    d3.select('#welcome-imgs')
      .style('display','none')
      .classed('hidden',true);
    d3.select('#welcome')
      .style('display','none')
      .classed('hidden',true);
    d3.select('#audio')
      .style('display','block')
      .classed('hidden',false);
  });

/* SESSION AUDIO AND RATING SCREEN */
playSession();

d3.select('#radio-1')
  .on('click',function(){
    d3.select('#audio').selectAll('.btn').classed('disabled',false);
    rating = this.value;
  });
d3.select('#radio-2')
  .on('click',function(){
    d3.select('#audio').selectAll('.btn').classed('disabled',false);
    rating = this.value;
  });
d3.select('#radio-3')
  .on('click',function(){
    d3.select('#audio').selectAll('.btn').classed('disabled',false);
    rating = this.value;
  });
d3.select('#radio-4')
  .on('click',function(){
    d3.select('#audio').selectAll('.btn').classed('disabled',false);
    rating = this.value;
  });
d3.select('#radio-5')
  .on('click',function(){
    d3.select('#audio').selectAll('.btn').classed('disabled',false);
    rating = this.value;
  });
d3.select('#radio-6')
  .on('click',function(){
    d3.select('#audio').selectAll('.btn').classed('disabled',false);
    rating = this.value;
  });
d3.select('#radio-7')
  .on('click',function(){
    d3.select('#audio').selectAll('.btn').classed('disabled',false);
    rating = this.value;
  });

d3.select('#audio').selectAll('.btn')
  .on('click',function(d){
      stopPlayer(0);
      userScore = rating;
      d3.select('#audio')
        .style('display','none')
        .classed('hidden',true);
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

  d3.json(session).then(function(data){
    // console.log(data);

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
      .text('The software rated the session ');
    mlScoreT.append('tspan')
      .attr('id','mlNum')
      .text(mlScore.toFixed(1))
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
        .attr('width',scaleX(scoreMax-mlScore));
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
        .html('ABOUT THE SOFTWARE');
      d3.select('#content-empathy')
        .append('p')
        .attr('id','desc-aboutAlg')
        .style('width',barW+'px')
        .html(aboutAlg);
    }else if(variation == 'influential n-grams'){
      influenceLegend(data.session.talkTurn);
    }

    /************** SESSION TRANSCRIPT **************/

    d3.select('#content-session')
      .append('p')
      .attr('id','transcript-desc')
      .style('font-size','12px')
      .style('width',barW+'px')
      .style('margin-top','30px')
      .html('Here is a software-generated transcript of the role-played session.')

    if(variation == 'influential n-grams'){
      d3.select('#transcript-desc')
        .html('Here is a software-generated transcript of the role-played session. ' +
        'Click the buttons below to see how changing the ' +
        'most influential words and phrases to all pro-empathy or anti-empathy affect the empathy score.')
      influenceFunctionality(mlScore);
    }

    d3.select('#content-session')
      .append('div')
      .attr('id','container-session');
    d3.select('#content-session')
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
      .text(function(d){
        if(d.speaker == 'therapist'){
          return 't: ';
        }else{
          return 'c: ';
        }
      })

    d3.selectAll('.session-text')
      .append('tspan')
      .attr('class',function(d){
        return d.speaker + '-original';
      })
      .attr('id',function(d){
        return d.speaker + '-original-' + d.id;
      })
      // commented code below indicated bolded text in transcript
      // .classed('in-scope',function(d){
      //   if(session == sessionGood){
      //     if(d.id >= 74 && d.id <= 119){
      //       return true;
      //     }else{ return false; }
      //   }else if(session == sessionBad){
      //     if(d.id >= 51 && d.id <= 88){
      //       return true;
      //     }else{ return false; }
      //   }
      // })
      .html(function(d){
        if(d.speaker == 'therapist'){
          return d.asrText;
        }else{
          return d.asrText;
        }
      });

    if(variation == 'similar sessions'){
      similarSessions();
      d3.select('#container-session')
        .style('height','480px');
    }
    else if(variation == 'influential n-grams'){
      d3.select('#container-session')
        .style('margin-top','30px')
        .style('height','470px');
      influenceInTranscript();
      influence();
    }
    else if(variation == 'narrative description'){
      d3.select('#container-session')
        .style('height','450px');
    }else if(variation == 'confidence'){
      d3.select('#container-session')
        .style('height','470px');
    }else if(variation == 'manipulation'){
      d3.select('#container-session')
        .style('height','560px');
      d3.select('#manipulation-tracking')
        .style('top',function(){
          var rect = document.getElementById('container-session').getBoundingClientRect(),
            greaterRect = document.getElementById('content-session').getBoundingClientRect(),
    	      scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          return (rect.top - greaterRect.top + scrollTop) + 'px';
        })
        .style('height','560px');
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

  // data storage
  dataObj.user = generateId();
  dataObj.rating = rating;
  dataObj.session = sessionType;
  dataObj.listenTime = +listenMaxDur.toFixed(0);
  dataObj.variation = variation.replace(/ /g,"_");
  // currently omitting ip address capture
  // d3.json('http://api.db-ip.com/v2/free/self', function(data) {
  //   dataObj.ip = data.ipAddress;
  // });

  d3.select('#btn-to-survey')
    .style('color','black')
    .on('click',function(){
      dataObj.interactionCount = interaction;
      dataObj.outputTime = outputDurSec;
      clearInterval(durSecInterval);
      d3.select('#modal-next')
        .style('display','block');
    })

  // modal content
  d3.select('#modal-next').selectAll('.modal-body')
    .append('p')
    .style('font-size','14px')
    .style('text-align','center')
    .style('margin-top','40px')
    .html('You will now be directed to the survey site.');

  d3.select('#modal-next').selectAll('.modal-body')
    .append('a')
    .attr('id','modal-content-btn')
    .attr('class','btn')
    .html('okay')
    .on('click',function(){
      d3.select(this).attr('href','https://sri.utah.edu/epnew/bypass/anon.jsp?gid=4196738'+
        '&randomsessionid=' + dataObj.user +
        // '&ip=' + dataObj.ip +
        '&empathy=' + dataObj.rating +
        '&sessiongoodbad=' + dataObj.session +
        '&listentime=' + dataObj.listenTime +
        '&variation=' + dataObj.variation +
        '&timespentlooking=' + dataObj.outputTime +
        '&interactioncount=' + dataObj.interactionCount);
    });

};
