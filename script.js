const timeDisplay = document.getElementById("time");
const progress = document.getElementById("progress");

const plusBtn = document.getElementById("plus");
const minusBtn = document.getElementById("minus");
const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");

const timerCard = document.querySelector(".timer-card");

const messages = [
    "🌱 Ett pass närmare målet.",
    "🚀 Snyggt jobbat!",
    "☕ Dags för en paus!",
    "⭐ Fokuspass klart!",
    "📚 Du gjorde det!",
    "💪 Fortsätt så!",
    "🎉 Ett steg närmare ditt mål!",
    "🔥 Grymt fokus!"
];

let totalSeconds = 0;
let initialSeconds = 0;
let timer = null;
let endTime = null;

function saveState() {
    localStorage.setItem("focusTimer", JSON.stringify({
        totalSeconds,
        initialSeconds,
        endTime
    }));
}

function loadState() {
    const saved = localStorage.getItem("focusTimer");
    if (!saved) return;

    const state = JSON.parse(saved);

    initialSeconds = state.initialSeconds || 0;
    endTime = state.endTime;

    if (endTime) {
        totalSeconds = Math.max(
            0,
            Math.ceil((endTime - Date.now()) / 1000)
        );
    } else {
        totalSeconds = state.totalSeconds || 0;
    }
}

function updateDisplay() {

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    timeDisplay.textContent =
        `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;

    if(initialSeconds>0){
        const percent=((initialSeconds-totalSeconds)/initialSeconds)*100;
        progress.style.width=Math.max(0,Math.min(100,percent))+"%";
    }else{
        progress.style.width="0%";
    }
}

function finishTimer(){

    clearInterval(timer);
    timer=null;

    totalSeconds=0;
    endTime=null;

    progress.style.width="100%";

    timerCard.classList.add("completed");
    timerCard.classList.add("pop");

    const randomMessage=messages[Math.floor(Math.random()*messages.length)];

    timeDisplay.innerHTML=`
        <div style="font-size:38px;font-weight:bold;">
            ✓ KLAR
        </div>
        <div style="font-size:16px;font-weight:500;margin-top:10px;line-height:1.4;">
            ${randomMessage}
        </div>
    `;

    localStorage.removeItem("focusTimer");
}

function tick(){

    totalSeconds=Math.max(
        0,
        Math.ceil((endTime-Date.now())/1000)
    );

    updateDisplay();

    if(totalSeconds<=0){
        finishTimer();
    }else{
        saveState();
    }
}

plusBtn.onclick=()=>{
    if(timer) return;
    totalSeconds+=60;
    initialSeconds=totalSeconds;
    timerCard.classList.remove("completed","pop");
    updateDisplay();
    saveState();
};

minusBtn.onclick=()=>{
    if(timer) return;
    totalSeconds=Math.max(0,totalSeconds-60);
    initialSeconds=totalSeconds;
    timerCard.classList.remove("completed","pop");
    updateDisplay();
    saveState();
};

startBtn.onclick=()=>{
    if(timer||totalSeconds<=0) return;

    timerCard.classList.remove("completed","pop");

    endTime=Date.now()+totalSeconds*1000;

    saveState();
    tick();
    timer=setInterval(tick,1000);
};

pauseBtn.onclick=()=>{
    if(!timer) return;

    clearInterval(timer);
    timer=null;

    totalSeconds=Math.max(
        0,
        Math.ceil((endTime-Date.now())/1000)
    );

    endTime=null;

    saveState();
    updateDisplay();
};

resetBtn.onclick=()=>{

    clearInterval(timer);
    timer=null;

    totalSeconds=0;
    initialSeconds=0;
    endTime=null;

    timerCard.classList.remove("completed","pop");

    localStorage.removeItem("focusTimer");

    updateDisplay();
};

loadState();

if(endTime){
    if(totalSeconds<=0){
        finishTimer();
    }else{
        updateDisplay();
        timer=setInterval(tick,1000);
    }
}else{
    updateDisplay();
}
