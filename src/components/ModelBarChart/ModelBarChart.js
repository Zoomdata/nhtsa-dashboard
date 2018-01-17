import flowRight from 'lodash.flowright';
import { toJS } from 'mobx';
import React, { Component } from 'react';
import BarChart from '../BarChart/BarChart';
import { observer, inject } from 'mobx-react';

class ModelBarChart extends Component {
  render() {
    const { store } = this.props;
    const { browser } = store;
    /* eslint-disable no-unused-expressions */
    browser.height;
    browser.width;
    /* eslint-enable no-unused-expressions */
    const data = toJS(store.chartData.modelData);
    const model = store.chartFilters;
    return (
      <div id="model-bar-chart">
        <BarChart data={data} activeBar={model} onClick={this.onClick} />
      </div>
    );
  }
  onClick = model => {
    const { store } = this.props;
    store.queries.gridDataQuery.set(['offset'], 0);
    const filter = {
      path: 'model',
      operation: 'IN',
      value: [model],
    };
    store.chartFilters.set('model', model);
    store.chartFilters.delete('model');
    store.queries.componentDataQuery.filters.remove(filter.path);
    store.queries.componentDataQuery.filters.add(filter);
    store.queries.metricDataQuery.filters.remove(filter.path);
    store.queries.metricDataQuery.filters.add(filter);
    store.queries.stateDataQuery.filters.remove(filter.path);
    store.queries.stateDataQuery.filters.add(filter);
    store.queries.gridDataQuery.filters.remove(filter.path);
    store.queries.gridDataQuery.filters.add(filter);
    store.chartFilters.set('filterStatus', 'FILTERS_APPLIED');
  };
}

export default flowRight(inject('store'), observer)(ModelBarChart);
