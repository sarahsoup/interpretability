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
      enableRating();
    });
  d3.select('#btn-play-0')
    .append('i')
    .attr('id','icon-play-0')
    .attr('class','fas fa-play fa-lg');
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
    .attr('class','fas fa-fast-backward fa-lg');

  progressDiv = d3.select('#audio-controls-0')
    .append('div')
    .attr('class','progress')
    .attr('id','progress-0')
    .style('display','inline-block')
    .style('margin-left','10px')
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
      icon.classed('fa-play',false);
      icon.classed('fa-pause',true);
      audioPlayer.play();
   }
   else {
      btn.title = 'play';
      btn.className = 'btn-play';
      icon.classed('fa-play',true);
      icon.classed('fa-pause',false);
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
  icon.classed('fa-play',true);
  icon.classed('fa-pause',false);

  progressBar = document.getElementById('progress-bar-' + div);
  progressBar.value = 0;
}

function updateProgressBar(div){
  audioPlayer = document.getElementById('session-audio' + div);
  progress = d3.select('#progress-' + div);
  progressBar = d3.select('#progress-bar-' + div);
  percentage = (audioPlayer.currentTime / audioPlayer.duration);
  totalW = parseInt(d3.select('#progress-0').style('width'),10);
  progressW = (totalW * percentage).toFixed(2);
  progressBar.style('width',progressW + 'px');
  if(listenMaxDur < audioPlayer.currentTime){
    listenMaxDur = audioPlayer.currentTime;
  }
}

function enableRating(){
  document.getElementById('radio-1').removeAttribute('disabled');
  document.getElementById('radio-2').removeAttribute('disabled');
  document.getElementById('radio-3').removeAttribute('disabled');
  document.getElementById('radio-4').removeAttribute('disabled');
  document.getElementById('radio-5').removeAttribute('disabled');
  document.getElementById('radio-6').removeAttribute('disabled');
  document.getElementById('radio-7').removeAttribute('disabled');
  d3.selectAll('label')
    .style('color','black');
  d3.selectAll('.label-end')
    .style('color','black');
}
