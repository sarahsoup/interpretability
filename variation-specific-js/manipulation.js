function createSliders(data,questions,reflections,mlScore,w){

  const column = d3.select('#content-empathy');
  let i;

  // create initial text and svg content
  column.append('h6')
    .attr('id','title-counts')
    .html('BEHAVIOR COUNTS');

  column.append('p')
    .attr('id','desc-counts')
    .style('width',barW+'px')
    .html('Here are some measures correlated with empathy. '+
    'Drag the sliders to see how the empathy score and session transcript change when these measures change.')

  const svgCounts = column.append('svg')
    .attr('id','#counts-svg');

  svgCounts
    .attr('class','bars-counts')
    .attr('id','svg-counts')
    .attr('height',h)
    .attr('width',w);

  const openQG = svgCounts
    .append('g')
    .attr('class','openQG')
    .attr('id','openQG');

  const complexRG = svgCounts
    .append('g')
    .attr('class','complexRG')
    .attr('id','complexRG');

  openQG.attr('transform','translate(0,40)');
  complexRG.attr('transform','translate(0,140)');

  const openQT = openQG.append('text')
    .attr('class','textCounts openQ')
    .attr('x','0px');
  openQT.append('tspan')
    .text('Questions: ');
  openQT.append('tspan')
    .attr('id','openQ-perc')
    .text(Math.round(data.openPerc) + '% Open')
    .style('font-weight','bold');

  const complexRT = complexRG.append('text')
    .attr('class','textCounts complexR')
    .attr('x','0px');
  complexRT.append('tspan')
    .text('Reflections: ');
  complexRT.append('tspan')
    .attr('id','complexQ-perc')
    .text(Math.round(data.complexPerc) + '% Complex')
    .style('font-weight','bold');

  openQG.append('rect')
    .attr('class','tick-counts')
    .attr('x',(barW*(1-.96)/2));

  i = 0;
  openQG.selectAll('tick-open')
    .data(questions.open)
    .enter()
    .append('rect')
    .attr('class','tick-counts tick-open')
    .attr('x',function(){
      i++;
      if(i == data.openCount){
        return ((barW*(1-.96)/2)+i*((barW*.96)/(data.openCount+data.closedCount))-1);
      }else{
        return (barW*(1-.96)/2)+i*((barW*.96)/(data.openCount+data.closedCount));
      }
    });
  i = 0;
  d3.selectAll('.tick-open')
    .attr('id',function(){
      i++;
      return 'tick-open-' + i;
    });
  i = data.openCount;
  openQG.selectAll('tick-close')
    .data(questions.close)
    .enter()
    .append('rect')
    .attr('class','tick-counts tick-close')
    .attr('x',function(){
      i++;
      return (barW*(1-.96)/2)+i*((barW*.96)/(data.openCount+data.closedCount));
    });
  i = data.openCount;
  d3.selectAll('.tick-close')
    .attr('id',function(){
      i++;
      return 'tick-close-' + i;
    });

  complexRG.append('rect')
    .attr('class','tick-counts')
    .attr('x',(barW*(1-.96)/2));
  i = 0;
  complexRG.selectAll('tick-complex')
    .data(reflections.complex)
    .enter()
    .append('rect')
    .attr('class','tick-counts tick-complex')
    .attr('x',function(){
      i++;
      if(i == data.complexCount){
        return ((barW*(1-.96)/2)+i*((barW*.96)/(data.complexCount+data.simpleCount))-1);
      }else{
        return (barW*(1-.96)/2)+i*((barW*.96)/(data.complexCount+data.simpleCount));
      }
    })
  i = 0;
  d3.selectAll('.tick-complex')
    .attr('id',function(){
      i++;
      return 'tick-complex-' + i;
    });
  i = data.complexCount;
  complexRG.selectAll('tick-simple')
    .data(reflections.simple)
    .enter()
    .append('rect')
    .attr('class','tick-counts tick-simple')
    .attr('x',function(){
      i++;
      return (barW*(1-.96)/2)+i*((barW*.96)/(data.complexCount+data.simpleCount));
    });
  i = data.complexCount;
  d3.selectAll('.tick-simple')
  .attr('id',function(){
    i++;
    return 'tick-complex-' + i;
  });

  column.selectAll('.tick-counts')
    .attr('y',40)
    .attr('width',1)
    .attr('height',4);
  column.select('#tick-open-' + data.openCount)
    .attr('y',38)
    .attr('width',2)
    .attr('height',8);
  column.select('#tick-complex-' + data.complexCount)
    .attr('y',38)
    .attr('width',2)
    .attr('height',8);

  // variables for slider inputs
  const positionOffset = h-10-barY;
  let scoreNow = mlScore;
  let diffNow = 0;
  let diffQ = 0;
  let diffR = 0;
  let diff = 0.2;
  const form = column.append('form').attr('id','form');

  // define empathy score change
  var eDiff = 5 - mlScore;
  var qDiff = (.3 * eDiff)/questions.close.length;
  var rDiff = (.6 * eDiff)/reflections.simple.length;

  // associate range steps with session text
  i = 1;
  questions.open.forEach(function(d){
    d.step = i;
    i++;
  });
  questions.close.forEach(function(d){
    d.step = i;
    i++;
  });

  i = 1;
  reflections.complex.forEach(function(d){
    d.step = i;
    i++;
  });
  reflections.simple.forEach(function(d){
    d.step = i;
    i++;
  });

  // create input ranges
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

  // reset button
  column.append('button')
    .attr('id','btn-form')
    .html('RESET')
    .style('position','relative')
    .style('top','-140px')
    .on('click',function(){
      interaction++;
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
      d3.selectAll('.rect-change')
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

  d3.csv('./manipulation_session_change.csv',function(dataChange){
    d3.select('#slider-open')
      .on('input',function(e){
        interaction++;
        let valQcurr = document.getElementById('slider-open').value;
        d3.select('#slider-open')
          .style('background','linear-gradient(to right, #19ABB5, #19ABB5 ' + (valQcurr/(data.openCount+data.closedCount)*100) + '%, #EEEEEE ' + (valQcurr/(data.openCount+data.closedCount)*100) + '%, #EEEEEE)');
        d3.select('#openQ-perc')
          .text(Math.round((valQcurr/(data.openCount+data.closedCount))*100) + '% Open');

        if(Math.round(valQcurr) < Math.round(data.openCount)){
          // d3.select('#slider-open')
          //   .style('background','linear-gradient(to right, #19ABB5, #19ABB5 ' + (valQcurr/(data.openCount+data.closedCount)*100) + '%, #EEEEEE ' + (valQcurr/(data.openCount+data.closedCount)*100) +
          //    '%, #EEEEEE ' + (data.openPerc-10) + '%, #19ABB5 ' + (data.openPerc-10) + '%, #19ABB5 ' + (data.openPerc+10) + '%, #EEEEEE ' + (data.openPerc+10) +'%, #EEEEEE)');

          if(Math.round(valQcurr) < Math.round(valQprev)){
            diffQ = diffQ - qDiff;
          }else{
            diffQ = diffQ + qDiff;
          }
          scoreNow = mlScore + diffQ + diffR;
          diffNow = diffQ + diffR;

          questions.open.forEach(function(d){
            d3.select('#therapist-original-' + d.id)
              .classed('striked-open',function(a){
                if(Math.round(valQcurr) < d.step){
                  removeTextChange(d);
                  addTextChange(d,'open',dataChange);
                  identifyTextChange(d,'open');
                  return true;
                }
                else{
                  removeTextChange(d);
                  return false;
                }
              })

          });
        }
        else if(Math.round(valQcurr) > Math.round(data.openCount)){

          if(Math.round(valQcurr) > Math.round(valQprev)){
            diffQ = diffQ + qDiff;
          }else{
            diffQ = diffQ - qDiff;
          }
          scoreNow = mlScore + diffQ + diffR;
          diffNow = diffQ + diffR;

          questions.close.forEach(function(d){
            d3.select('#therapist-original-' + d.id)
              .classed('striked-open',function(){
                if(Math.round(valQcurr) >= d.step){
                  removeTextChange(d);
                  addTextChange(d,'open',dataChange);
                  identifyTextChange(d,'open');
                  return true;
                }
                else{
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
          d3.selectAll('.rect-change-open')
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
        interaction++;
        let valRcurr = document.getElementById('slider-complex').value;
        d3.select('#slider-complex')
          .style('background','linear-gradient(to right, #19ABB5, #19ABB5 ' + (valRcurr/(data.complexCount+data.simpleCount)*100) + '%, #EEEEEE ' + (valRcurr/(data.complexCount+data.simpleCount)*100) + '%, #EEEEEE)');
        d3.select('#complexQ-perc')
          .text(Math.round((valRcurr/(data.complexCount+data.simpleCount))*100) + '% Complex');

        if(Math.round(valRcurr) < Math.round(data.complexCount)){

          if(Math.round(valRcurr) < Math.round(valRprev)){
            diffR = diffR - rDiff;
          }else{
            diffR = diffR + rDiff;
          }
          scoreNow = mlScore + diffQ + diffR;
          diffNow = diffQ + diffR;

          reflections.complex.forEach(function(d){
            d3.select('#therapist-original-' + d.id)
              .classed('striked-complex',function(){
                if(Math.round(valRcurr) < d.step){
                  removeTextChange(d);
                  addTextChange(d,'complex',dataChange);
                  identifyTextChange(d,'complex');
                  return true;
                }
                else{
                  removeTextChange(d);
                  return false;
                }
              });
          });
        }
        else if(Math.round(valRcurr) > Math.round(data.complexCount)){

          if(Math.round(valRcurr) > Math.round(valRprev)){
            diffR = diffR + rDiff;
          }else{
            diffR = diffR - rDiff;
          }
          scoreNow = mlScore + diffQ + diffR;
          diffNow = diffQ + diffR;

          reflections.simple.forEach(function(d){
            d3.select('#therapist-original-' + d.id)
              .classed('striked-complex',function(){
                if(Math.round(valRcurr) >= d.step){
                  removeTextChange(d);
                  addTextChange(d,'complex',dataChange);
                  identifyTextChange(d,'complex');
                  return true;
                }
                else{
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
          d3.selectAll('.rect-change-complex')
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

  })
}

function addTextChange(d,scale,dataChange){
  d3.select('#therapist-' + d.id)
    .append('tspan')
    .attr('class','text-change-' + scale)
    .attr('id','therapist-change-' + d.id)
    .text(function(a){
      var textChange = '';
      dataChange.forEach(function(x){
        if(a.id == x.id && ((scale == 'open' && x.measure == 'questions') || (scale == 'complex' && x.measure == 'reflections'))){
          textChange = x.change;
        }
      })
      return textChange;
    });
}

function removeTextChange(d){
  d3.select('#therapist-change-' + d.id)
    .remove();
  d3.select('#rect-change-' + d.id)
    .remove();
}

function identifyTextChange(d,scale){
  visibleH = document.getElementById('container-session').clientHeight;
  totalH = document.getElementById('container-session').scrollHeight;

  targetli = document.getElementById('therapist-' + d.id);
  targetliloc = targetli.offsetTop - 57; //57 is offsetTop for the first element

  d3.select('#tracking-svg')
    .append('rect')
    .attr('class','rect-change rect-change-' + scale)
    .attr('id','rect-change-' + d.id)
    .attr('x',8)
    .attr('y',((targetliloc/totalH)*visibleH).toFixed(0))
    .attr('height',2)
    .attr('width',10);

}
