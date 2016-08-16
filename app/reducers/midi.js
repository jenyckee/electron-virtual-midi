import electron from 'electron'
import { Map } from 'immutable'
import { DATA, emitRTC } from './rtc'

// ------------------------------------
// Constants
// ------------------------------------
export const MIDI_OPEN = 'MIDI_OPEN'
export const MIDI_MESSAGE = 'MIDI_MESSAGE'
export const MIDI_OUT_NOTE_DOWN = 'MIDI_OUT_NOTE_DOWN'
export const MIDI_OUT_NOTE_UP = 'MIDI_OUT_NOTE_UP'
export const MIDI_CONTROL = 'MIDI_CONTROL'

// ------------------------------------
// Actions
// ------------------------------------

export function open() {
  return (dispatch, getState) => {
    return new Promise((resolve) => {
      electron.ipcRenderer.on('midi', (event, message) => {
        dispatch(midiMessage(message))
      })
      resolve()
    })
  }
}

export function midiMessage (message) {
  console.log('midi message :', message)
  return (dispatch, getState) => {
    return new Promise((resolve) => {
      dispatch(emitRTC(message))
      resolve()
    })
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const MIDI_MESSAGES = {
  noteON  : 144,
  noteOFF : 128,
  control : 176
}

const ACTION_HANDLERS = {
  [DATA]: (state, action) => {
  },
  [MIDI_MESSAGE]: (state, action) => {
  },
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = Map({ 'outPortId': '766085233'})
export default function midiReducer (state: object = initialState, action: Action): object {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
