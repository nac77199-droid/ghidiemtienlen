let players=[], totals=[0,0,0,0], rounds=[];
let target=100, picked=[], current=[0,0,0,0];
let startTime=0, timerInt=null, winOnce=false;

const saveSound = new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=");
const winSound  = new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=");

function startGame(){
  players=[0,1,2,3].map(i=>document.getElementById("name"+i).value.trim());
  if(players.some(p=>!p)) return alert("Nhập đủ 4 tên");
  target=parseInt(document.getElementById("target").value)||100;

  document.getElementById("setup").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");

  startTimer();
  render();
}

function startTimer(){
  startTime=Date.now();
  timerInt=setInterval(()=>{
    let s=Math.floor((Date.now()-startTime)/1000);
    let m=Math.floor(s/60), h=Math.floor(m/60);
    s%=60; m%=60;
    document.getElementById("timer").innerText=
      "⏱ "+(h?`${h}h `:"")+`${m}m ${s}s`;
  },1000);
}

function render(){
  let html=`<table><tr><th>Ván</th>`;
  players.forEach((p,i)=>{
    html+=`<th>${p}<div class="total">${totals[i]}</div></th>`;
  });
  html+="</tr>";

  rounds.forEach((r,ri)=>{
    html+=`<tr><td>${ri+1}</td>`;
    r.forEach((v,ci)=>{
      html+=`<td class="edit" ondblclick="edit(${ri},${ci})">${v}</td>`;
    });
    html+="</tr>";
  });

  html+="</table>";
  document.getElementById("tableWrap").innerHTML=html;
}

function newRound(){
  picked=[]; current=[0,0,0,0];
  document.getElementById("desk").classList.remove("hidden");
  document.querySelectorAll(".seat").forEach(s=>{
    s.classList.remove("selected");
    s.innerHTML="";
  });
  players.forEach((p,i)=>{
    document.querySelector(".s"+i).innerHTML=p;
  });
}

function pick(i){
  if(picked.includes(i)) return;
  picked.push(i);
  document.querySelector(".s"+i).classList.add("selected");

  if(picked.length===1){ current[i]=3; label(i,"Nhất"); }
  if(picked.length===2){ current[i]=2; label(i,"Nhì"); }
  if(picked.length===3){
    current[i]=1; label(i,"Ba");
    let last=[0,1,2,3].find(x=>!picked.includes(x));
    current[last]=0; label(last,"Bét");
    saveRound();
  }
}

function label(i,text){
  document.querySelector(".s"+i).innerHTML=
    players[i]+`<small>${text}</small>`;
}

function saveRound(){
  rounds.push([...current]);
  current.forEach((v,i)=>{
    totals[i]+=v;
    if(!winOnce && totals[i]>=target){
      winOnce=true;
      winSound.play();
      alert("🎉 "+players[i]+" THẮNG!");
    }
  });
  saveSound.play();
  document.getElementById("desk").classList.add("hidden");
  render();
}

function edit(r,p){
  let old=rounds[r][p];
  let v=parseInt(prompt("Sửa điểm:",old));
  if(isNaN(v)) return;
  rounds[r][p]=v;
  totals[p]+=v-old;
  render();
}
