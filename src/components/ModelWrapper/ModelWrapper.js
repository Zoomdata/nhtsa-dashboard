import React, { Component } from 'react';
import ModelHeader from '../ModelHeader/ModelHeader';
import ModelBarChart from '../ModelBarChart/ModelBarChart';

export default class ModelWrapper extends Component {
  render() {
    return (
      <div className="model-wrapper">
        <ModelHeader />
        <ModelBarChart />
      </div>
    );
  }
}
