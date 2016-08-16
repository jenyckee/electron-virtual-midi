import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import counter from './counter';
import rtc from './rtc'

const rootReducer = combineReducers({
  rtc,
  counter,
  routing
});

export default rootReducer;
