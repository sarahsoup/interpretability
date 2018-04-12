function influenceLegend(){
  ngramLegend = d3.select('#content-session')
    .append('text')
    .attr('class','ngram-legend')
    .style('font-size','10px');

  ngramLegend.append('tspan')
    .text('most ');
  ngramLegend.append('tspan')
    .text('positively')
    .style('color','#70B276')
    .style('font-weight','bolder');
    // .style('background-color','#19ABB5');
  ngramLegend.append('tspan')
    .text(' and ');
  ngramLegend.append('tspan')
    .text('negatively')
    .style('color','#CC6471')
    .style('font-weight','bolder');
    // .style('background-color','#CC6471');
  ngramLegend.append('tspan')
    .text(' influential words and phrases');
}


function influenceFunctionality(mlScore){
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
    .html('ALL POSITIVE')
    .on('click',function(){
      influenceChange('positive');
      empathyChange('positive',mlScore);
    });

  btns.append('button')
    .attr('id','btn-negative')
    .attr('class','btn-influence')
    .html('ALL NEGATIVE')
    .on('click',function(){
      influenceChange('negative');
      empathyChange('negative',mlScore);
    });

  btns.append('button')
    .attr('id','btn-reset')
    .html('RESET')
    .on('click',function(){
      influence();
      empathyChange('reset',mlScore);
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
    .filter(function(d){ return d.influence < -0.75 })
    .style('color','#CC6471')
    .style('font-weight','bolder');
    // .style('background-color','#CC6471');

  d3.selectAll('.therapist-text')
    .filter(function(d){ return d.influence > 0.75 })
    .style('color','#70B276')
    .style('font-weight','bolder');
    // .style('background-color','#19ABB5');
}


function influenceChange(direction){
  if(direction == 'positive'){
    d3.select('#btn-positive')
      .style('color','white')
      .style('background-color','#70B276');
    d3.select('#btn-negative')
      .style('color','#CC6471')
      .style('background-color','white');
  }else if(direction == 'negative'){
    d3.select('#btn-negative')
      .style('color','white')
      .style('background-color','#CC6471');
    d3.select('#btn-positive')
      .style('color','#70B276')
      .style('background-color','white');
  }

  d3.selectAll('.therapist-text')
    .filter(function(d){ return (d.influence < -0.75 || d.influence > 0.75) })
    .style('color',function(){
      if(direction == 'positive'){ return '#70B276'; }
      else if(direction == 'negative'){ return '#CC6471'; }
    });
}

function empathyChange(direction,mlScore){
  if(direction == 'positive'){
    scoreDiff = 1;
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
    scoreDiff = 1;
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
