import styles from './MakeBarChart.css';

import React from 'react';
import BarChart from '../BarChart/BarChart';
import { fetchGridData, controller } from '../../zoomdata/';
import store from '../../stores/UiState';
import remove from 'lodash.remove';
import { gridDetails } from '../../config/app-constants';
import { observer } from 'mobx-react';

const onClick = (make, hideOverlay) => {
    gridDetails.offset = 0;
    gridDetails.hasNextDetails = true;
    const filter = {
        path: 'make',
        operation: 'IN',
        value: [make]
    };
    store.chartFilters.set('make', make);
    store.chartFilters.delete('model');
    controller.get('modelDataQuery').filters.remove(filter.path);
    controller.get('modelDataQuery').filters.add(filter);
    controller.get('componentDataQuery').filters.remove(filter.path);
    controller.get('componentDataQuery').filters.remove('model');
    controller.get('componentDataQuery').filters.add(filter);
    controller.get('metricDataQuery').filters.remove(filter.path);
    controller.get('metricDataQuery').filters.remove('model');
    controller.get('metricDataQuery').filters.add(filter);
    controller.get('stateDataQuery').filters.remove(filter.path);
    controller.get('stateDataQuery').filters.remove('model');
    controller.get('stateDataQuery').filters.add(filter);
    const gridDataQuery = controller.get('gridDataQuery').queryConfig;
    remove(gridDataQuery.restrictions, function(filter) {
        return filter.path === 'make';
    });
    remove(gridDataQuery.restrictions, function(filter) {
        return filter.path === 'model';
    });
    gridDataQuery.restrictions.push(filter);
    controller.has('gridReady') ? fetchGridData(controller.get('gridDataQuery').queryConfig): null;
    hideOverlay ? (store.controls.hideOverlay = true) : null;
}

function MakeBarChart(props, { store }) {
    const makeBarChartStyle = {
        zIndex: 1
    };
    const { browser } = store;
    const { hideOverlay } = store.controls;
    browser.height;
    browser.width;
    const data = store.chartData.makeData.get('data');
    const make = store.chartFilters.get('make');
    return (
        <div
            className={styles.root}
            style={
                hideOverlay ? makeBarChartStyle : null
            }
        >
            <BarChart
                data={data}
                activeBar={make}
                onClick={onClick}
            />
        </div>
    )
}

MakeBarChart.contextTypes = {
    store: React.PropTypes.object
};

export default observer(MakeBarChart);



