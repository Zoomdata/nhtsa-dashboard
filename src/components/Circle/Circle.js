import styles from './Circle.css';

import React from 'react';
import { observer } from 'mobx-react';
import { controller } from '../../zoomdata';
import store from '../../stores/UiState';

const onClick = () => {
    store.chartFilters.set('filterStatus', 'FILTERS_RESET');
    store.chartFilters.delete('model');
    controller.get('componentDataQuery').filters.remove('model');
    controller.get('metricDataQuery').filters.remove('model');
    controller.get('stateDataQuery').filters.remove('model');
};

const Circle  = observer((props, { store }) => {
    const filterStatus = store.chartFilters.get('filterStatus');
    return (
        <div
            className={
                filterStatus === 'FILTERS_APPLIED' ?
                    styles.normal :
                    styles.disabled
            }
            onClick={onClick}
        >↺
        </div>
    )
});

export default Circle;

Circle.contextTypes = {
    store: React.PropTypes.object
}