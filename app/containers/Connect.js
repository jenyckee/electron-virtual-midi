import React, { Component } from 'react';
import Connect from '../components/Connect';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as sketch from '../reducers/sketch'

class HomePage extends Component {

  componentDidMount() {
    this.props.fetchSketches();
  }

  render() {
    return (
      <Connect />
    );
  }
}

function mapStateToProps(state) {
  return {
    sketches: state.sketch.sketches
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchSketches: sketch.actions.fetchSketches
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);