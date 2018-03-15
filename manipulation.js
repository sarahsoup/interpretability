function createSliders(data){

  const positionOffset = h-barCountsH-barY;
  const column = d3.select('#content-empathy');

  column.append('input')
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

  column.append('input')
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


  column.append('a')
    .attr('id','btn-reset')
    .html('RESET')
    .on('click',function(){
      console.log('it worked!') //but change in value below does not work
      d3.select('#slider-open')
        .attr('value',data.openPerc);
      d3.select('#slider-complex')
        .attr('value',data.complexPerc);
    });


    var elem = document.getElementById('btn-reset');
    var rect = elem.getBoundingClientRect();
    console.log(rect.top, rect.left);

  // d3.selectAll('.slider')
  //   .on('input',function(d){
  //
  //   });


}
