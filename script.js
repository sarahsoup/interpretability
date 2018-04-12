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

let totalQ = 5;
let openQ = 3;
let totalR = 6;
let complexR = 4;

let variation;
let rating;

const scaleX = d3.scaleLinear().domain([0, 5]).range([0, barW]);
const scaleP = d3.scaleLinear().domain([0, 100]).range([0, barW]);

const windowW = window.innerWidth;


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
    createVariation(variation);
  })

  rating = document.getElementById('slider-rating').value;
  d3.select('#rating-val').html(rating);
  d3.select('#slider-rating')
    .on('input',function(){
      rating = document.getElementById('slider-rating').value;
      document.getElementById('rating-val').innerHTML = rating;
    })


function createVariation(variation){

  const headerMargin = windowW - d3.select('#header').node().clientWidth;
  d3.select('#header')
    .style('margin-left', '-'+(headerMargin/2)+'px')
    .style('margin-right', '-'+(headerMargin/2)+'px');

  const w = d3.select('#content-empathy').node().clientWidth;

  if(variation == 'narrative description'){
    createDescription();
  }

  d3.json('./transcript.json',function(data){

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
    //
    // const sessionNumber = d3.select('#header-number')
    //   .append('h6')
    //   .attr('class','header-text')
    //   .html(data.sessionNumber);
    //
    // const sessionTherapist = d3.select('#header-therapist')
    //   .append('h6')
    //   .attr('class','header-text')
    //   .html('Therapist: ' + data.therapist);
    //
    // const sessionClient = d3.select('#header-client')
    //   .append('h6')
    //   .attr('class','header-text')
    //   .html('Client: ' + data.client.clientID);

    /************* EMPATHY BARS *************/

    const svgEmpathy = d3.select('#content-empathy')
      .append('svg');

    svgEmpathy
      .attr('class','bars-empathy')
      .attr('id','svg-empathy')
      .attr('width',w)
      .attr('transform','translate(0,40)');

    const mlScoreG = svgEmpathy
      .append('g')
      .attr('id','mlScoreG');

    const userScoreG = svgEmpathy
      .append('g')
      .attr('id','userScoreG');

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
      // .text(userScore.toFixed(2))
      .style('font-weight','bold');

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

    if(variation == 'narrative description'){
      addNarrativeBtn();
    }
    if(variation == 'confidence'){

      svgEmpathy
        .attr('height',200);

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
        .attr('y',barY+confAdj+barAdj+'px')
        .style('fill','black');

      mlScoreT
        .attr('y',confAdj+'px');

      svgEmpathy.selectAll('.rect-background')
        .attr('y',barY+confAdj+barAdj+'px');

      makeConfidenceLabels(mlScore,confInt);

    } else{

      svgEmpathy
        .attr('height',h);

      mlScoreG
        .attr('transform','translate(0,120)');

      userScoreG.append('rect')
        .attr('class','rect-background userScore');

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

    /************* BEHAVIOR COUNTS *************/

    d3.select('#content-empathy')
      .append('h6')
      .attr('id','title-counts')
      .html('BEHAVIOR COUNTS');

    const svgCounts = d3.select('#content-empathy')
      .append('svg')
      .attr('id','#counts-svg');

    svgCounts
      .attr('class','bars-counts')
      .attr('id','svg-counts')
      .attr('height',h)
      .attr('width',w)
      .attr('transform','translate(0,40)');

    const openQG = svgCounts
      .append('g')
      .attr('class','openQG')
      .attr('id','openQG');

    const complexRG = svgCounts
      .append('g')
      .attr('class','complexRG')
      .attr('id','complexRG');

    complexRG.attr('transform','translate(0,100)');

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
      createSliders(sliderObj,questionsObj,reflectionsObj,mlScore);

    } else if(variation == 'confidence') {

      createCountsBars(percentOpenQuestions,percentComplexReflections);

    } else {

      let i=-1;
      openQG.selectAll('rect-open')
        .data(openArr)
        .enter()
        .append('rect')
        .attr('class','rect-counts rect-open')
        .attr('width',barW/(openQuestions+closedQuestions))
        .attr('x',function(){
          i++;
          return i*(barW/(openQuestions+closedQuestions));
        });

      openQG.selectAll('rect-close')
        .data(closeArr)
        .enter()
        .append('rect')
        .attr('class','rect-counts rect-close')
        .attr('width',barW/(openQuestions+closedQuestions))
        .attr('x',function(){
          i++;
          return i*(barW/(openQuestions+closedQuestions));
        });

      i=-1;
      complexRG.selectAll('rect-complex')
        .data(complexArr)
        .enter()
        .append('rect')
        .attr('class','rect-counts rect-complex')
        .attr('width',barW/(complexReflections+simpleReflections))
        .attr('x',function(){
          i++;
          return i*(barW/(complexReflections+simpleReflections));
        });

      complexRG.selectAll('rect-simple')
        .data(simpleArr)
        .enter()
        .append('rect')
        .attr('class','rect-counts rect-simple')
        .attr('width',barW/(complexReflections+simpleReflections))
        .attr('x',function(){
          i++;
          return i*(barW/(complexReflections+simpleReflections));
        });

      svgCounts.selectAll('.rect-counts')
        .attr('height',barCountsH)
        .attr('y',barY)
        .style('stroke-width','2px')
        .style('stroke','white');
    }

    let perc;
    let therapist_id;

    if(variation == 'confidence'){

      // createCountsLegend();

      // const tooltip = d3.select('body').append('div')
      //   .attr('class','tooltip')
      //   .attr('id','tooltip-div')
      //   .style('opacity',0);
      //
      // tooltipPos = document.getElementById('tooltip-div').getBoundingClientRect();
      //
      // titlePos = document.getElementById('title-counts').getBoundingClientRect();
      // svgPos = document.getElementById('svg-counts').getBBox();
      // titleOffset = document.getElementById('title-counts').offsetTop;
      //
      // highlighter = svgCounts.append('rect')
      //   .attr('id','highlighter');
      //
      // svgCounts.selectAll('.rect-counts')
      //   .style('cursor','pointer')
      //   .on('mouseover',function(d){
      //     rect = this;
      //     magnify = 6;
      //     // rectPos = this.getBBox();
      //     rectPos = this.getBoundingClientRect();
      //
      //     if(d3.select(rect).classed('rect-open')){
      //       type = 'open';
      //     }else if(d3.select(rect).classed('rect-close')){
      //       type = 'close';
      //     }
      //     else if(d3.select(rect).classed('rect-complex')){
      //       type = 'complex';
      //     }else if(d3.select(rect).classed('rect-simple')){
      //       type = 'simple';
      //     }
      //
      //     // d3.select(this)
      //     //   .transition()
      //     //   .style('stroke','black');
      //
      //     // highlighter
      //     //   .transition()
      //     //   .attr('x',function(){
      //     //     return d3.select(rect).attr('x')-2;
      //     //   })
      //     //   .attr('y',function(){
      //     //     return d3.select(rect).attr('y')-2;
      //     //   })
      //     //   .attr('width',function(){
      //     //     return d3.select(rect).attr('width');
      //     //   })
      //     //   .attr('height',function(){
      //     //     return d3.select(rect).attr('height');
      //     //   });
      //       // .style('opacity',0)
      //       // .transition()
      //       // .style('opacity',1)
      //       // .style('stroke-width','2px')
      //       // .style('stroke','black');
      //
      //     tooltip
      //       .transition()
      //       .style('opacity',1);
      //     tooltip
      //       .text(type + ': ' + Math.round(d.confidence*100)+'% confidence')
      //       // .style("left", (d3.event.pageX) + "px")
      //       // .style("top", (d3.event.pageY) + "px");
      //       .style('left', rectPos.x + (rectPos.width/2) - (tooltipPos.width/2) + 'px')
      //       .style('top', rectPos.y - tooltipPos.height - 4 + 'px')
      //   })
      //   .on('mouseout',function(d){
      //
      //     d3.select(this)
      //       .transition()
      //       .style('stroke','white');
      //
      //     tooltip
      //       .transition()
      //       .style('opacity',0);
      //   })
      //   .on('click',function(d){
      //     highlight(d);
      //   });

      // openQG.selectAll('.rect-open')
      //   .style('fill',function(d){
      //     perc = 0.5+(d.confidence/2);
      //     return scaleColor(perc).hex()+'';
      //   });
      //
      // openQG.selectAll('.rect-close')
      //   .style('fill',function(d){
      //     perc = 0.5+(d.confidence/2);
      //     return scaleColor(1-perc).hex()+'';
      //   });
      //
      // complexRG.selectAll('.rect-complex')
      //   .style('fill',function(d){
      //     perc = 0.5+(d.confidence/2);
      //     return scaleColor(perc).hex()+'';
      //   });
      //
      // complexRG.selectAll('.rect-simple')
      //   .style('fill',function(d){
      //     perc = 0.5+(d.confidence/2);
      //     return scaleColor(1-perc).hex()+'';
      //   });

    };

    /************* BAR LABELS *************/

  //   mlScoreL = mlScoreG.append('g')
  //     .attr('class','labels-group');
  //
  //     mlScoreL.append('line')
  //       .attr('class','labels-lines')
  //       .attr('x1',scaleX(4))
  //       .attr('x2',scaleX(4));
  //
  //     mlScoreLT1 = mlScoreL.append('text')
  //       .attr('class','labels-text')
  //       .attr('x',scaleX(4));
  //
  //     mlScoreLT1.append('tspan')
  //       .text('Adv ')
  //       .style('font-weight','lighter');
  //
  //     mlScoreLT1.append('tspan')
  //       .text('4.0')
  //       .style('font-weight','bold');
  //
  //     mlScoreL.append('line')
  //       .attr('class','labels-lines')
  //       .attr('x1',scaleX(3.5))
  //       .attr('x2',scaleX(3.5));
  //
  //     mlScoreLT2 = mlScoreL.append('text')
  //       .attr('class','labels-text')
  //       .attr('x',scaleX(3.5));
  //
  //     mlScoreLT2.append('tspan')
  //       .text('Basic ')
  //       .style('font-weight','lighter');
  //
  //     mlScoreLT2.append('tspan')
  //       .text('3.5')
  //       .style('font-weight','bold');
  //
  // if(variation == 'confidence'){
  //
  //   mlScoreL.selectAll('.labels-lines')
  //     .attr('y1',barY+barH+confAdj+4)
  //     .attr('y2',barY+barH+confAdj+14);
  //
  //   mlScoreLT1
  //     .attr('y',barY+barH+confAdj+28);
  //
  //   mlScoreLT2
  //     .attr('y',barY+barH+confAdj+28);
  //
  // } else {
  //   mlScoreL.selectAll('.labels-lines')
  //     .attr('y1',barY+barH+4)
  //     .attr('y2',barY+barH+14);
  //
  //   mlScoreLT1
  //     .attr('y',barY+barH+28);
  //
  //   mlScoreLT2
  //     .attr('y',barY+barH+28);
  // }
  //
  //   openQL = openQG.append('g')
  //     .attr('class','labels-group');
  //
  //     openQL.append('line')
  //       .attr('class','labels-lines')
  //       .attr('x1',barW*.7)
  //       .attr('x2',barW*.7)
  //       .attr('y1',barY+barCountsH+4)
  //       .attr('y2',barY+barCountsH+14);
  //
  //     openQLT1 = openQL.append('text')
  //       .attr('class','labels-text')
  //       .attr('y',barY+barCountsH+28)
  //       .attr('x',barW*.7);
  //
  //     openQLT1.append('tspan')
  //       .text('Adv ')
  //       .style('font-weight','lighter');
  //
  //     openQLT1.append('tspan')
  //       .text('70')
  //       .style('font-weight','bold');
  //
  //     openQL.append('line')
  //       .attr('class','labels-lines')
  //       .attr('x1',barW*.5)
  //       .attr('x2',barW*.5)
  //       .attr('y1',barY+barCountsH+4)
  //       .attr('y2',barY+barCountsH+14);
  //
  //     openQLT2 = openQL.append('text')
  //       .attr('class','labels-text')
  //       .attr('y',barY+barCountsH+28)
  //       .attr('x',barW*.5);
  //
  //     openQLT2.append('tspan')
  //       .text('Basic ')
  //       .style('font-weight','lighter');
  //
  //     openQLT2.append('tspan')
  //       .text('50')
  //       .style('font-weight','bold');
  //
  //   complexRL = complexRG.append('g')
  //     .attr('class','labels-group');
  //
  //     complexRL.append('line')
  //       .attr('class','labels-lines')
  //       .attr('x1',barW*.7)
  //       .attr('x2',barW*.7)
  //       .attr('y1',barY+barCountsH+4)
  //       .attr('y2',barY+barCountsH+14);
  //
  //     complexRLT1 = complexRL.append('text')
  //       .attr('class','labels-text')
  //       .attr('y',barY+barCountsH+28)
  //       .attr('x',barW*.7);
  //
  //     complexRLT1.append('tspan')
  //       .text('Adv ')
  //       .style('font-weight','lighter');
  //
  //     complexRLT1.append('tspan')
  //       .text('70')
  //       .style('font-weight','bold');
  //
  //     complexRL.append('line')
  //       .attr('class','labels-lines')
  //       .attr('x1',barW*.5)
  //       .attr('x2',barW*.5)
  //       .attr('y1',barY+barCountsH+4)
  //       .attr('y2',barY+barCountsH+14);
  //
  //     complexRLT2 = complexRL.append('text')
  //       .attr('class','labels-text')
  //       .attr('y',barY+barCountsH+28)
  //       .attr('x',barW*.5);
  //
  //     complexRLT2.append('tspan')
  //       .text('Basic ')
  //       .style('font-weight','lighter');
  //
  //     complexRLT2.append('tspan')
  //       .text('50')
  //       .style('font-weight','bold');

    /************** SESSION TRANSCRIPT **************/

    if(variation == 'influential n-grams'){
      influenceLegend();
      influenceFunctionality(mlScore);
    }

    d3.select('#content-session')
      .append('div')
      .attr('id','container-session');

    // p for each talk turn
    // d3.select('#session-group').selectAll('.session-text')
    //   .data(data.session.talkTurn)
    //   .enter()
    //   .append('p')
    //   .attr('class',function(d){
    //     if(d.speaker == 'therapist'){
    //       return 'session-text therapist-text';
    //     }
    //     else{
    //       return 'session-text client-text';
    //     }
    //   })
    //   .attr('id',function(d){
    //     return d.speaker + '-' + d.id;
    //   })
    //   .html(function(d){
    //     return d.asrText;
    //   });

    // li for each talk turn
    // d3.select('#container-session')
    //   .append('ol')
    //   .attr('id','session-list');
    //
    // d3.select('#session-list').selectAll('.session-text')
    //   .data(data.session.talkTurn)
    //   .enter()
    //   .append('li')
    //   .attr('class',function(d){
    //     if(d.speaker == 'therapist'){
    //       return 'session-text therapist-text';
    //     }
    //     else{
    //       return 'session-text client-text';
    //     }
    //   })
    //   .attr('id',function(d){
    //     return d.speaker + '-' + d.id;
    //   })
    //   .html(function(d){
    //     return d.asrText;
    //   });

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
      .attr('id',function(d){
        return d.speaker + '-original-' + d.id;
      })
      .text(function(d){
        return d.asrText;
      });



    if(variation == 'confidence'){
      // d3.select('#container-session')
      //   .style('height','420px');
    }
    else if(variation == 'similar sessions'){
      similarSessions();
    }
    else if(variation == 'influential n-grams'){
      influence();

      // d3.select('#container-session')
      //   .style('margin-top','20px');
    }

  });

};
