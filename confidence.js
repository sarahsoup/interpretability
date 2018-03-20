function highlight(d){
  d3.selectAll('.highlight-text')
    .classed('highlight-text',false);

  list = document.getElementById('container-session'),
  targetli = document.getElementById('therapist-' + d.id);
  console.log(list.scrollTop);
  console.log(targetli.offsetTop);
  list.scrollTop = targetli.offsetTop - 57; //57 is offsetTop for the first element
  console.log(list.scrollTop);
  d3.select('#therapist-' + d.id)
    .classed('highlight-text',true);
}
