var hit = false;
var run = false;
var stringThickness = 50;
var offset = 100;
var state;
var notes = ['c','d','e','f','g'].map(note=>teoria.note(note).name())
var hits = {}

function setup() {
  createCanvas(windowWidth,windowHeight);
  notes.forEach(note => hits[note] = {
    hit: false,
    run: false
  })
  state = Ludo.initialize();
}

function onCollide(note) {
  if (!hits[note].run) {
    let midiValue = teoria.note(note).midi()
    Ludo.midi(state, [Ludo.NOTE_DOWN, midiValue, 0x7f])
  }
  hits[note].run = true;
}

function onLeave(note) {
  hits[note].run = false
  let midiValue = teoria.note(note).midi()
  Ludo.midi(state, [Ludo.NOTE_UP, midiValue, 0x7f])
}

/*
1. render all the notes, if the note is in the state -> color
2. check for collisions, on collision -> put note in state and play
                         on leave -> remove from state and unplay
*/

function draw(){
  noStroke();

  notes.forEach(function (note, i) {
    let y = stringThickness*(2*i+1) + offset;
    hits[note].hit = collidePointRect(mouseX, mouseY, 0, y, windowWidth, stringThickness)
    
    if (hits[note].hit){ //change color!
      onCollide(note)
    } else if (hits[note].run) {
      onLeave(note)
    }
    if (Ludo.getMidi(state, teoria.note(note).midi())) {
        fill('purple')
    } else {
        fill('green')
    }

    rect(0,y,windowWidth,stringThickness);
  })
}
