function createDescription(){

  /* MODAL TRIGGER */
  d3.select('.container')
    .append('button')
    .attr('id','modal-btn')
    .html('ABOUT THE ALGORITHM')
    .on('click',function(){
      modal.style('display','block');
    });

  const btnW = document.getElementById('modal-btn').clientWidth;

  d3.select('#modal-btn')
    .style('margin-left',((barW/2)-(btnW/2)) + 'px');

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

// function addAlgBtn(){
//   console.log('addAlgBtn ran');
//   d3.select('#textScore-ml')
//     .style('display','inline-block');
//
//   /* MODAL TRIGGER */
//   d3.select('#mlScoreG')
//     .append('button')
//     .attr('id','modal-btn')
//     .html('ABOUT THE ALGORITHM')
//     .style('float','left')
//     .on('click',function(){
//       modal.style('display','block');
//     });
// }
