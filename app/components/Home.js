import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './Home.css';
import { initRTC, codeChange, createNewSketch } from '../reducers/rtc'
import * as midi from '../reducers/midi'
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/theme/tomorrow';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';


export default class Home extends Component {

  componentDidMount() {
    const { initRTC, openMidi } = this.props
    initRTC('bnon5rifq5dygb9', 3)
    openMidi()
  }

  onChange(val) {
    this.props.codeChange(val)
  }

  onConnect() {
    this.props.createNewSketch(this.props.code, this.props.connectionId)
  }

  runCode() {
    console.log(this.props.code)
  }

  render() {
    let CodemirrorOptions =  {
      lineNumbers: true
    }
    return (
      <div>
        <div className={styles.container}>
          <h3>{this.props.sketchname}</h3>
          <AceEditor mode="javascript" theme="tomorrow" onChange={this.onChange.bind(this)}
            name="editor" width="100%"
            value={this.props.code}/>
            <button className={styles['run-button']} onClick={this.onConnect.bind(this)}>Run</button>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    connectionId: state.rtc.get('connectionId'),
    code: state.rtc.get('code'),
    sketchname: 'p5.js sketch'
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    initRTC: initRTC,
    openMidi: midi.open,
    codeChange: codeChange,
    createNewSketch: createNewSketch
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
