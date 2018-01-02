import flowRight from 'lodash.flowright';
import React from 'react';
import { observer, inject } from 'mobx-react';

const addCommas = nStr => {
  nStr += '';
  const x = nStr.split('.');
  let x1 = x[0];
  const x2 = x.length > 1 ? '.' + x[1] : '';
  const rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1,$2');
  }
  return x1 + x2;
};

function H2Header({ store }) {
  const metricData = store.chartData.metricData;
  const metricTotalsData = store.chartData.metricTotalsData;
  const data = metricData.length === 0 ? 0 : metricData[0].current.count;
  const totalsData =
    metricTotalsData.length === 0 ? 0 : metricTotalsData[0].current.count;
  return (
    <h2 className="header">
      <b>Vehicle Complaints:</b> Showing <span>{addCommas(data)}</span> of{' '}
      {addCommas(totalsData)} RECORDS
    </h2>
  );
}

export default flowRight(inject('store'), observer)(H2Header);
