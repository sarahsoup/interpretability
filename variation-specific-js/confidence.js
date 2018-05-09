function makeEmpathyBars(mlScore){

  d3.select('#mlNum')
    .style('fill','#19ABB5');

  // increase svg height to accomodate additional line of text
  d3.select('#svg-empathy')
    .attr('height',h+25);

  // add second line of text about confidence interval
  d3.select('#textScore-ml')
    .append('tspan')
    .attr('x',0)
    .attr('dy',secondLnAdj)
    .text('with a confidence interval of ')
  d3.select('#textScore-ml')
    .append('tspan')
    .text('(' + (mlScore-confInt).toFixed(2) + ', ' + (mlScore+confInt).toFixed(2) + ')')
    .style('fill','#19ABB5')
    .style('font-weight','bold');

  // append gradient for confidence interval
  const gradient = d3.select('#mlScoreG').append('linearGradient')
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
  d3.select('#mlScoreG').append('rect')
    .attr('class','rect-gradient mlScore')
    .attr('id','mlScore')
    .attr('width',scaleX(confInt*2))
    .attr('height',barH)
    .attr('x',scaleX(mlScore-confInt))
    .attr('y',barY+confAdj+barAdj+secondLnAdj+'px')
    .style('fill','url(#gradient)');

  // append user score rect
  d3.select('#userScoreG').append('rect')
    .attr('class','rect-foreground userScore')
    .attr('id','userScore')
    .attr('width',4)
    .attr('height',barH+'px')
    .attr('x',scaleX(userScore)-2)
    .attr('y',barY+barAdj+'px')
    .style('fill','black');

  // y-pos adjustments
  d3.select('#textScore-ml')
    .attr('y',confAdj+'px');
  d3.select('#userScoreG').selectAll('.rect-background')
    .attr('y',barY+barAdj+'px');
  d3.select('#mlScoreG').selectAll('.rect-background')
    .attr('y',barY+confAdj+barAdj+secondLnAdj+'px');
}

function makeConfidenceLabels(mlScore){

  // for placing labels below bar (set to zero if prefer them above)
  const belowBar = 75;

  mlScoreG = d3.select('#mlScoreG');

  // append text
  mlScoreG.append('text')
    .text(mlScore.toFixed(2))
    .attr('class','confidence-label')
    .attr('x',scaleX(mlScore));
  mlScoreG.append('text')
    .text((mlScore+confInt).toFixed(2))
    .attr('class','confidence-label')
    .attr('x',scaleX(mlScore+confInt));
  mlScoreG.append('text')
    .text((mlScore-confInt).toFixed(2))
    .attr('class','confidence-label')
    .attr('x',scaleX(mlScore-confInt));
  mlScoreG.selectAll('.confidence-label')
    .attr('y',barY+confAdj+secondLnAdj+belowBar);

  // append lines
  mlScoreG.append('line')
    .attr('class','confidence-line')
    .attr('x1',scaleX(mlScore-confInt)+14)
    .attr('x2',scaleX(mlScore)-14);
  mlScoreG.append('line')
    .attr('class','confidence-line')
    .attr('x1',scaleX(mlScore)+14)
    .attr('x2',scaleX(mlScore+confInt)-14);
  mlScoreG.selectAll('.confidence-line')
    .attr('y1',barY+confAdj+secondLnAdj+belowBar-3)
    .attr('y2',barY+confAdj+secondLnAdj+belowBar-3)
    .style('stroke','black')
    .style('stroke-width','1px');

};
