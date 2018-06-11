// const influenceThreshold = +0.75;
// const ngramPosSet = new Set();
// const ngramNegSet = new Set();
let lastBtnClicked = 'none';

let influenceArr = [];
let posTop,negTop;
const spanPosStart = '<span class="text-influence-pos">';
const spanNegStart = '<span class="text-influence-neg">';
const spanEnd = '</span>';
const spanChngPos = '<span class="text-change-pos">';
const spanChngNeg = '<span class="text-change-neg">';

async function influenceLegend(talkTurn){
  d3.select('#content-empathy')
    .append('h6')
    .attr('id','title-nGram')
    .html('INFLUENTIAL WORDS AND PHRASES');

  d3.select('#content-empathy')
    .append('p')
    .attr('class','ngram-legend')
    .style('font-size','12px')
    .style('width',barW+'px')
    .style('margin-top','30px')
    .html('The most influential words and phrases to the empathy score are listed below and emphasized in the session transcript. ' +
    '<span class="pos">Pro-empathy</span> phrases tend to raise empathy scores, while <span class="neg">anti-empathy</span> phrases tend to lower empathy scores.')

  row = d3.select('#content-empathy')
    .append('div')
    .attr('class','row')
    .style('width',barW+'px');

  posList = row.append('div')
    .attr('class','col-sm-6')
    .append('ul');

  negList = row.append('div')
    .attr('class','col-sm-6')
    .append('ul');

  const params = await d3.csv('../empathyparams.csv');
  console.log(params);

  const promise = new Promise((resolve, reject)=>{
    params.forEach(function(i){
      let count=0;
      i.ngram = i.ngram.replace(/_/g,' ');
      i.influence = +i.influence;
      talkTurn.forEach(function(d){
        if(d.speaker == 'therapist' && d.asrText.includes(i.ngram)){
          index = d.asrText.indexOf(i.ngram)
          if((index == 0 || d.asrText.charAt(index-1) == ' ') && ((index+i.ngram.length) == d.asrText.length || d.asrText.charAt(index+i.ngram.length) == ' ')){
            count++;
          }
        }
      })
      if(count > 0){ influenceArr.push(i);}
    })
    resolve(influenceArr);
  })

  promise.then(function(influenceArr){
    console.log(influenceArr);
    influenceArr.sort(function(a,b){ return b.influence-a.influence; })
    posTop = influenceArr.slice(0,10);
    negTop = influenceArr.slice(-10);
    negTop.sort(function(a,b){ return a.influence-b.influence; })

    d3.selectAll('.therapist-original')
      .html(function(d){
        posTop.forEach(function(p){
          if(d.asrText.includes(p.ngram)){
            index = d.asrText.indexOf(p.ngram)
            if((index == 0 || d.asrText.charAt(index-1) == ' ') && ((index+p.ngram.length) == d.asrText.length || d.asrText.charAt(index+p.ngram.length) == ' ')){
              d.asrText = [d.asrText.slice(0, index), spanPosStart, d.asrText.slice(index,index+p.ngram.length), spanEnd, spanChngNeg, spanEnd, d.asrText.slice(index+p.ngram.length)].join('');
            }
          }
        })
        negTop.forEach(function(n){
          if(d.asrText.includes(n.ngram)){
            index = d.asrText.indexOf(n.ngram)
            if((index == 0 || d.asrText.charAt(index-1) == ' ') && ((index+n.ngram.length) == d.asrText.length || d.asrText.charAt(index+n.ngram.length) == ' ')){
              d.asrText = [d.asrText.slice(0, index), spanNegStart, d.asrText.slice(index,index+n.ngram.length), spanEnd, spanChngPos, spanEnd, d.asrText.slice(index+n.ngram.length)].join('');
            }
          }
        })
        return d.asrText;
      })

    for (let item of posTop)
    posList
      .append('li')
      .attr('class','list-pos pos')
      .html(item.ngram);

    for (let item of negTop)
    negList
      .append('li')
      .attr('class','list-neg neg')
      .html(item.ngram);

  }).catch((reason)=>{
    console.log('Handle rejected promise ('+reason+') here.');
  })
}

