import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './Connect.css';
import {actions as sketchActions} from '../../reducers/sketch'
import * as midi from '../../reducers/midi'

import R from 'ramda'
import QRCode from 'qrcode.react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class Connect extends Component {

  constructor () {
    super()
    this.state = {
      showQR: false,
      sketchName: ""
    }
  }
  render() {
    let CodemirrorOptions =  {
      lineNumbers: true
    }

    return (
      <div>
        <div className={styles['qr-connector']}
          onClick={() => this.props.openSession(this.props.connectionUrl)}>
          <QRCode value={this.props.connectionUrl} size={250} level="H" />
        </div>
        <div className="connectivity-button">
          <Link to="/"><i className="fa fa-arrow-left fa-4"></i> BACK</Link>
        </div>
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
    openSession: sketchActions.openSession
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Connect);
