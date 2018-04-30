function createSliders(data,questions,reflections,mlScore){
  console.log(questions);
  console.log(reflections);

  const positionOffset = h-10-barY;
  let scoreNow = mlScore;
  let diffNow = 0;
  let diffQ = 0;
  let diffR = 0;
  let diff = 0.2;
  const column = d3.select('#content-empathy');
  const form = column.append('form').attr('id','form');

  // associate range steps with session text
  let i = 1;
  // let step = 100/(data.openCount+data.closedCount);
  questions.open.forEach(function(d){
    d.step = i;
    // d.step = Math.round(step * i);
    i++;
  });
  questions.close.forEach(function(d){
    d.step = i;
    // d.step = Math.round(step * i);
    i++;
  });

  i = 1;
  // step = 100/(data.complexCount+data.simpleCount)
  reflections.complex.forEach(function(d){
    d.step = i;
    // d.step = Math.round(step * i);
    i++;
  });
  reflections.simple.forEach(function(d){
    d.step = i;
    // d.step = Math.round(step * i);
    i++;
  });
  // console.log('open+close = '+ (data.openCount+data.closedCount));
  // console.log('step = ' + (100/(data.openCount+data.closedCount)).toFixed(1));
  // console.log('complex+simple = '+ (data.complexCount+data.simpleCount));
  // console.log('step = ' + 100/(data.complexCount+data.simpleCount));

  form.append('input')
    .attr('class','slider')
    .attr('id','slider-open')
    .attr('type','range')
    .style('height','10px')
    .style('width',barW + 'px')
    .style('position','relative')
    .style('top','-250px')
    .style('background','linear-gradient(to right, #19ABB5, #19ABB5 ' + data.openPerc + '%, #EEEEEE ' + data.openPerc + '%, #EEEEEE)')
    .style('border-radius','10px')
    .attr('min','0')
    .attr('max',(data.openCount+data.closedCount))
    .attr('step',1)
    .attr('value',data.openCount);

  d3.select('#openQG')
    .append('rect')
    .attr('class','tick-counts')
    .attr('x',(barW*(1-.96)/2));

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
    .style('height','10px')
    .style('width',barW + 'px')
    .style('position','relative')
    .style('top','-174px')
    .style('background','linear-gradient(to right, #19ABB5, #19ABB5 ' + data.complexPerc + '%, #EEEEEE ' + data.complexPerc + '%, #EEEEEE)')
    .style('border-radius','10px')
    .attr('min','0')
    .attr('max',(data.complexCount+data.simpleCount))
    .attr('step',1)
    .attr('value',data.complexCount);

  d3.select('#complexRG')
    .append('rect')
    .attr('class','tick-counts')
    .attr('x',(barW*(1-.96)/2));

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
    .style('top','-140px')
    .on('click',function(){
      document.getElementById('form').reset();
      d3.select('#slider-open')
        .style('background','linear-gradient(to right, #19ABB5, #19ABB5 ' + data.openPerc + '%, #EEEEEE ' + data.openPerc + '%, #EEEEEE)');
      d3.select('#slider-complex')
        .style('background','linear-gradient(to right, #19ABB5, #19ABB5 ' + data.complexPerc + '%, #EEEEEE ' + data.complexPerc + '%, #EEEEEE)');
      valQprev = document.getElementById('slider-open').value;
      valRprev = document.getElementById('slider-complex').value;
      d3.select('#openQ-perc')
        .text(Math.round(data.openPerc) + '% Open');
      d3.select('#complexQ-perc')
        .text(Math.round(data.complexPerc) + '% Complex');
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
      diffQ = 0;
      diffR = 0;

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

  valQprev = document.getElementById('slider-open').value;
  valRprev = document.getElementById('slider-complex').value;

  d3.select('#slider-open')
    .on('input',function(e){

      let valQcurr = document.getElementById('slider-open').value;
      d3.select('#slider-open')
        .style('background','linear-gradient(to right, #19ABB5, #19ABB5 ' + (valQcurr/(data.openCount+data.closedCount)*100) + '%, #EEEEEE ' + (valQcurr/(data.openCount+data.closedCount)*100) + '%, #EEEEEE)');
      d3.select('#openQ-perc')
        .text(Math.round((valQcurr/(data.openCount+data.closedCount))*100) + '% Open');

      if(Math.round(valQcurr) < Math.round(data.openCount)){

        if(Math.round(valQcurr) < Math.round(valQprev)){
          diffQ = diffQ - diff;
        }else{
          diffQ = diffQ + diff;
        }
        scoreNow = mlScore + diffQ + diffR;
        diffNow = diffQ + diffR;

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
      else if(Math.round(valQcurr) > Math.round(data.openCount)){

        if(Math.round(valQcurr) > Math.round(valQprev)){
          diffQ = diffQ + diff;
        }else{
          diffQ = diffQ - diff;
        }
        scoreNow = mlScore + diffQ + diffR;
        diffNow = diffQ + diffR;

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

        diffQ = 0;
        scoreNow = mlScore + diffQ + diffR;
        diffNow = diffQ + diffR;
      }

      d3.select('#mlScore')
        .transition()
        .attr('width',scaleX(scoreNow));
      if(diffNow < 0){
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
      }else if(diffNow > 0){
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
      }else{
        d3.select('#scoreChange')
          .transition()
          .style('opacity',0);
        d3.select('#mlNum')
          .text(scoreNow.toFixed(2));
        d3.select('#mlNumChange')
          .text(null);
      }
      valQprev = document.getElementById('slider-open').value;

    });

  d3.select('#slider-complex')
    .on('input',function(e){
      let valRcurr = document.getElementById('slider-complex').value;
      d3.select('#slider-complex')
        .style('background','linear-gradient(to right, #19ABB5, #19ABB5 ' + (valRcurr/(data.complexCount+data.simpleCount)*100) + '%, #EEEEEE ' + (valRcurr/(data.complexCount+data.simpleCount)*100) + '%, #EEEEEE)');
      d3.select('#complexQ-perc')
        .text(Math.round((valRcurr/(data.complexCount+data.simpleCount))*100) + '% Complex');

      if(Math.round(valRcurr) < Math.round(data.complexCount)){

        if(Math.round(valRcurr) < Math.round(valRprev)){
          diffR = diffR - diff;
        }else{
          diffR = diffR + diff;
        }
        scoreNow = mlScore + diffQ + diffR;
        diffNow = diffQ + diffR;

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
      else if(Math.round(valRcurr) > Math.round(data.complexCount)){

        if(Math.round(valRcurr) > Math.round(valRprev)){
          diffR = diffR + diff;
        }else{
          diffR = diffR - diff;
        }
        scoreNow = mlScore + diffQ + diffR;
        diffNow = diffQ + diffR;

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

        diffR = 0;
        scoreNow = mlScore + diffQ + diffR;
        diffNow = diffQ + diffR;
      }
      d3.select('#mlScore')
        .transition()
        .attr('width',scaleX(scoreNow));
      if(diffNow < 0){
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
      }else if(diffNow > 0){
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
      }else{
        d3.select('#scoreChange')
          .transition()
          .style('opacity',0);
        d3.select('#mlNum')
          .text(scoreNow.toFixed(2));
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
