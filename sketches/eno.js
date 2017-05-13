var rSlider, gSlider, bSlider, state;

function linkSliders() {
  rSlider.value((state.getState().dataChannel[1]/127)*255);
  gSlider.value((state.getState().dataChannel[2]/127)*255);
}

new p5(function(s) {
  state = midi;
  s.setup = function() {
  // create canvas
    s.createCanvas(window.innerWidth, window.innerHeight);
    s.textSize(15)
    s.noStroke();

    // create sliders
    rSlider = s.createSlider(0, 255, 255);
    rSlider.position(20, 20);
    gSlider = s.createSlider(0, 255, 0);
    gSlider.position(20, 50);
    bSlider = s.createSlider(0, 255, 255);
    bSlider.position(20, 80);

    state.subscribe(linkSliders);

    rSlider.elt.oninput = function (e) {
      midiValue = Math.round((e.target.value/255)*127);
      Ludo.midi(state, [176, 1, midiValue]);
    };
    gSlider.elt.oninput = function (e) {
      midiValue = Math.round((e.target.value/255)*127);
      Ludo.midi(state, [176, 2, midiValue]);
    };
  }

  s.draw = function() {
    var r = rSlider.value();
    var g = gSlider.value();
    var b = bSlider.value();
    s.background(r, g, b);

    s.text("red", 165, 35);
    s.text("green", 165, 65);
    s.text("blue", 165, 95);
  }
});