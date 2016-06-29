import styles from './ModelBarChart.css';

import React from 'react';
import BarChart from '../BarChart/BarChart';
import { fetchGridData, controller } from '../../zoomdata/';
import store from '../../stores/UiState';
import remove from 'lodash.remove';
import { gridDetails } from '../../config/app-constants';
import { observer } from 'mobx-react';

const onClick = (model) => {
    gridDetails.offset = 0;
    gridDetails.hasNextDetails = true;
    const filter = {
        path: 'model',
        operation: 'IN',
        value: [model]
    };
    store.chartFilters.set('model', model);
    controller.get('componentDataQuery').filters.remove(filter.path);
    controller.get('componentDataQuery').filters.add(filter);
    controller.get('metricDataQuery').filters.remove(filter.path);
    controller.get('metricDataQuery').filters.add(filter);
    controller.get('stateDataQuery').filters.remove(filter.path);
    controller.get('stateDataQuery').filters.add(filter);
    const gridDataQuery = controller.get('gridDataQuery').queryConfig;
    remove(gridDataQuery.restrictions, function(filter) {
        return filter.path === 'model';
    });
    gridDataQuery.restrictions.push(filter);
    controller.has('gridReady') ? fetchGridData(controller.get('gridDataQuery').queryConfig): null;
    store.chartFilters.set('filterStatus', 'FILTERS_APPLIED');
};

function ModelBarChart(props, { store }) {
    const { browser } = store;
    browser.height;
    browser.width;
    const data = store.chartData.modelData.get('data');
    const model = store.chartFilters.get('model');
    return (
        <div
            className={styles.root}
        >
            <BarChart
                data={data}
                activeBar={model}
                onClick={onClick}
            />
        </div>
    )
}

ModelBarChart.contextTypes = {
    store: React.PropTypes.object
};

export default observer(ModelBarChart);


