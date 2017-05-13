new p5(function(sketch) {
  var state = midi;
  var r = 100;
  sketch.touchStarted = function(){
    Ludo.midi(state, [176, 6, 127]);
    let x = (sketch.mouseX/sketch.windowWidth)
    let y = (sketch.mouseY/sketch.windowHeight)
    let midiValueX = Math.round(x*127);
    let midiValueY = Math.round((1-y)*127);
  
    Ludo.midi(state, [176, 4, midiValueX]);
    Ludo.midi(state, [176, 5, midiValueY]);
  };

  sketch.touchEnded = function() {
    Ludo.midi(state, [176, 6, 0]);
  };
  
  sketch.touchMoved = function () {
    console.log(sketch.mouseX,sketch.mouseY, Ludo)
    let x = (sketch.mouseX/sketch.windowWidth)
    let y = (sketch.mouseY/sketch.windowHeight)
    let midiValueX = Math.round(x*127);
    let midiValueY = Math.round((1-y)*127);
  
    Ludo.midi(state, [176, 4, midiValueX]);
    Ludo.midi(state, [176, 5, midiValueY]);
  }
 
  sketch.setup = function() {
    var cnv = sketch.createCanvas(window.innerWidth, window.innerHeight);
    sketch.fill(0x000000);
  };
 
  sketch.draw = function() {
  sketch.clear();
  if (state.getState().dataChannel[6]) {
      sketch.background('rgba(0,255,0, 0.25)');
      sketch.fill("red");
  } else {
      sketch.fill("black");
  }
  sketch.ellipse((state.getState().dataChannel[4]/127)*sketch.windowWidth,
  (1 - state.getState().dataChannel[5]/127)*sketch.windowHeight,r,r);
  };
});