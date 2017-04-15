import Peer from 'peerjs'
import electron from 'electron'
import axios from 'axios'
import R from 'ramda'
import { baseURL } from '../constants'
const { shell } = require('electron')

// ------------------------------------
// Constants
// ------------------------------------
export const SKETCHES_RECEIVED = 'SKETCHES_RECEIVED'
export const CREATE_SKETCH_SUCCES = 'CREATE_SKETCH_SUCCES'
export const CODE_CHANGE = 'CODE_CHANGE'
export const DELETE_SUCCESS = 'DELETE_SUCCESS'
export const CURRENT_SKETCH = 'CURRENT_SKETCH'
// ------------------------------------
// Actions
// ------------------------------------
function openSketch(sketch, connectionId) {
  return (dispatch, getState) => {
    return new Promise(resolve => {
      axios.put(`/sketch/${sketch._id}`, R.dissoc('_id', sketch), {
        baseURL: baseURL
      }).then(res => {
        console.log(sketch, res)
        shell.openExternal(`http://${getState().rtc.get('addresses')[0]}:8000/sketch/${sketch._id}/#`+connectionId)
      })
    })
  }
}

function openSession(url) {
  return (dispatch, getState) => {
    return new Promise(resolve => {
      shell.openExternal(url)
    })
  }
}

function createSketch(code, name) {
  return (dispatch, getState) => {
    return new Promise(resolve => {
      axios.post('/sketch', {
        code: code,
        name: name
      }, {
        baseURL: baseURL
      }).then(res => {
        let sketchId = res.data.insertedIds[0]
        let sketch = {
          _id: sketchId,
          name: name,
          code: code
        }
        dispatch(createSketchSuccess(sketch))
      })
    })
  }
}

function createSketchSuccess(sketch) {
  return {
    type: CREATE_SKETCH_SUCCES,
    value: sketch
  }
}

function fetchSketches () {
  return (dispatch, getState) => {
    return new Promise((resolve) => {
      axios.get('sketch', {
        baseURL: baseURL
      })
      .then(res => dispatch(sketchesReceived(res.data)))
    })
  }
}

function deleteSketch (id) {
  return (dispatch, getState) => {
    return new Promise((resolve) => {
      axios.delete(`sketch/${id}`, {
        baseURL: baseURL
      })
      .then(res => dispatch(sketchDeleteSucces(id)))
    })
  }
}

function sketchDeleteSucces (id) {
  return {
    type: DELETE_SUCCESS,
    value: id
  }
}

function sketchesReceived(sketches) {
  return {
    type: SKETCHES_RECEIVED,
    value: sketches
  }
}

function codeChange(code) {
  return {
    type: CODE_CHANGE,
    value: code
  }
}

function setCurrentSketch(id) {
  return {
    type: CURRENT_SKETCH,
    value: id
  }
}

export const actions = {
  fetchSketches,
  openSketch,
  codeChange,
  createSketch,
  deleteSketch,
  setCurrentSketch,
  openSession,
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SKETCHES_RECEIVED]: (state, action) => {
    return R.merge(state, {sketches: action.value})
  },
  [CODE_CHANGE]: (state, action) => {
    return R.merge(state, {code: action.value})
  },
  [CREATE_SKETCH_SUCCES]: (state, action) => {
    return R.merge(state, {
      sketches: R.append(action.value, state.sketches)
    })
  },
  [DELETE_SUCCESS]: (state, action) => {
    return R.merge(state, {
      sketches: R.filter(sketch => sketch._id !== action.value)(state.sketches)
    })
  },
  [CURRENT_SKETCH]: (state, action) => {
    let curr = R.find(sketch => sketch._id == action.value)(state.sketches)
    return R.merge(state, {
      code: curr.code,
      sketchName: curr.name
    })
  }
}

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = {
  sketches: [],
  sketchName: '',
  code: require('raw-loader!../../sketches/sketch1.js.raw'),
}

export default function reducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
