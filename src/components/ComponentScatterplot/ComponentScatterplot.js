import styles from './ComponentScatterplot.css';

import React from 'react';
import ScatterplotChart from '../ScatterplotChart/ScatterplotChart';
import { observer } from 'mobx-react';

function ComponentScatterplot(props, { store }) {
    const data = store.chartData.componentData.get('data');
    store.browser.width;
    store.browser.height;
    store.controls.activeTab;
    return (
        <div className={styles.root}
        >
            <ScatterplotChart
                data={data}
            />
        </div>
    )
}

ComponentScatterplot.contextTypes = {
    store: React.PropTypes.object
};

export default observer(ComponentScatterplot);

