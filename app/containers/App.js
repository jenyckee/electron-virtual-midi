import React, { Component, PropTypes } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { initRTC, codeChange, createNewSketch } from '../reducers/rtc'
import { open } from '../reducers/midi'

class App extends Component {

  componentDidMount() {
    const { initRTC, openMidi } = this.props
    initRTC('bnon5rifq5dygb9', 3)
    openMidi()
  }

  static propTypes = {
    children: PropTypes.element.isRequired
  };

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    initRTC: initRTC,
    openMidi: open,
    codeChange: codeChange,
    createNewSketch: createNewSketch
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);