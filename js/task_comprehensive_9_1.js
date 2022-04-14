"use strict";
//総合課題9_1 解答を下記に書く
var handCards = 5;
let tranpAce = 1;
let tranpKing = 13;
var cards = [];
var pHand = [];
var cHand = [];
var pRank = 0;
var cRank = 0;
let checkMark = [];
let dupl = [];
let flash = 0;
let duplCheck;
let duplNum;
let maxValueP;
let maxValueC;
let result = [
  { rolename : 'ロイヤルフラッシュ', rank : 0 },
  { rolename : 'ストレートフラッシュ', rank : 1 },
  { rolename : 'フォーカード', rank : 2 },
  { rolename : 'フルハウス', rank : 3 },
  { rolename : 'フラッシュ', rank : 4 },
  { rolename : 'ストレート', rank : 5 },
  { rolename : 'スリーオブアカインド', rank : 6 },
  { rolename :  'ツーペア', rank : 7 },
  { rolename :  'ワンペア', rank : 8 },
  { rolename :  'ハイカード',rank : 9 },
]

start.addEventListener('click',function(){
  initCard();
  shuffleCard();
  pDraw();
  cDraw();
  answer();
},false);

function pDraw(){
  pHand = cards.slice(0,handCards);
  cards.splice(0,handCards);
  dispCard(pHand,tranpParent);
  line(pHand);
  judge(pHand,maxValueP,pRank);
  pRank = judge(pHand,maxValueP,pRank);
  parentRole.innerHTML = result[pRank[0]].rolename;
}

function cDraw(){
  cHand = cards.slice(0,handCards);
  cards.splice(0,handCards);
  dispCard(cHand,tranpChild);
  line(cHand);
  judge(cHand,maxValueC,cRank);
  cRank = judge(cHand,maxValueC,cRank);
  childRole.innerHTML = result[cRank[0]].rolename;
}

function dispCard(hand,html){
  html.innerHTML = '';
  let imgurl = '';
  for(var i = 0;i < hand.length; i++){
    imgurl = `${hand[i].mark}_${hand[i].num}`;
    html.insertAdjacentHTML('beforeend',(`<img class="card" src=images/${imgurl}.png alt=card${i}>`));
  }
}

function initCard(){
  let x = 0;
  for(var i = tranpAce; i<=tranpKing; i++){
    cards[x] = new Card(0,i);
    x++;
    cards[x] = new Card(1,i);
    x++;
    cards[x] = new Card(2,i);
    x++;
    cards[x] = new Card(3,i);
    x++;
  }
}

function shuffleCard(){
  let cardsFirst = 0;
  let cardsLast = 52;
  let markNumber = 4;
  for(var i = cardsFirst; i < cardsLast; i++){
    let r = Math.floor(Math.random() * tranpKing * markNumber);
    let w = cards[i];
    cards[i] = cards[r];
    cards[r] = w;
  }
}

class Card {
  constructor(mark, num) {
    this.mark = mark;
    this.num = num;
  }
}

function line(hand){
  hand.sort(function(a,b){
    if(a.num < b.num) return -1;
    if(a.num > b.num) return 1;
    return 0;
  });
}

function judge(hand,maxValue,rank){

  let checkNumber = [];
  let aceChange = 14;
  let dupl4or2and3 = 3;
  let dupl3or2 = 2;
  let dupl1 = 1;
  let n = Object.keys(hand).length;
  for(let m = 0; m < n;m++){
    checkNumber.push(hand[m].num);
  }
  while(checkNumber[n -1] - checkNumber[n-2] === 1){
    n--;}
    if(n === 1){
      duplMark(hand,checkMark);
      if(flash === 1){
        rank = 1;
        return [rank];
      }else{
        rank = 5;
        return [rank];
      }
    }else{
      changeAce(checkNumber);
      duplMark(hand,checkMark);
      if((checkNumber[0] === royalFlirst)&&(flash === 1)){
        rank = result[0].rank;
        return [rank];
      }else if(checkNumber[0] === royalFlirst){
        rank = result[5].rank;
        return [rank];
      }else{
        if(checkNumber[checkNumber.length - 1] === aceChange){
          checkNumber[checkNumber.length - 1] -= tranpKing;
          checkNumber.sort((function(a,b){return a-b;}));
        }
        numberDupl(checkNumber);
        if((dupl.length === dupl4or2and3)&&(dupl.every(v => v === dupl[0]))){
          rank = result[2].rank;
          return [rank];
        }else if(dupl.length === dupl4or2and3){
          rank = result[3].rank;
          return [rank];
        }else{
        duplMark(hand,checkMark);
        if(flash === 1){
          rank = result[4].rank;
          return [rank];
        }else if((dupl.length === dupl3or2)&&(dupl.every(v => v === dupl[0]))){
          rank = result[6].rank;
          return [rank];
        }else if(dupl.length === dupl3or2){
          rank = result[7].rank;
          return [rank];
        }else if(dupl.length === dupl1){
          rank = result[8].rank;
          return [rank];
        }else{
          changeAce(checkNumber);
          maxValue = Math.max.apply(null,checkNumber);
          rank = result[9].rank;
          return [rank,maxValue];
        }
      }
    }
  }
}

function changeAce(number){
  if(number[0] === tranpAce){
    number[0] += tranpKing;
    number.sort((function(a,b){return a-b;}));
  }
}

function duplMark(hand,element){
  let duplMarkfull = 1;
  element = [];
  let t = Object.keys(hand).length;
  for(let m = 0; m < t;m++){
    element.push(hand[m].mark);
  }
  duplCheck = new Set(element);
  if(duplCheck.size === duplMarkfull){
    flash = 1;
  }else{
    flash = 0;
  }
}

function numberDupl(number){
  dupl = [];
  for (let y = 0; y < number.length; y++){
    if(number[y + 1] === number[y]){
      dupl.push(number[y])
    }
  }
}

function answer(){
  if((pRank[0] === cRank[0])&&(pRank[0] === result[9].rank)){
    if(pRank[1] > cRank[1]){
      winORlose(0,1);
    }else if(pRank[1] < cRank[1]){
      winORlose(1,0);
    }else{
      winORlose(2,2);
    }
  }else if(pRank[0] === cRank[0]){
    winORlose(2,2);
  }else if(pRank[0] < cRank[0]){
    winORlose(0,1);
  }else{
    winORlose(1,0);
  }
}
function winORlose(resultP,resultC){
  let judge = ['WIN','LOSE','DRAW'];
  parentResult.innerHTML = judge[resultP];
  childResult.innerHTML = judge[resultC];
}
