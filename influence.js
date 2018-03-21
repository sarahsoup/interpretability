function influence(){
  console.log('the function ran!');
  
  d3.selectAll('.therapist-text')
    .filter(function(d){ return d.influence < -0.5 })
    .style('color','white')
    .style('background-color','#CC6471');

  d3.selectAll('.therapist-text')
    .filter(function(d){ return d.influence > 0.5 })
    .style('color','white')
    .style('background-color','#19ABB5');
}
