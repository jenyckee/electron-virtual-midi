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
      <div className="home-container">
        <Home sketches={this.props.sketches} />
        <div className="preview">
          <h1>Preview</h1>
          {this.props.connectionId ? 
          <div className="frame-container">
            <iframe width="100%" height="100%" 
            src={`http://localhost:8000/#${this.props.connectionId}`}></iframe>
          </div>
          : null }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    sketches: state.sketch.sketches,
    connectionId: state.rtc.get('connectionId')
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchSketches: sketch.actions.fetchSketches
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);