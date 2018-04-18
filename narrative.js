function createDescription(){

  /* MODAL  */
  const modal = d3.select('.container')
    .append('div')
    .attr('class','modal');

  // window.onclick = function(event) {
  //     if (event.target == modal) {
  //         modal.style.display = "none";
  //     }
  // };

  /* MODAL CONTENT */
  const content = modal.append('div')
    .attr('class','modal-content');

  const header = content.append('div')
    .attr('class','modal-header');

  const body = content.append('div')
    .attr('class','modal-body');

  // const footer = content.append('div')
  //   .attr('class','modal-footer');

  header.append('h6')
    .html('ABOUT THE ALGORITHM');

  // header.append('span')
  //   .attr('class','close')
  //   .html('&times;')
  //   .on('click',function(){
  //     modal.style('display','none');
  //   });

  body.append('p')
    .html('This is text about the algorithm');

  body.append('button')
    .attr('id','modal-content-btn')
    .html('OKAY')
    .on('click',function(){
      modal.style('display','none');
    });

}

function addNarrativeBtn(){
  /* MODAL TRIGGER */
  d3.select('#content-empathy')
    .append('button')
    .attr('id','modal-btn')
    .on('click',function(){
      d3.select('.modal')
        .style('display','block');
    });

  d3.select('#modal-btn')
    .append('i')
    .attr('id','modal-icon')
    .attr('class','far fa-question-circle fa-lg');

  textPos = document.getElementById('textScore-ml').getBBox();
  textTop = document.getElementById('textScore-ml').getBoundingClientRect().top;
  textLeft = document.getElementById('textScore-ml').getBoundingClientRect().left;
  textRight = document.getElementById('textScore-ml').getBoundingClientRect().right;
  btnW = document.getElementById('modal-btn').clientWidth;

  d3.select('#modal-btn')
    .style('top',(textTop+48) + 'px')
    .style('left',(textRight-textLeft) + 'px');
}
