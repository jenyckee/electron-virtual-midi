import midi from 'midi'


export default function applyVirtualMidi(name, incb) {

  let midiOut = new midi.output(),
      midiIn = new midi.input()

  try {
    midiIn.openVirtualPort(name),
    midiOut.openVirtualPort(name)
  } catch(err) {
    console.error(err)
  }

  midiIn.on('message', incb)
}
