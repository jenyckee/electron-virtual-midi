import React, { Component } from 'react';
import Sketch from '../components/Sketch';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class SketchContainer extends Component {
  render() {
    return (
      <Sketch sketchId={this.props.sketchId}/>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    sketchId: ownProps.params.id,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SketchContainer);
