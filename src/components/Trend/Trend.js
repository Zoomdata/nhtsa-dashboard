import styles from './Trend.css';

import React from 'react';
import TrendChart from '../TrendChart/TrendChart';
import store from '../../stores/UiState';
import { fetchGridData, controller } from '../../zoomdata/';
import remove from 'lodash.remove';
import { gridDetails } from '../../config/app-constants';
import { observer } from 'mobx-react';
import { toJSON } from 'mobx';

const onBrushEnd = (selectedYears, changeFilterStatus) => {
    gridDetails.offset = 0;
    gridDetails.hasNextDetails = true;
    const filter = {
        path: 'year_string',
        operation: 'IN',
        value: selectedYears
    };
    store.chartFilters.set('year', selectedYears);
    controller.get('componentDataQuery').filters.remove(toJSON(filter.path));
    controller.get('componentDataQuery').filters.add(toJSON(filter));
    controller.get('metricDataQuery').filters.remove(toJSON(filter.path));
    controller.get('metricDataQuery').filters.add(toJSON(filter));
    controller.get('stateDataQuery').filters.remove(toJSON(filter.path));
    controller.get('stateDataQuery').filters.add(toJSON(filter));
    const gridDataQuery = controller.get('gridDataQuery').queryConfig;
    remove(gridDataQuery.restrictions, function(filter) {
        return filter.path === 'year_string';
    });
    gridDataQuery.restrictions.push(toJSON(filter));
    controller.has('gridReady') ? fetchGridData(controller.get('gridDataQuery').queryConfig): null;
    changeFilterStatus ?
        (store.chartFilters.set('filterStatus', 'FILTERS_APPLIED')) :
        null
}

function Trend(props, { store }) {
    const data = store.chartData.yearData.get('data');
    const filterStatus = store.chartFilters.get('filterStatus');
    return (
        <div
            className={styles.root}
        >
            <TrendChart
                data={data}
                filterStatus={filterStatus}
                onBrushEnd={onBrushEnd}
            />
        </div>
    )
}

Trend.contextTypes = {
    store: React.PropTypes.object
};
export default observer(Trend);
