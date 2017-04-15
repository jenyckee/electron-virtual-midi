import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import Sketch from './containers/Sketch';
import Connect from './containers/Connect';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="/sketch/:id" component={Sketch} />
    <Route path="/connect" component={Connect} />
  </Route>
);
