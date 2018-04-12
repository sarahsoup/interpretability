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
  // d3.select('#title-similar')
  //   .style('padding-top',yOffset + 'px');

  const container = d3.select('#content-session')
    .append('div')
    .attr('id','container-similar')
    .attr('width','100%')
    // .attr('height','300px')
    .attr('height','100px') // doesn't change anything
    .style('margin-top','40px')
    .append('g');

  d3.json('./transcript.json',function(data){

    /* create accordian */
    accordionButton1 = container.append('button')
      .attr('class','accordion')
      .attr('id','accordion-1')
      .attr('data-toggle','collapse')
      .attr('data-target','#collapse-1')
      .on('click',function(){
        flipIcon('1');
      });
    accordionButton1
      .append('i')
      .attr('class','icon')
      .attr('id','icon-1')
      .attr('class','icon fas fa-chevron-down fa-2x');
    accordionButton1
      .append('text')
      .text('EMPATHY SCORE ' + data.scores.globals.empathy.toFixed(2));
    container.append('div')
      .attr('class','collapse')
      .attr('id','collapse-1');
      // .classed('accordion-first', true)
    playAudio('1');

    accordionButton2 = container.append('button')
      .attr('class','accordion')
      .attr('id','accordion-2')
      .attr('data-toggle','collapse')
      .attr('data-target','#collapse-2')
      .on('click',function(){
        flipIcon('2');
      });
    accordionButton2
      .append('i')
      .attr('class','icon')
      .attr('id','icon-2')
      .attr('class','icon fas fa-chevron-down fa-2x');
    accordionButton2
      .append('text')
      .text('EMPATHY SCORE ' + data.scores.globals.empathy.toFixed(2));
    container.append('div')
      .attr('class','collapse')
      .attr('id','collapse-2');
    playAudio('2');

    accordionButton3 = container.append('button')
      .attr('class','accordion')
      .attr('id','accordion-3')
      .attr('data-toggle','collapse')
      .attr('data-target','#collapse-3')
      .on('click',function(){
        flipIcon('3');
      });
    accordionButton3
      .append('i')
      .attr('class','icon')
      .attr('id','icon-3')
      .attr('class','icon fas fa-chevron-down fa-2x');
    accordionButton3
      .append('text')
      .text('EMPATHY SCORE ' + data.scores.globals.empathy.toFixed(2));
    container.append('div')
      .attr('class','collapse')
      .attr('id','collapse-3');
    playAudio('3');

    // container.selectAll('.collapse')
    //   // .style('padding', '20px 20px')
    //   .style('font-size', '10px');
    //   // .style('border-bottom','1px solid black');

    // function createSession(){
    //
    //   container.select('#session-list-1').selectAll('.session-text')
    //     .data(data.session.talkTurn)
    //     .enter()
    //     .append('li')
    //     .attr('class',function(d){
    //       if(d.speaker == 'therapist'){
    //         return 'session-text therapist-text';
    //       }
    //       else{
    //         return 'session-text client-text';
    //       }
    //     })
    //     .attr('id',function(d){
    //       return d.speaker + '-' + d.id;
    //     })
    //     .html(function(d){
    //       return d.asrText;
    //     });
    //
    // }

  });

  function flipIcon(num){
    icon = d3.select('#icon-'+num);
    if(icon.classed('fa-chevron-down')){
      icon.classed('fa-chevron-down',false);
      icon.classed('fa-chevron-up',true);
    }else{
      icon.classed('fa-chevron-up',false);
      icon.classed('fa-chevron-down',true);
    }
  };

  function playAudio(div){
    d3.select('#collapse-' + div)
      .append('audio')
      .attr('id','session-audio' + div)
      .append('source')
      // .attr('src','./3072492.wav')
      // .attr('src','http://www.dropbox.com/home/Psychotherapy%20Transcripts?preview=3072492.wav') //put in html, add s if github pages doesn't work
      // .attr('src','http://www.dropbox.com/s/vnmvl05zqj6ovfx/3072492.wav')
      // .attr('src','http://drive.google.com/open?id=0B7OaBHt0PWMwZjVXVmxiZTJ0VU0')
      .attr('type','audio/wav');

    d3.select('#session-audio' + div)
      .on('timeupdate',function(){
        updateProgressBar(div);
      });

    d3.select('#collapse-' + div)
      .append('div')
      .attr('id','audio-controls-' + div)
      .attr('class','audio-controls')
      .append('button')
      .attr('id','btn-play-' + div)
      .attr('class','btn-play')
      .attr('title','play')
      .on('click',function(d){
        togglePlayPause(div);
      });
    d3.select('#btn-play-' + div)
      .append('i')
      .attr('id','icon-play-' + div)
      .attr('class','far fa-play-circle fa-lg');
    d3.select('#audio-controls-' + div)
      .append('button')
      .attr('id','btn-stop-' + div)
      .attr('class','btn-stop')
      .attr('title','stop')
      .on('click',function(d){
        stopPlayer(div);
      });
    d3.select('#btn-stop-' + div)
      .append('i')
      .attr('id','icon-stop-' + div)
      .attr('class','far fa-stop-circle fa-lg');
    progressDiv = d3.select('#audio-controls-' + div)
      .append('div')
      .attr('class','progress')
      .attr('id','progress-' + div)
      .style('display','inline-block')
      .style('margin-left','10px')
      .style('width','400px')
      .style('height','10px')
      .style('border-radius','5px');
    progressDiv
      .append('div')
      .attr('class','progress-bar')
      .attr('id','progress-bar-' + div)
      .style('width','0px')
      .style('height','10px')
      .style('background-color','black')
      .style('border-radius','5px');
  }

  // function togglePlayPause(div) {
  //   let audioPlayer = document.getElementById('session-audio' + div);
  //   let btn = document.getElementById('btn-play-' + div);
  //   icon = d3.select('#icon-play-' + div);
  //    if (audioPlayer.paused || audioPlayer.ended) {
  //       btn.title = 'pause';
  //       btn.className = 'btn-pause';
  //       icon.classed('fa-play-circle',false);
  //       icon.classed('fa-pause-circle',true);
  //       audioPlayer.play();
  //    }
  //    else {
  //       btn.title = 'play';
  //       btn.className = 'btn-play';
  //       icon.classed('fa-play-circle',true);
  //       icon.classed('fa-pause-circle',false);
  //       audioPlayer.pause();
  //    }
  // }
  //
  // function stopPlayer(div){
  //   audioPlayer = document.getElementById('session-audio' + div);
  //   audioPlayer.pause();
  //   audioPlayer.currentTime = 0;
  //
  //   btn = document.getElementById('btn-play-' + div);
  //   btn.title = 'play';
  //   btn.className = 'btn-play';
  //
  //   progressBar = document.getElementById('progress-bar' + div);
  //   progressBar.value = 0;
  // }
  //
  // function updateProgressBar(div){
  //   audioPlayer = document.getElementById('session-audio' + div);
  //   progress = d3.select('#progress-' + div);
  //   progressBar = d3.select('#progress-bar-' + div);
  //   percentage = (100 / audioPlayer.duration) * audioPlayer.currentTime;
  //   totalW = parseInt(progress.style('width'),10);
  //   progressW = (totalW * (percentage/100)).toFixed(2);
  //   progressBar.style('width',progressW + 'px');
  // }

}
