// global constants
//const clueHoldTime = 1000; //how long to hold each clue's light/sound
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence


//Global Variables
var pattern = [];
var progress = 0; 
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.8;  //must be between 0.0 and 1.0
var guessCounter = 0;
var clueHoldTime = 1000;
var strikes;

function startGame(){
    //initialize game variables
    progress = 0;
    gamePlaying = true;
    strikes = 0;
  
   // swap the Start and Stop buttons
   document.getElementById("startBtn").classList.add("hidden");
   document.getElementById("stopBtn").classList.remove("hidden");
  
   generateRandomSequence();
   playClueSequence();
}

function stopGame(){
  
 gamePlaying = false;
 document.getElementById("startBtn").classList.remove("hidden");
 document.getElementById("stopBtn").classList.add("hidden");
  

  //clear the sequence
  while(pattern.length > 0) {
    pattern.pop();
  }
}

// Sound Synthesis Functions
const freqMap = {
  1: 270.6,
  2: 310.6,
  3: 340,
  4: 360.2,
  5: 390
}
function playTone(btn,len){ 
  //o.frequency.value = freqMap[btn]
  document.getElementById("myaudio").play();
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}


function startTone(btn){
  if(!tonePlaying){
    //o.frequency.value = freqMap[btn]
    document.getElementById("myAudio").pause();
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    tonePlaying = true
  }
}
function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
  document.querySelector('#myimg').classList.remove("hidden");
}
function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
  document.querySelector('#myimg').classList.add("hidden");
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence(){
  guessCounter = 0;
  clueHoldTime-=50;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
}



function loseGame(){
  stopGame();
  alert("Game Over. You lost.");
}

function winGame(){
  stopGame();
  alert("Game Over. You won!.");
}

function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }

  //if the guess is incorrect, then end the game.
  if(btn != pattern[guessCounter])
    {
      strikes++;
      if(strikes == 3)
        {
          loseGame();
        }
    }
  //Correct guess
  else{
    
    //check if the turn is over or not
    
    if(guessCounter != progress) //if the turn isn't over, increment counter
    {
      guessCounter++;
    
    }
  //if turn is over
    else 
      {
        //check if last turn
        if(progress != pattern.length - 1) //if not,increment and play next clue
        {
          progress++;
          playClueSequence();
          
        }
        else if(progress == pattern.length - 1)
        {
          winGame();
        }
      }
    
    
  }
  
}

function generateRandomSequence(){
  
  for(let i = 0; i < 4;i++)
    {
      pattern.push(Math.floor(Math.random() * (5 - 1 + 1)) + 1);
    }
  
}

