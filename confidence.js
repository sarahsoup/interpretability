function makeConfidenceLabels(mlScore,confInt){

  mlScoreG = d3.select('#mlScoreG');

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
    .attr('y',barY+confAdj);

};



function createCountsBars(openPerc,complexPerc){

  openQG = d3.select('#openQG');
  complexRG = d3.select('#complexRG');

  openQG.append('rect')
    .attr('class','rect-background')
    .attr('x',0)
    .attr('y',barY+barAdj)
    .attr('width',barW)
    .attr('height',barCountsH);

  openQG.append('rect')
    .attr('class','rect-gradient')
    .attr('width',function(){
      if(100 >= (openPerc+confIntCounts)){
        return scaleP(confIntCounts*2);
      }else if(0 > (openPerc-confIntCounts)){
        diff = (openPerc-confIntCounts);
        return scaleP((confIntCounts*2)+diff);
      }else{
        diff = (openPerc+confIntCounts) - 100;
        return scaleP((confIntCounts*2)-diff);
      }
    })
    .attr('height',barCountsH)
    .attr('x',function(){
      if(0 > (openPerc-confIntCounts)){
        return 0;
      }else{
        return scaleP(openPerc-confIntCounts);
      }
    })
    .attr('y',barY+barAdj)
    .style('fill','url(#gradient)') //issue with gradient
    .style('cursor','pointer')
    .on('click',function(){ highlightAll('open'); });

  complexRG.append('rect')
    .attr('class','rect-background')
    .attr('x',0)
    .attr('y',barY+barAdj)
    .attr('width',barW)
    .attr('height',barCountsH);

  complexRG.append('rect')
    .attr('class','rect-gradient')
    .attr('width',function(){
      if(100 >= (complexPerc+confIntCounts)){
        return scaleP(confIntCounts*2);
      }else if(0 > (complexPerc-confIntCounts)){
        diff = (complexPerc-confIntCounts);
        return scaleP((confIntCounts*2)+diff);
      }else{
        diff = (complexPerc+confIntCounts) - 100;
        return scaleP((confIntCounts*2)-diff);
      }
    })
    .attr('height',barCountsH)
    .attr('x',function(){
      if(0 > (complexPerc-confIntCounts)){
        return 0;
      }else{
        return scaleP(complexPerc-confIntCounts);
      }
    })
    .attr('y',barY+barAdj)
    .style('fill','url(#gradient)')
    .style('cursor','pointer')
    .on('click',function(){ highlightAll('complex'); });

    openQG.append('text')
      .text(Math.round(openPerc))
      .attr('class','confidence-label')
      .attr('x',scaleP(openPerc));

    // there is no upper bound, how to make dynamic?
    // openQG.append('text')
    //   .text((mlScore+confInt).toFixed(2))
    //   .attr('class','confidence-label')
    //   .attr('x',scaleP(mlScore+confInt));

    openQG.append('text')
      .text(Math.round(openPerc-confIntCounts))
      .attr('class','confidence-label')
      .attr('x',scaleP(openPerc-confIntCounts));

    openQG.selectAll('.confidence-label')
      .attr('y',barY+barAdj-10);

    complexRG.append('text')
      .text(Math.round(complexPerc))
      .attr('class','confidence-label')
      .attr('x',scaleP(complexPerc));

    complexRG.append('text')
      .text(Math.round(complexPerc+confIntCounts))
      .attr('class','confidence-label')
      .attr('x',scaleP(complexPerc+confIntCounts));

    complexRG.append('text')
      .text(Math.round(complexPerc-confIntCounts))
      .attr('class','confidence-label')
      .attr('x',scaleP(complexPerc-confIntCounts));

    complexRG.selectAll('.confidence-label')
      .attr('y',barY+barAdj-10);
}

function highlight(d){
  d3.selectAll('.highlight-text')
    .classed('highlight-text',false);

  list = document.getElementById('container-session'),
  targetli = document.getElementById('therapist-' + d.id);
  list.scrollTop = targetli.offsetTop - 57; //57 is offsetTop for the first element
  d3.select('#therapist-' + d.id)
    .classed('highlight-text',true);
}

function highlightAll(code){
  d3.selectAll('.highlight-text')
    .classed('highlight-text',false);

  if(code == 'open'){
    d3.selectAll('.openQ-text')
      .classed('highlight-text',true);
  }else if(code == 'complex'){
    d3.selectAll('.complexR-text')
      .classed('highlight-text',true);
  }
}

function createCountsLegend(){
  d3.select('#svg-counts')
    .attr('height',h+20);

  legendG = d3.select('#svg-counts')
    .append('g')
    .attr('transform','translate(0,200)');

  legendG.append('text')
    .text('Level of Confidence')
    .style('font-size','14px')
    .style('font-weight','lighter');

  legendG.append('text')
    .text('Open Questions and Complex Reflections')
    .style('font-size','10px')
    .style('font-weight','lighter')
    .attr('y',30);

  legendG.append('text')
    .text('Closed Questions and Simple Reflections')
    .style('font-size','10px')
    .style('font-weight','lighter')
    .attr('y',30)
    .attr('x',(barW/2)+5);

  legendGradient1 = legendG.append('linearGradient')
    .attr('id','gradient-legend-1');

  legendGradient1.append('stop')
    .attr('offset','1%')
    .attr('stop-color',scaleColor(1).hex()+'');

  legendGradient1.append('stop')
    .attr('offset','99%')
    .attr('stop-color',scaleColor(0.5).hex()+'');

  legendG.append('rect')
    .attr('x',0)
    .attr('y',40)
    .attr('height',10)
    .attr('width',(barW/2)-10)
    .style('fill','url(#gradient-legend-1)');

  legendGradient2 = legendG.append('linearGradient')
    .attr('id','gradient-legend-2');

  legendGradient2.append('stop')
    .attr('offset','1%')
    .attr('stop-color',scaleColor(0.5).hex()+'');

  legendGradient2.append('stop')
    .attr('offset','99%')
    .attr('stop-color',scaleColor(0).hex()+'');

  legendG.append('rect')
    .attr('x',(barW/2)+5)
    .attr('y',40)
    .attr('height',10)
    .attr('width',(barW/2)-10)
    .style('fill','url(#gradient-legend-2)');

  legendG.append('text')
    .text('100%')
    .style('font-size','10px')
    .style('font-weight','lighter')
    .attr('y',64)
    .attr('x',0);

  legendG.append('text')
    .text('50%')
    .style('font-size','10px')
    .style('font-weight','lighter')
    .attr('y',64)
    .attr('x',(barW/2)-10)
    .style('text-anchor','end');

  legendG.append('text')
    .text('50%')
    .style('font-size','10px')
    .style('font-weight','lighter')
    .attr('y',64)
    .attr('x',(barW/2)+5);

  legendG.append('text')
    .text('100%')
    .style('font-size','10px')
    .style('font-weight','lighter')
    .attr('y',64)
    .attr('x',barW-5)
    .style('text-anchor','end');

}
