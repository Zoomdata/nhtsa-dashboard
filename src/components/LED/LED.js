import flowRight from 'lodash.flowright';
import React from 'react';
import Background from '../Background/Background';
import Foreground from '../Foreground/Foreground';
import { observer, inject } from 'mobx-react';

function LED({ store, position }) {
  const { metricData } = store.chartData;
  const { metricTotalsData } = store.chartData;
  if (position === '5') {
    const data = metricData.length === 0 ? 0 : metricData[0].current.count;
    return (
      <div className="LED five">
        <Background data="88888" />
        <Foreground data={data} />
      </div>
    );
  } else {
    const data =
      metricTotalsData.length === 0
        ? 888888
        : metricTotalsData[0].current.count;
    return (
      <div className="LED six">
        <Background data="888888" />
        <Foreground data={data} />
      </div>
    );
  }
}

export default flowRight(inject('store'), observer)(LED);
