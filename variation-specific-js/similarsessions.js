// similar session audio from brian
// empathy scores manually pulled from ./output/similar-sessions files
const similarSessionGood1 = './audio/tascam_20150427_ad_ts_bj_gt_clip.wav';
const empathyGood1 = '3.32';
const similarSessionGood2 = './audio/tascam_20150430_ad_bp_ha_gt_clip.wav';
const empathyGood2 = '3.56';
const similarSessionBad1 = './audio/tascam_20150430_bp_ad_ha_bt_clip.wav';
const empathyBad1 = '3.38';
const similarSessionBad2 = './audio/tascam_20150504_bp_ts_al_bt_clip.wav';
const empathyBad2 = '3.49';

// for calculating max listening time for each audio file
let audioMax1 = 0;
let audioMax2 = 0;

function similarSessions(){

  d3.select('#content-empathy')
    .append('h6')
    .attr('id','title-similar')
    .html('SIMILAR SESSIONS');

  d3.select('#content-empathy')
    .append('p')
    .attr('id','desc-similar')
    .style('width',barW+'px')
    .html('The software rated these sessions similarly to the one you heard. Press the play button to listen to an excerpt from each session.')

  const container = d3.select('#content-empathy')
    .append('div')
    .attr('id','container-similar')
    .attr('width',barW)
    .style('margin-top','30px');

  container.append('p')
    .style('font-size','12px')
    .html(function(){
      if(session == sessionGood){
        return 'Session 1 Empathy Score: <span class="bold">' + empathyGood1 + '</span>';
      }else if(session == sessionBad){
        return 'Session 1 Empathy Score: <span class="bold">' + empathyBad1 + '</span>';
      }
    });

    container.append('div')
      .attr('id','collapse-1');

    similarPlayAudio('1');

    container.append('p')
      .style('font-size','12px')
      .style('mergin-top','10px')
      .html(function(){
        if(session == sessionGood){
          return 'Session 2 Empathy Score: <span class="bold">' + empathyGood2 + '</span>';
        }else if(session == sessionBad){
          return 'Session 2 Empathy Score: <span class="bold">' + empathyBad2 + '</span>';
        }
      });

    container.append('div')
      .attr('id','collapse-2');

    similarPlayAudio('2');

  // function similarFlipIcon(num){
  //   icon = d3.select('#icon-'+num);
  //   if(icon.classed('fa-chevron-down')){
  //     icon.classed('fa-chevron-down',false);
  //     icon.classed('fa-chevron-up',true);
  //   }else{
  //     icon.classed('fa-chevron-up',false);
  //     icon.classed('fa-chevron-down',true);
  //   }
  // };

  function similarPlayAudio(div){
    d3.select('#collapse-' + div)
      .append('audio')
      .attr('id','session-audio' + div)
      .append('source')
      .attr('src',function(){
        if(session == sessionGood){
          if(div == '1'){
            return similarSessionGood1;
          }else if(div == '2'){
            return similarSessionGood2;
          }
        }else if(session == sessionBad){
          if(div == '1'){
            return similarSessionBad1;
          }else if(div == '2'){
            return similarSessionBad2;
          }
        }
      })
      .attr('type','audio/wav');

    d3.select('#session-audio' + div)
      .on('timeupdate',function(){
        similarUpdateProgressBar(div);
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
        similarTogglePlayPause(div);
      });
    d3.select('#btn-play-' + div)
      .append('i')
      .attr('id','icon-play-' + div)
      .attr('class','fas fa-play fa-sm');
    d3.select('#audio-controls-' + div)
      .append('button')
      .attr('id','btn-stop-' + div)
      .attr('class','btn-stop')
      .attr('title','stop')
      .on('click',function(d){
        similarStopPlayer(div);
      });
    d3.select('#btn-stop-' + div)
      .append('i')
      .attr('id','icon-stop-' + div)
      .attr('class','fas fa-fast-backward fa-sm');
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

  function similarTogglePlayPause(div) {
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

  function similarStopPlayer(div){
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

  function similarUpdateProgressBar(div){
    audioPlayer = document.getElementById('session-audio' + div);
    progress = d3.select('#progress-' + div);
    progressBar = d3.select('#progress-bar-' + div);
    percentage = (audioPlayer.currentTime / audioPlayer.duration);
    totalW = parseInt(progress.style('width'),10);
    progressW = (totalW * percentage).toFixed(2);
    progressBar.style('width',progressW + 'px');
    if(div == '1'){
      if(audioMax1 < audioPlayer.currentTime){
        audioMax1 = audioPlayer.currentTime;
      }
    }else if(div == '2'){
      if(audioMax2 < audioPlayer.currentTime){
        audioMax2 = audioPlayer.currentTime;
      }
    }
    interaction = +(audioMax1 + audioMax2).toFixed(0);
  }

}
