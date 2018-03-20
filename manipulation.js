function createSliders(data,questions,reflections){
  const positionOffset = h-barCountsH-barY;
  const column = d3.select('#content-empathy');
  const form = column.append('form').attr('id','form');

  // associate range steps with session text
  let i = 1;
  let step = 100/(data.openCount+data.closedCount);
  questions.open.forEach(function(d){
    d.step = Math.round(step * i);
    i++;
  });
  questions.close.forEach(function(d){
    d.step = Math.round(step * i);
    i++;
  });

  i = 1;
  step = 100/(data.complexCount+data.simpleCount)
  reflections.complex.forEach(function(d){
    d.step = Math.round(step * i);
    i++;
  });
  reflections.simple.forEach(function(d){
    d.step = Math.round(step * i);
    i++;
  });

  form.append('input')
    .attr('class','slider')
    .attr('id','slider-open')
    .attr('type','range')
    .style('height',barH + 'px')
    .style('width',barW + 'px')
    .style('position','relative')
    .style('top','-' + positionOffset + 'px')
    .attr('min','0')
    .attr('max','100')
    .attr('step',100/(data.openCount+data.closedCount))
    .attr('value',data.openPerc);

  form.append('input')
    .attr('class','slider')
    .attr('id','slider-complex')
    .attr('type','range')
    .style('height',barH + 'px')
    .style('width',barW + 'px')
    .style('position','relative')
    .style('top','-' + (positionOffset-100+56) + 'px')
    .attr('min','0')
    .attr('max','100')
    .attr('step',100/(data.complexCount+data.simpleCount))
    .attr('value',data.complexPerc);

  column.append('button')
    .attr('id','btn-form')
    .html('RESET')
    .style('position','relative')
    .style('top','-170px')
    .on('click',function(){
      document.getElementById('form').reset();
      d3.select('#openQ-perc')
        .text(Math.round(data.openPerc) + '%');
      d3.select('#complexQ-perc')
        .text(Math.round(data.complexPerc) + '%');
      d3.select('.highlight-text')
        .classed('highlight-text',false);
      // console.log(document.getElementById('form').reset());
      // console.log(data.openPerc);
      // d3.select('#slider-open')
      //   .attr('value',100);
      // console.log(document.getElementById('slider-open').value);
      // d3.select('#slider-complex')
      //   .attr('value',data.complexPerc);
    });


  var left = document.getElementById('btn-form').getBoundingClientRect().left;
  var right = document.getElementById('btn-form').getBoundingClientRect().right;
  var btnWidth = right-left;

  d3.select('#btn-form')
    .style('left',(barW/2)-(btnWidth/2) + 'px');


  d3.select('#slider-open')
    .on('input',function(d){

      let valQcurr = document.getElementById('slider-open').value;
      d3.select('#openQ-perc')
        .text(Math.round(valQcurr) + '%');

      if(Math.round(valQcurr) < Math.round(data.openPerc)){
        questions.open.forEach(function(d){
          d3.select('#therapist-' + d.id)
            .classed('highlight-text',function(){
              if(Math.round(valQcurr) <= d.step){
                return true;
              }
              else{ return false; }
            });
        });
      }
      else if(Math.round(valQcurr) > Math.round(data.openPerc)){
        questions.close.forEach(function(d){
          d3.select('#therapist-' + d.id)
            .classed('highlight-text',function(){
              if(Math.round(valQcurr) <= d.step){
                return true;
              }
              else{ return false; }
          });
        });
      }
      else{
        d3.selectAll('.highlight-text')
          .classed('highlight-text',false);
      }
    });

  d3.select('#slider-complex')
    .on('input',function(d){
      let valRcurr = document.getElementById('slider-complex').value;
      d3.select('#complexQ-perc')
        .text(Math.round(valRcurr) + '%');

      if(Math.round(valRcurr) < Math.round(data.complexPerc)){
        reflections.complex.forEach(function(d){
          d3.select('#therapist-' + d.id)
            .classed('highlight-text',function(){
              if(Math.round(valRcurr) <= d.step){
                return true;
              }
              else{ return false; }
            });
        });
      }
      else if(Math.round(valRcurr) > Math.round(data.complexPerc)){
        reflections.simple.forEach(function(d){
          d3.select('#therapist-' + d.id)
            .classed('highlight-text',function(){
              if(Math.round(valRcurr) >= d.step){
                return true;
              }
              else{ return false; }
          });
        });
      }
      else{
        d3.selectAll('.highlight-text')
          .classed('highlight-text',false);
      }
    });


}
