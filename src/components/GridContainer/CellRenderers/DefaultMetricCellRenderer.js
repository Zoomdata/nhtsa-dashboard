import React, { Component } from 'react';

export default class DefaultMetricCellRenderer extends Component {
  render() {
    let { value } = this.props;
    if (!value || value === '' || value === '0') {
      value = '•';
    } else {
      value = 'Y';
    }
    return <span>{value}</span>;
  }
}
