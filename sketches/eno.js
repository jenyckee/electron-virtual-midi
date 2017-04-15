var rSlider, gSlider, bSlider, x1, x2,
    particles, chord, curr, state;

function setup() {
  // create canvas
  createCanvas(window.innerWidth, window.innerHeight);
  textSize(15)
  noStroke();

  // create sliders
  rSlider = createSlider(0, 255, 255);
  rSlider.position(20, 20);
  gSlider = createSlider(0, 255, 0);
  gSlider.position(20, 50);
  bSlider = createSlider(0, 255, 255);
  bSlider.position(20, 80);

  state = Ludo.initialize();
  state.subscribe(linkSliders);

  rSlider.elt.oninput = function (e) {
    midiValue = Math.round((e.target.value/255)*127);
    Ludo.midi(state, [176, 1, midiValue]);
  };
  gSlider.elt.oninput = function (e) {
    midiValue = Math.round((e.target.value/255)*127);
    Ludo.midi(state, [176, 2, midiValue]);
  };
  particles = {};

  curr = 0;
  chord = teoria.note('c3')    // Create a note, A3
  .scale('lydian')  // Create a lydian scale with that note as root (A lydian)
  .interval('M2')   // Transpose the whole scale a major second up (B lydian)
  .get('third')     // Get the third note of the scale (D#4)
  .chord('maj9')
  .notes();
}

function linkSliders() {
  rSlider.value((state.getState().dataChannel[1]/127)*255);
  gSlider.value((state.getState().dataChannel[2]/127)*255);
}

function mousePressed() {
  Ludo.midi(state, [Ludo.NOTE_DOWN, chord[curr].midi(), 0x7f]);
}

function mouseReleased() {
  Ludo.midi(state, [Ludo.NOTE_UP, chord[curr++].midi(), 0x7f]);
  if (curr >= chord.length)
    curr = 0;
}

function draw() {
  var r = rSlider.value();
  var g = gSlider.value();
  var b = bSlider.value();
  background(r, g, b);

  var note = teoria.note('c3').midi()

  Ludo.forEachNote(state, function (key) {
    var x = mouseX,
        y = mouseY

    if (particles[key]) {
      // console.log(particles[key])
      x = particles[key].position.x
      y = particles[key].position.y
    }

    particles = R.merge(particles, {
      [key]: new Particle(x,y)
    })
  })

  for (var key in particles) {
    particles[key].update()
    particles[key].display()
    if (particles[key].lifespan <= 0) {
      particles = R.dissoc(key, particles)
    }
  }

  text("red", 165, 35);
  text("green", 165, 65);
  text("blue", 165, 95);
}

function Particle(x,y) {
  this.hue = random(100);
  this.lifespan = 255;
  this.position = createVector(x, y);
}

Particle.prototype.update = function() {
  this.lifespan--
};

Particle.prototype.display = function() {
  push();
  fill(0, this.lifespan/2);
  ellipse(this.position.x,this.position.y, this.lifespan, this.lifespan);
  pop();
}