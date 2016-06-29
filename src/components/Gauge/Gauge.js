import styles from './Gauge.css';

import React from 'react';
import GaugeChart from '../GaugeChart/GaugeChart';

const Gauge = ({
    name,
    id,
    data,
    max
}) => {
    return (
        <div
            className={styles.root}
            id={id}
        >
            <GaugeChart
                name={name}
                data={data}
                max={max}
            />
        </div>
    )
};

export default Gauge;