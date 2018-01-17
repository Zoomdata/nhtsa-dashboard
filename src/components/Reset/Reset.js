import React, { Component } from 'react';
import Circle from '../Circle/Circle';
import Label from '../Label/Label';

export default class Reset extends Component {
  render() {
    return (
      <button className="reset">
        <Circle />
        <Label />
      </button>
    );
  }
}
