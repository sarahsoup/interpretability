const h = 300;
let userScore = 4;
const barW = 500;
const barH = 50;
const barCountsH = 20;
const barY = 20;

const confAdj = 25;
const confInt = 0.4;
const scaleColor = chroma.scale(['#EEEEEE','#19ABB5']);

let totalQ = 5;
let openQ = 3;
let totalR = 6;
let complexR = 4;

let variation;

const scaleX = d3.scaleLinear().domain([0, 5]).range([0, barW]);


d3.selectAll('.btn')
  .on('click',function(d){
    variation = this.innerHTML;
    d3.select('#selection')
      .style('display','none');
    d3.select('#header')
      .classed('hidden',false);
    d3.select('#content')
      .classed('hidden',false);
    createVariation(variation);
  })


// let title = document.getElementById('title-empathy').getBoundingClientRect();
// console.log(title);

// d3.select('#content-empathy') // issue is title 'extends' the width of container
//   .append('svg')
//   .attr('href','./SVG/info.svg')
//   .attr('class','icon')
//   .attr('x',title.x + title.width)
//   .attr('y',title.y + title.height)
//   .attr('width',10)
//   .attr('height',10);

function createVariation(variation){

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
      d.codes[1] = (Number(Math.random().toFixed(3))/2) + 0.5;
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
      .attr('class','mlScoreG');

    const userScoreG = svgEmpathy
      .append('g')
      .attr('class','userScoreG');

    const userScoreT = userScoreG.append('text')
      .attr('class','textScore userScore')
      .attr('x','0px');

    userScoreT.append('tspan')
      .text('You rated the session ')
      .style('font-weight','lighter');

    userScoreT.append('tspan')
      .attr('id','userNum')
      .text(userScore.toFixed(2))
      .style('font-weight','bold');

    const mlScoreT = mlScoreG.append('text')
      .attr('class','textScore mlScore')
      .attr('x','0px');

    mlScoreT.append('tspan')
      .text('The algorithm rated the session ')
      .style('font-weight','lighter');

    mlScoreT.append('tspan')
      .attr('id','mlNum')
      .text(mlScore.toFixed(2))
      .style('font-weight','bold');

    mlScoreG.append('rect')
      .attr('class','rect-background mlScore');

    if(variation == 'confidence'){

      svgEmpathy
        .attr('height',200);

      d3.select('#userNum')
        .style('color','#F68D61');

      d3.select('#mlNum')
        .style('color','#19ABB5');

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
        .attr('y',barY+confAdj+'px')
        .style('fill','url(#gradient)');

      userScoreG.append('rect')
        .attr('class','rect-foreground userScore')
        .attr('id','userScore')
        .attr('width',4)
        .attr('height',barH+'px')
        .attr('x',scaleX(userScore)-2)
        .attr('y',barY+confAdj+'px');

      mlScoreT
        .attr('y',confAdj+'px');

      svgEmpathy.selectAll('.rect-background')
        .attr('y',barY+confAdj+'px');

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

    /************* BEHAVIOR COUNTS *************/

    d3.select('#content-empathy')
      .append('h6')
      .attr('id','title-counts')
      .html('BEHAVIOR COUNTS');

    const svgCounts = d3.select('#content-empathy')
      .append('svg');

    svgCounts
      .attr('class','bars-counts')
      .attr('height',h)
      .attr('width',w)
      .attr('transform','translate(0,40)');

    const openQG = svgCounts
      .append('g')
      .attr('class','openQG');

    const complexRG = svgCounts
      .append('g')
      .attr('class','complexRG');

    complexRG.attr('transform','translate(0,100)');

    const openQT = openQG.append('text')
      .attr('class','textCounts openQ')
      .attr('x','0px');

    openQT.append('tspan')
      .text('Open Questions ')
      .style('font-weight','lighter');

    openQT.append('tspan')
      .attr('id','openQ-perc')
      .text(Math.round(percentOpenQuestions) + '%')
      .style('font-weight','bold');

    const complexRT = complexRG.append('text')
      .attr('class','textCounts complexR')
      .attr('x','0px');

    complexRT.append('tspan')
      .text('Complex Reflections ')
      .style('font-weight','lighter');

    complexRT.append('tspan')
      .attr('id','complexQ-perc')
      .text(Math.round(percentComplexReflections) + '%')
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
      createSliders(sliderObj,questionsObj,reflectionsObj);

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
        .attr('height',barCountsH + 'px')
        .attr('y',barY+'px')
        .style('stroke-width','2px')
        .style('stroke','white');
    }

    let perc;
    let therapist_id;

    if(variation == 'confidence'){
      svgCounts.selectAll('.rect-counts')
        .style('cursor','pointer')
        .on('click',function(d){
          highlight(d);
        });

      openQG.selectAll('.rect-open')
        .style('fill',function(d){
          perc = 0.5+(d.confidence/2);
          return scaleColor(perc).hex()+'';
        });

          // let sessionG = document.getElementById('session-group');
          // let targetp = document.getElementById('therapist-' + d.id);
          // console.log(sessionG.scrollTop);
          // sessionG.scrollTop = targetp.offsetTop - 100;
          // console.log(targetp.offsetTop);
          // sessionG.scrollTop = 200;


      openQG.selectAll('.rect-close')
        .style('fill',function(d){
          perc = 0.5+(d.confidence/2);
          return scaleColor(1-perc).hex()+'';
        });

      complexRG.selectAll('.rect-complex')
        .style('fill',function(d){
          perc = 0.5+(d.confidence/2);
          return scaleColor(perc).hex()+'';
        });

      complexRG.selectAll('.rect-simple')
        .style('fill',function(d){
          perc = 0.5+(d.confidence/2);
          return scaleColor(1-perc).hex()+'';
        });

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

    d3.select('#content-session')
      .append('div')
      .attr('id','container-session');
      // .append('g')
      // .attr('id','session-group');

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

    // try list
    d3.select('#container-session')
      .append('ol')
      .attr('id','session-list');

    d3.select('#session-list').selectAll('.session-text')
      .data(data.session.talkTurn)
      .enter()
      .append('li')
      .attr('class',function(d){
        if(d.speaker == 'therapist'){
          return 'session-text therapist-text';
        }
        else{
          return 'session-text client-text';
        }
      })
      .attr('id',function(d){
        return d.speaker + '-' + d.id;
      })
      .html(function(d){
        return d.asrText;
      });

    if(variation == 'confidence'){
      d3.select('#container-session')
        .style('height','420px');
    }

    if(variation == 'similar sessions'){
      similarSessions();
    }
console.log(data.session.talkTurn);
  });

};
