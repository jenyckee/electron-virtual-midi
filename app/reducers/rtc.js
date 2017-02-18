import Peer from 'peerjs'
import Immutable from 'immutable'
import {midiMessage} from './midi'
import electron from 'electron'
import axios from 'axios'
import {baseURL} from '../constants'
const {shell} = require('electron')

// ------------------------------------
// Constants
// ------------------------------------
export const CONNECT    = 'CONNECT'
export const CONNECTION = 'CONNECTION'
export const SEND       = 'SEND'
export const OPEN       = 'OPEN'
export const EMIT       = 'EMIT'
export const INIT       = 'INIT'
export const DATA       = 'DATA'
export const ERROR      = 'ERROR'
export const CODE_CHANGE = 'CODE_CHANGE'
// ------------------------------------
// Actions
// ------------------------------------
export function connectRTC (peerId) {
  return (dispatch, getState) => {
    return new Promise((resolve) => {
      let state = getState().rtc

      if (!state.get('peers').get(peerId)) {
        state.get('connection').connect(peerId, {
            label: 'midi',
            serialization: 'json'
          })
      }
      dispatch({
        type: CONNECT,
        peerId: peerId
      })
      resolve()
    })
  }
}

export function connectionRTC (c) {
  return (dispatch, getState) => {
    return new Promise((resolve) => {
      let state = getState().rtc
      if (!state.get('peers').find(v => v == c.peer)) {
        state.get('connection').connect(c.peer, {
            label: 'midi',
            serialization: 'json'
          })
      }
      c.on('data', (data) => dispatch(dataRTC(data, c.peer)))
      dispatch({
        type: CONNECTION,
        peerId: c.peer
      })
      resolve()
    })
  }
}

export function openRTC (id) {
  return {
    type: OPEN,
    connectionId: id
  }
}

export function initRTC (apiKey, debugLevel) {
  return (dispatch, getState) => {
    return new Promise((resolve) => {
      let c = new Peer({
        key: apiKey,
        debug: debugLevel
      }).on('connection', (c) => dispatch(connectionRTC(c)))
        .on('error', dispatch(errorRTC(error)))
        .on('open', (id) => {
          dispatch(openRTC(id))
          resolve(c)
        })
      dispatch({ type: 'INIT', connection: c })
    })
  }
}

export function errorRTC (error) {
  return {
    type: ERROR,
    data: error
  }
}

export function dataRTC (data) {
  return (dispatch, getState) => {
    return new Promise((resolve) => {
      electron.ipcRenderer.send('message', data)
      dispatch(midiMessage(data))
    })
  }
}

export function sendRTC (message, id) {
  return (dispatch, getState) => {
    return new Promise((resolve) => {
      eachActiveConnection(getState().rtc, function(c) {
        c.send(message)
      })
    })
  }
}

export function emitRTC (message, sender) {
  return (dispatch, getState) => {
    return new Promise((resolve) => {
      eachActiveConnection(getState().rtc, function(c) {
        c.send(message)
      })
    })
  }
}

export function codeChange(code) {
  return {
    type: CODE_CHANGE,
    value: code
  }
}

export function createNewSketch(code, connectionId) {
  return (dispatch, getState) => {
    console.log(code)
    return new Promise(resolve => {
      axios.post('/sketch', {
        code: code
      }, {
        baseURL: baseURL
      }).then(res => {
        var sketchId = res.data.insertedIds[0]
        if (sketchId) {
          shell.openExternal(`http://localhost:8000/sketch/${sketchId}/#`+connectionId)
        }
      })
    })
  }
}

function error (message) {
  console.error(message)
}

export const actions = {
  connectRTC,
  openRTC,
  sendRTC,
  emitRTC
}

function eachActiveConnection (state, fn) {
  var actives = state.get('peers')
  var checkedIds = {}

  actives.forEach(function(peerId, index) {
    if (!checkedIds[peerId]) {
      var conns = state.get('connection').connections[peerId]
      conns.forEach(fn)
    }
    checkedIds[peerId] = 1
  })
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [INIT]: (state, action) => {
    return state.set('connection', action.connection)
  },
  [SEND]: (state, action) => {
    return state
  },
  [EMIT]: (state, action) => {
    return state
  },
  [OPEN]: (state, action) => {
    return state.set('connectionId', action.connectionId)
  },
  [CONNECT]: (state, action) => {
    return state.set('peers', state.get('peers').push(action.peerId))
  },
  [CONNECTION]: (state, action) => {
    return state.set('peers', state.get('peers').push(action.peerId))
  },
  [CODE_CHANGE]: (state, action) => {
    return state.set('code', action.value)
  }
}

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = Immutable.Map({
    connectionId: '',
    connection: null,
    peers: Immutable.List(),
    code: require('raw-loader!../../sketches/sketch1.js.raw')
  })

export default function reducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
