import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './Home.css';
import {actions as sketchActions} from '../reducers/sketch'
import * as midi from '../reducers/midi'

import R from 'ramda'
import QRCode from 'qrcode.react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const SketchListItem = (props) => {
  return (
    <li>
      <Link onClick={props.open} to={"sketch/"+props.sketch._id}>{props.sketch.name}</Link>
      <span onClick={props.delete}> x</span>
    </li>
  )
}

class Home extends Component {

  constructor () {
    super()
    this.state = {
      showQR: false,
      sketchName: ""
    }
  }

  newSketch(e) {
    e.preventDefault();
    let sketchName = this.state.sketchName
    let initCode = require('raw-loader!../../sketches/sketch1.js.raw')
    if (this.state.sketchName) {
      this.props.createSketch(initCode, this.state.sketchName)
      this.setState(R.merge(this.state, {
        showQR: !this.state.showQR,
        sketchName: ""
      }));
    }
  }

  changeSketchName(e) {
    this.setState(R.merge(this.state, {
      sketchName: e.target.value
    }))
  }

  delete(id) {
    this.props.deleteSketch(id)
  }

  open(id) {
    this.props.setCurrentSketch(id)
  }

  render() {
    let CodemirrorOptions =  {
      lineNumbers: true
    }

    return (
      <div>
        <div>
          <h1>Sketches</h1>
          <ul>
            {this.props.sketches.map(sketch => 
              <SketchListItem 
                key={sketch._id} 
                sketch={sketch} 
                delete={() => this.delete(sketch._id)}
                open={() => this.open(sketch._id)}
                />)}
          </ul>
          <form onSubmit={this.newSketch.bind(this)}>
            <div className="form-row">
              <span>SketchName: </span>
              <input onChange={this.changeSketchName.bind(this)} value={this.state.sketchName} type="text"/>
            </div>
            <button type="submit" className="connect-button">New Sketch</button>
          </form>
        </div>
        <div>
          <h1>Peers</h1>
          <ul>
            {this.props.peers.map(peer =><li key={peer}>{peer}</li>)}
          </ul>
        </div>
        {/*{this.state.showQR ? <QRCode value="http://facebook.github.io/react/"/> : null}*/}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    peers: state.rtc.get('peers')
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchSketches: sketchActions.fetchSketches,
    createSketch: sketchActions.createSketch,
    deleteSketch: sketchActions.deleteSketch,
    setCurrentSketch: sketchActions.setCurrentSketch,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
