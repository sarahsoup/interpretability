function similarSessions(){
  d3.select('#container-session')
    .style('height','268px'); //svg-empathy (300) height minus difference in top-pos (32)

  d3.select('#content-session')
    .append('h6')
    .attr('id','title-similar')
    .html('SIMILAR SESSIONS');

  const countsTitle = document.getElementById('title-counts');
  const countsTitleTop = countsTitle.getBoundingClientRect().top;
  const similarTitle = document.getElementById('title-similar');
  const similarTitleTop = similarTitle.getBoundingClientRect().top;
  // console.log(countsTitleTop, similarTitleTop);
  const yOffset = countsTitleTop-similarTitleTop;
  // console.log(yOffset);
  d3.select('#title-similar')
    .style('padding-top',yOffset + 'px');

  const container = d3.select('#content-session')
    .append('div')
    .attr('id','container-similar')
    .attr('width','100%')
    .attr('height','300px')
    .style('margin-top','40px')
    .append('g');

  // container
  //   .append('image')
  //   .attr('src','./SVG/caret.svg')
  //   .attr('x',0)
  //   .attr('y',0)
  //   .attr('width',0)
  //   .attr('height',0);

  d3.json('./transcript.json',function(data){

    /* create accordian */
    container.append('button')
      .attr('class','accordian')
      .attr('id','accordian-1')
      .attr('data-toggle','collapse')
      .attr('data-target','#collapse-1')
      .html('EMPATHY SCORE ' + data.scores.globals.empathy.toFixed(2));
    container.append('div')
      .attr('class','collapse')
      .attr('id','collapse-1')
      .append('ol')
      .attr('id','session-list-1');
    createSession();

    container.append('button')
      .attr('class','accordian')
      .attr('id','accordian-2')
      .attr('data-toggle','collapse')
      .attr('data-target','#collapse-2')
      .html('EMPATHY SCORE ' + data.scores.globals.empathy.toFixed(2));
    container.append('div')
      .attr('class','collapse')
      .attr('id','collapse-2');
    // playAudio();

    // container.append('button')
    //   .attr('class','accordian')
    //   .attr('id','accordian-3')
    //   .attr('data-toggle','collapse')
    //   .attr('data-target','#collapse-3')
    //   .html('SESSION 5678');
    // container.append('div')
    //   .attr('class','collapse')
    //   .attr('id','collapse-3')
    //   .append('p')
    //   .html('this is the content!');
    //
    // container.append('button')
    //   .attr('class','accordian')
    //   .attr('id','accordian-4')
    //   .attr('data-toggle','collapse')
    //   .attr('data-target','#collapse-4')
    //   .html('SESSION 5678');
    // container.append('div')
    //   .attr('class','collapse')
    //   .attr('id','collapse-4')
    //   .append('p')
    //   .html('this is the content!');
    //
    // container.append('button')
    //   .attr('class','accordian')
    //   .attr('id','accordian-5')
    //   .attr('data-toggle','collapse')
    //   .attr('data-target','#collapse-5')
    //   .html('SESSION 5678');
    // container.append('div')
    //   .attr('class','collapse')
    //   .attr('id','collapse-5')
    //   .append('p')
    //   .html('this is the content!');

    container.selectAll('.collapse')
      // .style('padding', '20px 20px')
      .style('font-size', '10px');
      // .style('border-bottom','1px solid black');

    function createSession(){

      container.select('#session-list-1').selectAll('.session-text')
        .data(data.session.talkTurn)
        .enter()
        .append('li')
        .attr('class',function(d){
          if(d.speaker == 'therapist'){
            return 'session-text therapist-text';
          }
          else{
            return 'session-text client-text';
          }
        })
        .attr('id',function(d){
          return d.speaker + '-' + d.id;
        })
        .html(function(d){
          return d.asrText;
        });

    }

  });

  // function playAudio(){
  //   d3.select('#collapse-2')
  //     .append('audio')
  //     .attr('id','session-audio')
  //     .append('source')
  //     .attr('src','./3072492.wav')
  //     .attr('type','audio/wav');
  //
  //   d3.select('#collapse-2')
  //     .append('div')
  //     .attr('id','audio-controls')
  //     .append('button')
  //     .attr('id','btn-play-pause')
  //     .attr('title','play')
  //     .html('play')
  //     .on('click',togglePlayPause());
  //
  // }
  //
  // function togglePlayPause() {
  //   const audioPlayer = document.getElementById('session-audio');
  //   const btn = document.getElementById('btn-play-pause');
  //    if (audioPlayer.paused || audioPlayer.ended) {
  //       btn.title = 'pause';
  //       btn.innerHTML = 'pause';
  //       btn.className = 'pause';
  //       audioPlayer.play();
  //    }
  //    else {
  //       btn.title = 'play';
  //       btn.innerHTML = 'play';
  //       btn.className = 'play';
  //       audioPlayer.pause();
  //    }
  // }

}
