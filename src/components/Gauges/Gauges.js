import styles from './Gauges.css';

import React from 'react';
import Gauge from '../Gauge/Gauge';
import { observer } from 'mobx-react';

function Gauges(props, { store }) {
    const metricData = store.chartData.metricData.get('data');
    const metricTotalsData = store.chartData.metricTotalsData.get('data');
    return (
        <div
            className={styles.root}
        >
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
    )
}

Gauges.contextTypes = {
    store: React.PropTypes.object
};

export default observer(Gauges);

