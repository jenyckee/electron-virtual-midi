import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import rtc from './rtc'
import sketch from './sketch'

const rootReducer = combineReducers({
  rtc,
  routing,
  sketch
});

export default rootReducer;
