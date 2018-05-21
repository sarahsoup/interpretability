function createDescription(){

  /* MODAL  */
  const modal = d3.select('.container')
    .append('div')
    .attr('class','modal');

  /* MODAL CONTENT */
  const content = modal.append('div')
    .attr('class','modal-content');

  const header = content.append('div')
    .attr('class','modal-header');

  const body = content.append('div')
    .attr('class','modal-body');

  header.append('h6')
    .html('ABOUT THE SOFTWARE');

  body.append('p')
    .style('font-size','14px')
    .html(aboutAlg);

  body.append('button')
    .attr('id','modal-content-btn')
    .attr('class','btn')
    .html('okay')
    .on('click',function(){
      modal.style('display','none');
    });

}
