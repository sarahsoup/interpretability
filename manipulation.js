function createSliders(data,questions,reflections,mlScore){
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

  i = 0;
  d3.select('#openQG').selectAll('tick-open')
    .data(questions.open)
    .enter()
    .append('rect')
    .attr('class','tick-counts tick-open')
    .attr('x',function(){
      i++;
      return (barW*(1-.96)/2)+i*((barW*.96)/(data.openCount+data.closedCount));
    });

  d3.select('#openQG').selectAll('tick-close')
    .data(questions.close)
    .enter()
    .append('rect')
    .attr('class','tick-counts tick-close')
    .attr('x',function(){
      i++;
      return (barW*(1-.96)/2)+i*((barW*.96)/(data.openCount+data.closedCount));
    });

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

  i = 0;
  d3.select('#complexRG').selectAll('tick-complex')
    .data(reflections.complex)
    .enter()
    .append('rect')
    .attr('class','tick-counts tick-complex')
    .attr('x',function(){
      i++;
      return (barW*(1-.96)/2)+i*((barW*.96)/(data.complexCount+data.simpleCount));
    });

  d3.select('#complexRG').selectAll('tick-simple')
    .data(reflections.simple)
    .enter()
    .append('rect')
    .attr('class','tick-counts tick-simple')
    .attr('x',function(){
      i++;
      return (barW*(1-.96)/2)+i*((barW*.96)/(data.complexCount+data.simpleCount));
    });

  column.selectAll('.tick-counts')
    .attr('y',40)
    .attr('width',1)
    .attr('height',4);

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
      d3.selectAll('.striked-open')
        .classed('striked-open',false);
      d3.selectAll('.striked-complex')
        .classed('striked-complex',false);
      d3.selectAll('.text-change-open')
        .remove();
      d3.selectAll('.text-change-complex')
        .remove();

      scoreNow = mlScore;
      diffNow = 0;

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
    });


  var left = document.getElementById('btn-form').getBoundingClientRect().left;
  var right = document.getElementById('btn-form').getBoundingClientRect().right;
  var btnWidth = right-left;

  d3.select('#btn-form')
    .style('left',(barW/2)-(btnWidth/2) + 'px');

  scoreNow = mlScore;
  diffNow = 0;
  diff = 0.2;
  valQprev = document.getElementById('slider-open').value;
  valRprev = document.getElementById('slider-complex').value;

  d3.select('#slider-open')
    .on('input',function(e){

      let valQcurr = document.getElementById('slider-open').value;
      d3.select('#openQ-perc')
        .text(Math.round(valQcurr) + '%');

      if(Math.round(valQcurr) < Math.round(data.openPerc)){

        if(Math.round(valQcurr) < Math.round(valQprev)){
          scoreNow = scoreNow - diff;
          diffNow = diffNow - diff;
        }else{
          scoreNow = scoreNow + diff;
          diffNow = diffNow + diff;
        }

        d3.select('#mlScore')
          .transition()
          .attr('width',scaleX(scoreNow));
        d3.select('#scoreChange')
          .style('fill','#19ABB5')
          .transition()
          .style('opacity',1);
        d3.select('#mlNum')
          .text(scoreNow.toFixed(2));
        d3.select('#mlNumChange')
          .text(' (down ' + Math.abs(diffNow.toFixed(2)) + ')')
          .style('fill','#CC6471')
          .style('font-weight','bolder');

        questions.open.forEach(function(d){
          d3.select('#therapist-original-' + d.id)
            .classed('striked-open',function(a){
              if(Math.round(valQcurr) < d.step){
                if(d3.select(this).classed('striked-open') == false){
                  jumpToText(d);
                }
                removeTextChange(d);
                addTextChange(d,'open');
                return true;
              }
              else{
                if(d3.select(this).classed('striked-open') == true){
                  jumpToText(d);
                }
                removeTextChange(d);
                return false;
              }
            })

        });
      }
      else if(Math.round(valQcurr) > Math.round(data.openPerc)){

        if(Math.round(valQcurr) > Math.round(valQprev)){
          scoreNow = scoreNow + diff;
          diffNow = diffNow + diff;
        }else{
          scoreNow = scoreNow - diff;
          diffNow = diffNow - diff;
        }

        d3.select('#mlScore')
          .transition()
          .attr('width',scaleX(scoreNow));
        d3.select('#scoreChange')
          .style('fill','#EEEEEE')
          .transition()
          .style('opacity',1);
        d3.select('#mlNum')
          .text(scoreNow.toFixed(2));
        d3.select('#mlNumChange')
          .text(' (up ' + Math.abs(diffNow.toFixed(2)) + ')')
          .style('fill','#19ABB5')
          .style('font-weight','bolder');

        questions.close.forEach(function(d){
          d3.select('#therapist-original-' + d.id)
            .classed('striked-open',function(){
              if(Math.round(valQcurr) >= d.step){
                if(d3.select(this).classed('striked-open') == false){
                  jumpToText(d);
                }
                removeTextChange(d);
                addTextChange(d,'open');
                return true;
              }
              else{
                if(d3.select(this).classed('striked-open') == true){
                  jumpToText(d);
                }
                removeTextChange(d);
                return false;
              }
          });
        });
      }
      else{
        d3.selectAll('.striked-open')
          .classed('striked-open',false);
        d3.selectAll('.text-change-open')
          .remove();

        scoreNow = mlScore;
        diffNow = 0;

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

      valQprev = document.getElementById('slider-open').value;

    });

  d3.select('#slider-complex')
    .on('input',function(e){
      let valRcurr = document.getElementById('slider-complex').value;
      d3.select('#complexQ-perc')
        .text(Math.round(valRcurr) + '%');

      if(Math.round(valRcurr) < Math.round(data.complexPerc)){

        if(Math.round(valRcurr) < Math.round(valRprev)){
          scoreNow = scoreNow - diff;
          diffNow = diffNow - diff;
        }else{
          scoreNow = scoreNow + diff;
          diffNow = diffNow + diff;
        }

        d3.select('#mlScore')
          .transition()
          .attr('width',scaleX(scoreNow));
        d3.select('#scoreChange')
          .style('fill','#19ABB5')
          .transition()
          .style('opacity',1);
        d3.select('#mlNum')
          .text(scoreNow.toFixed(2));
        d3.select('#mlNumChange')
          .text(' (down ' + Math.abs(diffNow.toFixed(2)) + ')')
          .style('fill','#CC6471')
          .style('font-weight','bolder');

        reflections.complex.forEach(function(d){
          d3.select('#therapist-original-' + d.id)
            .classed('striked-complex',function(){
              if(Math.round(valRcurr) < d.step){
                if(d3.select(this).classed('striked-complex') == false){
                  jumpToText(d);
                }
                removeTextChange(d);
                addTextChange(d,'complex');
                return true;
              }
              else{
                if(d3.select(this).classed('striked-complex') == true){
                  jumpToText(d);
                }
                removeTextChange(d);
                return false;
              }
            });
        });
      }
      else if(Math.round(valRcurr) > Math.round(data.complexPerc)){

        if(Math.round(valRcurr) > Math.round(valRprev)){
          scoreNow = scoreNow + diff;
          diffNow = diffNow + diff;
        }else{
          scoreNow = scoreNow - diff;
          diffNow = diffNow - diff;
        }

        d3.select('#mlScore')
          .transition()
          .attr('width',scaleX(scoreNow));
        d3.select('#scoreChange')
          .style('fill','#EEEEEE')
          .transition()
          .style('opacity',1);
        d3.select('#mlNum')
          .text(scoreNow.toFixed(2));
        d3.select('#mlNumChange')
          .text(' (up ' + Math.abs(diffNow.toFixed(2)) + ')')
          .style('fill','#19ABB5')
          .style('font-weight','bolder');

        reflections.simple.forEach(function(d){
          d3.select('#therapist-original-' + d.id)
            .classed('striked-complex',function(){
              if(Math.round(valRcurr) >= d.step){
                if(d3.select(this).classed('striked-complex') == false){
                  jumpToText(d);
                }
                removeTextChange(d);
                addTextChange(d,'complex');
                return true;
              }
              else{
                if(d3.select(this).classed('striked-complex') == true){
                  jumpToText(d);
                }
                removeTextChange(d);
                return false;
              }
          });
        });
      }
      else{
        d3.selectAll('.striked-complex')
          .classed('striked-complex',false);
        d3.selectAll('.text-change-complex')
          .remove();

        scoreNow = mlScore;
        diffNow = 0;

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

      valRprev = document.getElementById('slider-complex').value;

    });

}

function addTextChange(d,scale){
  d3.select('#therapist-' + d.id)
    .append('tspan')
    .attr('class','text-change-' + scale)
    .attr('id','therapist-change-' + d.id)
    .text(function(a){
      return a.asrText;
    });
}

function removeTextChange(d){
  d3.select('#therapist-change-' + d.id)
    .remove();
}

function jumpToText(d){
  list = document.getElementById('container-session'),
  targetli = document.getElementById('therapist-' + d.id);
  list.scrollTop = targetli.offsetTop - 57; //57 is offsetTop for the first element
}
