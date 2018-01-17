import React, { Component } from 'react';

export default class SpeedCellRenderer extends Component {
  render() {
    let { value } = this.props;
    if (!value || value === '' || value === '0') {
      value = 'n/a';
    }
    return <span>{value}</span>;
  }
}
