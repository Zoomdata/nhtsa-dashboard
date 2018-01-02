import React, { Component } from 'react';
import Title from '../Title/Title';
import Stats from '../Stats/Stats';

export default class Header extends Component {
  render() {
    return (
      <div className="header">
        <Title />
        <Stats />
      </div>
    );
  }
}
