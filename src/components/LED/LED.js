import styles from './LED.css';

import React from 'react';
import Background from '../Background/Background';
import Foreground from '../Foreground/Foreground';
import { observer } from 'mobx-react';

function LED(props, { store }) {
    const { metricData } = store.chartData;
    const { metricTotalsData } = store.chartData;
    const { position } = props;
    if (position === '5') {
        const data = !metricData.get('data') ? 0 : metricData.get('data')[0].current.count;
        return (
            <div
                className={styles.five}>
                <Background
                    data="88888"
                />
                <Foreground
                    data={data}
                />
            </div>
        )
    } else {
        const data = !metricTotalsData.get('data') ? 888888 : metricTotalsData.get('data')[0].current.count;
        return (
            <div
                className={styles.six}>
                <Background
                    data="888888"
                />
                <Foreground
                    data={data}
                />
            </div>
        )
    }
}

LED.contextTypes = {
    store: React.PropTypes.object
}

export default observer(LED);
