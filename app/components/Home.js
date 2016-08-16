import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './Home.css';
import { initRTC } from '../reducers/rtc'
import * as midi from '../reducers/midi'


import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';


export default class Home extends Component {

  componentDidMount() {
    const { initRTC, openMidi } = this.props
    initRTC('bnon5rifq5dygb9', 3)
    openMidi()
  }

  render() {
    return (
      <div>
        <div className={styles.container}>
          <h3>I am {this.props.connectionId}!</h3>
          <ul>
          </ul>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    connectionId: state.rtc.get('connectionId'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    initRTC: initRTC,
    openMidi: midi.open
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
