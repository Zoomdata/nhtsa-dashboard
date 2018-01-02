import React, { Component } from 'react';

export default class Filler extends Component {
  render() {
    const text = this.props.text;
    return <div className="filler">{text}</div>;
  }
}
