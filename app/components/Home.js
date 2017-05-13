import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './Home.css';
import {actions as sketchActions} from '../reducers/sketch'
import {actions as rtcActions} from '../reducers/rtc'
import * as midi from '../reducers/midi'

import R from 'ramda'
import QRCode from 'qrcode.react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class SketchListItem extends Component {
  dragStart (event) {
    event.dataTransfer.setData('text', JSON.stringify(this.props.sketch));
  }

  render() {
    return (
        <li className="sketchlistitem" draggable={true} onDragStart={this.dragStart.bind(this)}>
          <Link onClick={this.props.open} to={"sketch/"+this.props.sketch._id}>{this.props.sketch.name}</Link>
          <span onClick={this.props.delete}> x</span>
        </li>
      )
  }
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

  preventDefault(event) {
    event.preventDefault();
  }

  drop(event, peer) {
    event.preventDefault();

    var data;
    try {
      data = JSON.parse(event.dataTransfer.getData('text'));
      this.props.sendRTC(data, peer)
    } catch (e) {
      // If the text data isn't parsable we'll just ignore it.
      return;
    }
  }

  render() {
    return (
      <div>
        <div>
          <h1>Widgets</h1>
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
            {this.props.peers.map(peer =>
            <li onDragOver={this.preventDefault} onDrop={(e) => this.drop(e,peer)} key={peer}>{peer}</li>
            )}
          </ul>
        </div>
        <Link to="connect">Connect</Link>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    peers: state.rtc.get('peers'),
    connectionUrl: `http://${state.rtc.get("addresses")[0]}:8000#${state.rtc.get("connectionId")}`
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchSketches: sketchActions.fetchSketches,
    createSketch: sketchActions.createSketch,
    deleteSketch: sketchActions.deleteSketch,
    setCurrentSketch: sketchActions.setCurrentSketch,
    openSession: sketchActions.openSession,
    sendRTC: rtcActions.sendRTC,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
