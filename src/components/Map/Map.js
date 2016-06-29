import styles from './Map.css';

import React from 'react';
import MapChart from '../MapChart/MapChart';
import { observer } from 'mobx-react';

const Map = observer(function(props, { store }) {
    const data = store.chartData.stateData.get('data');
    store.browser.width;
    store.browser.height;
    store.controls.activeTab;
    return (
        <div
            className={styles.root}
        >
            <MapChart
                data={data}
            />
        </div>
    )
});

export default Map;

Map.contextTypes = {
    store: React.PropTypes.object
};