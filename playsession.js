function playSession(){
  d3.select('#session-audio0')
    .append('source')
    .attr('src',sessionAudio);

  d3.select('#session-audio0')
    .on('timeupdate',function(){
      updateProgressBar(0);
    });

  d3.select('.audio-container')
    .append('div')
    .attr('id','audio-controls-0')
    .attr('class','audio-controls')
    .style('padding','20px 20px')
    .append('button')
    .attr('id','btn-play-0')
    .attr('class','btn-play')
    .attr('title','play')
    .on('click',function(d){
      togglePlayPause(0);
    });
  d3.select('#btn-play-0')
    .append('i')
    .attr('id','icon-play-0')
    .attr('class','far fa-play-circle fa-2x');
  d3.select('#audio-controls-0')
    .append('button')
    .attr('id','btn-stop-0')
    .attr('class','btn-stop')
    .attr('title','stop')
    .on('click',function(d){
      stopPlayer(0);
    });
  d3.select('#btn-stop-0')
    .append('i')
    .attr('id','icon-stop-0')
    .attr('class','far fa-stop-circle fa-2x');
  progressDiv = d3.select('#audio-controls-0')
    .append('div')
    .attr('class','progress')
    .attr('id','progress-0')
    .style('display','inline-block')
    .style('margin-left','10px')
    .style('margin-bottom','8px')
    .style('width','80%')
    .style('height','10px')
    .style('border-radius','5px');
  progressDiv
    .append('div')
    .attr('class','progress-bar')
    .attr('id','progress-bar-0')
    .style('width','0px')
    .style('height','10px')
    .style('background-color','black')
    .style('border-radius','5px');
}

function togglePlayPause(div) {
  let audioPlayer = document.getElementById('session-audio' + div);
  let btn = document.getElementById('btn-play-' + div);
  icon = d3.select('#icon-play-' + div);
   if (audioPlayer.paused || audioPlayer.ended) {
      btn.title = 'pause';
      btn.className = 'btn-pause';
      icon.classed('fa-play-circle',false);
      icon.classed('fa-pause-circle',true);
      audioPlayer.play();
   }
   else {
      btn.title = 'play';
      btn.className = 'btn-play';
      icon.classed('fa-play-circle',true);
      icon.classed('fa-pause-circle',false);
      audioPlayer.pause();
   }
}

function stopPlayer(div){
  audioPlayer = document.getElementById('session-audio' + div);
  audioPlayer.pause();
  audioPlayer.currentTime = 0;

  btn = document.getElementById('btn-play-' + div);
  icon = d3.select('#icon-play-' + div);
  btn.title = 'play';
  btn.className = 'btn-play';
  icon.classed('fa-play-circle',true);
  icon.classed('fa-pause-circle',false);

  progressBar = document.getElementById('progress-bar-' + div);
  progressBar.value = 0;
}

function updateProgressBar(div){
  audioPlayer = document.getElementById('session-audio' + div);
  progress = d3.select('#progress-' + div);
  progressBar = d3.select('#progress-bar-' + div);
  percentage = (100 / audioPlayer.duration) * audioPlayer.currentTime;
  totalW = parseInt(progress.style('width'),10);
  progressW = (totalW * (percentage/100)).toFixed(2);
  progressBar.style('width',progressW + 'px');
  if(listenMaxDur < audioPlayer.currentTime){
    listenMaxDur = audioPlayer.currentTime;
  }
}
