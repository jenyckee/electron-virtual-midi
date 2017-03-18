import React, { Component } from 'react';
import Home from '../components/Home';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as sketch from '../reducers/sketch'

class HomePage extends Component {

  componentDidMount() {
    this.props.fetchSketches();
  }

  render() {
    return (
      <Home sketches={this.props.sketches} />
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