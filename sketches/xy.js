var r = 100;

function touchStarted(){
  Ludo.midi(state, [176, 6, 127]);
  x = (mouseX/windowWidth)
  y = (mouseY/windowHeight)
  midiValueX = Math.round(x*127);
  midiValueY = Math.round((1-y)*127);
  
  Ludo.midi(state, [176, 4, midiValueX]);
  Ludo.midi(state, [176, 5, midiValueY]);
}

function touchEnded() {
  Ludo.midi(state, [176, 6, 0]);
}

function touchMoved() {
    console.log(mouseX,mouseY, Ludo)
  x = (mouseX/windowWidth)
  y = (mouseY/windowHeight)
  midiValueX = Math.round(x*127);
  midiValueY = Math.round((1-y)*127);
  
  Ludo.midi(state, [176, 4, midiValueX]);
  Ludo.midi(state, [176, 5, midiValueY]);
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  state = Ludo.initialize();
  fill(0x000000);
}

function draw() {
  clear();
  if (state.getState().dataChannel[6]) {
      background('rgba(0,255,0, 0.25)');
      fill("red");
  } else {
      fill("black");
  }
  ellipse((state.getState().dataChannel[4]/127)*windowWidth,
  (1 - state.getState().dataChannel[5]/127)*windowHeight,r,r);
}
