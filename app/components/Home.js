import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './Home.css';
import { initRTC, codeChange } from '../reducers/rtc'
import * as midi from '../reducers/midi'
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/theme/tomorrow';
const {shell} = require('electron')

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';


export class Home extends Component {

  componentDidMount() {
    const { initRTC, openMidi } = this.props
    initRTC('bnon5rifq5dygb9', 3)
    openMidi()
  }

  onChange(val) {
    this.props.codeChange(val)
  }

  onConnect() {
    shell.openExternal("http://localhost:3000/player/"+this.props.connectionId)
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
          <h3>I am {this.props.connectionId}: <a onClick={this.onConnect.bind(this)}>Connect!</a></h3>
          <AceEditor mode="javascript" theme="tomorrow" onChange={this.onChange.bind(this)}
            name="editor" width="100%"
            value={this.props.code}/>
            <button onClick={this.onConnect.bind(this)}>Run</button>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    connectionId: state.rtc.get('connectionId'),
    code: state.rtc.get('code')
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    initRTC: initRTC,
    openMidi: midi.open,
    codeChange: codeChange,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
