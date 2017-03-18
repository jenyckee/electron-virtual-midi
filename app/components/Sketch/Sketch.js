import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './Sketch.css';
import { actions as rtc } from '../../reducers/rtc'
import { actions as sketch } from '../../reducers/sketch'
import * as midi from '../../reducers/midi'
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/theme/tomorrow';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class Sketch extends Component {

  onChange(val) {
    this.props.codeChange(val)
  }

  onConnect() {
    let sketch = {
      _id: this.props.sketchId,
      code: this.props.code,
      name: this.props.sketchName
    }
    this.props.openSketch(sketch, this.props.connectionId)
  }

  render() {
    let CodemirrorOptions =  {
      lineNumbers: true
    }
    return (
      <div>
        <div className={styles.container}>
          <Link to="/">Back</Link>
          <h3>{this.props.sketchName}</h3>
          <AceEditor mode="javascript" theme="tomorrow" onChange={this.onChange.bind(this)}
            name="editor" width="100%"
            value={this.props.code}/>
          <div className={styles["controls-container"]}>
            <button onClick={this.onConnect.bind(this)}>Run</button>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    connectionId: state.rtc.get('connectionId'),
    code: state.sketch.code,
    sketchName: state.sketch.sketchName
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    initRTC: rtc.initRTC,
    codeChange: sketch.codeChange,
    openSketch: sketch.openSketch,
    deleteSketch: sketch.deleteSketch
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Sketch);