function influenceFunctionality(mlScore){

  btns = d3.select('#content-session')
    .append('g')
    .attr('id','btn-group');
  btns.append('text')
    .html('CHANGE TO:')
    .style('font-size','10px')
    .style('margin-right','10px');

  btns.append('button')
    .attr('id','btn-positive')
    .attr('class','btn-influence')
    .html('ALL PRO-EMPATHY')
    .on('click',function(){
      interaction++;
      influenceChange('positive');
      empathyChange('positive',mlScore);
      lastBtnClicked = 'positive';
    });

  btns.append('button')
    .attr('id','btn-negative')
    .attr('class','btn-influence')
    .html('ALL ANTI-EMPATHY')
    .on('click',function(){
      interaction++;
      influenceChange('negative');
      empathyChange('negative',mlScore);
      lastBtnClicked = 'negative';
    });

  btns.append('button')
    .attr('id','btn-reset')
    .html('RESET')
    .on('click',function(){
      interaction++;
      influence();
      empathyChange('reset',mlScore);
      lastBtnClicked = 'reset';
    });

}

function influence(){

  d3.selectAll('.btn-influence')
    .style('background-color','white');

  d3.select('#btn-positive')
    .style('color','#70B276');

  d3.select('#btn-negative')
    .style('color','#CC6471');


  d3.selectAll('.text-influence-neg')
    .classed('striked-neg',false)
    .style('color','#CC6471');
    // .style('font-weight','bolder');
  d3.selectAll('.text-change-pos')
    .text('');

  d3.selectAll('.text-influence-pos')
    .classed('striked-pos',false)
    .style('color','#70B276');
    // .style('font-weight','bolder');
  d3.selectAll('.text-change-neg')
    .text('');

}

function influenceChange(direction){
  if(direction == 'positive'){
    d3.select('#btn-positive')
      .style('color','white')
      .style('background-color','#70B276');
    d3.select('#btn-negative')
      .style('color','#CC6471')
      .style('background-color','white');
    d3.selectAll('.text-influence-pos')
      .classed('striked-pos',false);
    d3.selectAll('.text-change-neg')
      .text('');
    d3.selectAll('.text-influence-neg')
      .classed('striked-neg',true);
    if(lastBtnClicked != 'positive'){
      d3.selectAll('.text-change-pos')
        .text(' [positive]');
    }
  }else if(direction == 'negative'){
    d3.select('#btn-negative')
      .style('color','white')
      .style('background-color','#CC6471');
    d3.select('#btn-positive')
      .style('color','#70B276')
      .style('background-color','white');
    d3.selectAll('.text-influence-neg')
      .classed('striked-neg',false);
    d3.selectAll('.text-change-pos')
      .text('');
    d3.selectAll('.text-influence-pos')
      .classed('striked-pos',true);
    if(lastBtnClicked != 'negative'){
      d3.selectAll('.text-change-neg')
        .text(' [negative]');
    }
  }
}

function empathyChange(direction,mlScore){
  if(direction == 'positive'){
    scoreDiff = (scoreMax-mlScore)*.75;
    scoreNew = mlScore + scoreDiff;
    d3.select('#mlScore')
      .transition()
      .attr('width',scaleX(scoreNew));
    d3.select('#scoreChange')
      .style('fill','#EEEEEE')
      .transition()
      .style('opacity',1);
    d3.select('#mlNum')
      .text(scoreNew.toFixed(1));
    d3.select('#mlNumChange')
      .text(' (up ' + scoreDiff.toFixed(1) + ')')
      .style('fill','#70B276')
      .style('font-weight','bolder');

  }else if(direction == 'negative'){
    scoreDiff = mlScore*.75;
    scoreNew = mlScore - scoreDiff;
    d3.select('#mlScore')
      .transition()
      .attr('width',scaleX(scoreNew));
    d3.select('#scoreChange')
      .style('fill','#19ABB5')
      .transition()
      .style('opacity',1);
    d3.select('#mlNum')
      .text(scoreNew.toFixed(1));
    d3.select('#mlNumChange')
      .text(' (down ' + scoreDiff.toFixed(1) + ')')
      .style('fill','#CC6471')
      .style('font-weight','bolder');
  }else{
    d3.select('#mlScore')
      .transition()
      .attr('width',scaleX(mlScore));
    d3.select('#scoreChange')
      .transition()
      .style('opacity',0);
    d3.select('#mlNum')
      .text(mlScore.toFixed(1));
    d3.select('#mlNumChange')
      .text(null);
  }
}
