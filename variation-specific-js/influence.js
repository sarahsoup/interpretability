const influenceThreshold = +0.75;
const ngramPosSet = new Set();
const ngramNegSet = new Set();
const scoreDiff = 1; //manually selected empathy change
let lastBtnClicked = 'none';

// influenceChange() changes text in session transcript - to be overwritten

function influenceLegend(talkTurn){
  d3.select('#content-empathy')
    .append('h6')
    .attr('id','title-nGram')
    .html('INFLUENTIAL WORDS AND PHRASES');

  d3.select('#content-empathy')
    .append('p')
    .attr('class','ngram-legend')
    .style('font-size','12px')
    .style('width',barW+'px')
    .style('margin-top','30px')
    .html('The most influential words and phrases to the empathy score are listed below and emphasized in the session transcript. ' +
    'Some are <span class="pos">pro-empathy</span> and some are <span class="neg">anti-empathy</span>.')

  row = d3.select('#content-empathy')
    .append('div')
    .attr('class','row')
    .style('width',barW+'px');

  posList = row.append('div')
    .attr('class','col-sm-6')
    .append('ul');

  negList = row.append('div')
    .attr('class','col-sm-6')
    .append('ul');

  talkTurn.forEach(function(d){
    if(d.speaker == 'therapist' && d.influence > influenceThreshold){
      ngramPosSet.add(d.asrText);
    }else if(d.speaker == 'therapist' && d.influence < -influenceThreshold){
      ngramNegSet.add(d.asrText);
    }
  })

  for (let item of ngramPosSet)
  posList
    .append('li')
    .attr('class','list-pos pos')
    .html(item);

  for (let item of ngramNegSet)
  negList
    .append('li')
    .attr('class','list-neg neg')
    .html(item);
}

function influenceFunctionality(mlScore){

  d3.select('#content-session')
    .append('p')
    .attr('class','ngram-legend')
    .style('font-size','12px')
    .style('width',barW+'px')
    .style('margin-top','30px')
    .style('margin-bottom','10px')
    .html('Click the buttons below to see how changing the ' +
    'most influential words and phrases to all positive or negative affect the empathy score.');

  btns = d3.select('#content-session')
    .append('g')
    .attr('id','btn-group');
  btns.append('text')
    .html('CHANGE TO:')
    .style('font-size','10px')
    .style('margin-right','10px');

  btns.append('button')
    .attr('id','btn-positive')
    .attr('class','btn-influence')
    .html('ALL PRO-EMPATHY')
    .on('click',function(){
      interaction++;
      influenceChange('positive');
      empathyChange('positive',mlScore);
      lastBtnClicked = 'positive';
    });

  btns.append('button')
    .attr('id','btn-negative')
    .attr('class','btn-influence')
    .html('ALL ANTI-EMPATHY')
    .on('click',function(){
      interaction++;
      influenceChange('negative');
      empathyChange('negative',mlScore);
      lastBtnClicked = 'negative';
    });

  btns.append('button')
    .attr('id','btn-reset')
    .html('RESET')
    .on('click',function(){
      interaction++;
      influence();
      empathyChange('reset',mlScore);
      lastBtnClicked = 'reset';
    });

}

function influence(){

  d3.selectAll('.btn-influence')
    .style('background-color','white');

  d3.select('#btn-positive')
    .style('color','#70B276');

  d3.select('#btn-negative')
    .style('color','#CC6471');


  d3.selectAll('.therapist-text')
    .filter(function(d){ return d.influence < -influenceThreshold })
    .classed('text-influence-neg',true)
    .select('.therapist-original')
    .classed('striked-neg',false)
    .style('color','#CC6471')
    .style('font-weight','bolder');
  d3.selectAll('.text-change-pos').remove();

  d3.selectAll('.therapist-text')
    .filter(function(d){ return d.influence > influenceThreshold })
    .classed('text-influence-pos',true)
    .select('.therapist-original')
    .classed('striked-pos',false)
    .style('color','#70B276')
    .style('font-weight','bolder');
  d3.selectAll('.text-change-neg').remove();

}

function influenceChange(direction){
  if(direction == 'positive'){
    d3.select('#btn-positive')
      .style('color','white')
      .style('background-color','#70B276');
    d3.select('#btn-negative')
      .style('color','#CC6471')
      .style('background-color','white');
    d3.selectAll('.text-influence-pos')
      .select('.therapist-original')
      .classed('striked-pos',false);
    d3.selectAll('.text-change-neg').remove();
    d3.selectAll('.text-influence-neg')
      .select('.therapist-original')
      .classed('striked-neg',true);
    if(lastBtnClicked != 'positive'){
      d3.selectAll('.text-influence-neg')
        .append('tspan')
        .attr('class','text-change-pos')
        .attr('id',function(d){ return 'therapist-change-' + d.id; })
        .classed('striked-neg',false)
        .text('(changed to pro-empathy word/phrase)');
    }
  }else if(direction == 'negative'){
    d3.select('#btn-negative')
      .style('color','white')
      .style('background-color','#CC6471');
    d3.select('#btn-positive')
      .style('color','#70B276')
      .style('background-color','white');
    d3.selectAll('.text-influence-neg')
      .select('.therapist-original')
      .classed('striked-neg',false);
    d3.selectAll('.text-change-pos').remove();
    d3.selectAll('.text-influence-pos')
      .select('.therapist-original')
      .classed('striked-pos',true);
    if(lastBtnClicked != 'negative'){
      d3.selectAll('.text-influence-pos')
        .append('tspan')
        .attr('class','text-change-neg')
        .attr('id',function(d){ return 'therapist-change-' + d.id; })
        .classed('striked-pos',false)
        .text('(changed to anti-empathy word/phrase)');
    }
  }
}

function empathyChange(direction,mlScore){
  if(direction == 'positive'){
    scoreNew = mlScore + scoreDiff;
    d3.select('#mlScore')
      .transition()
      .attr('width',scaleX(scoreNew));
    d3.select('#scoreChange')
      .style('fill','#EEEEEE')
      .transition()
      .style('opacity',1);
    d3.select('#mlNum')
      .text(scoreNew.toFixed(2));
    d3.select('#mlNumChange')
      .text(' (up ' + scoreDiff.toFixed(2) + ')')
      .style('fill','#70B276')
      .style('font-weight','bolder');

  }else if(direction == 'negative'){
    scoreNew = mlScore - scoreDiff;
    d3.select('#mlScore')
      .transition()
      .attr('width',scaleX(scoreNew));
    d3.select('#scoreChange')
      .style('fill','#19ABB5')
      .transition()
      .style('opacity',1);
    d3.select('#mlNum')
      .text(scoreNew.toFixed(2));
    d3.select('#mlNumChange')
      .text(' (down ' + scoreDiff.toFixed(2) + ')')
      .style('fill','#CC6471')
      .style('font-weight','bolder');
  }else{
    d3.select('#mlScore')
      .transition()
      .attr('width',scaleX(mlScore));
    d3.select('#scoreChange')
      .transition()
      .style('opacity',0);
    d3.select('#mlNum')
      .text(mlScore.toFixed(2));
    d3.select('#mlNumChange')
      .text(null);
  }
}
