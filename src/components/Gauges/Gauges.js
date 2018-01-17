import flowRight from 'lodash.flowright';
import { toJS } from 'mobx';
import React from 'react';
import Gauge from '../Gauge/Gauge';
import { observer, inject } from 'mobx-react';

function Gauges({ store }) {
  const metricData = toJS(store.chartData.metricData);
  const metricTotalsData = toJS(store.chartData.metricTotalsData);
  return (
    <div className="gauges">
      <Gauge
        id="crashes-gauge"
        name="CRASHES"
        data={metricData}
        max={metricTotalsData}
      />
      <Gauge
        id="injuries-gauge"
        name="INJURIES"
        data={metricData}
        max={metricTotalsData}
      />
      <Gauge
        id="fires-gauge"
        name="FIRES"
        data={metricData}
        max={metricTotalsData}
      />
      <Gauge
        id="speed-gauge"
        name="AVG. SPEED"
        data={metricData}
        max={metricTotalsData}
      />
    </div>
  );
}

export default flowRight(inject('store'), observer)(Gauges);
