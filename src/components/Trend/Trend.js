import flowRight from 'lodash.flowright';
import React, { Component } from 'react';
import TrendChart from '../TrendChart/TrendChart';
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx';

class Trend extends Component {
  render() {
    const { store } = this.props;
    const data = toJS(store.chartData.yearData);
    const filterStatus = store.chartFilters.get('filterStatus');
    return (
      <div id="trend">
        <TrendChart
          data={data}
          filterStatus={filterStatus}
          onBrushEnd={this.onBrushEnd}
        />
      </div>
    );
  }

  onBrushEnd = (selectedYears, changeFilterStatus) => {
    const { store } = this.props;
    store.queries.gridDataQuery.set(['offset'], 0);
    const filter = {
      path: 'year_string',
      operation: 'IN',
      value: selectedYears,
    };
    store.chartFilters.set('year', selectedYears);
    store.queries.componentDataQuery.filters.remove(filter.path);
    store.queries.componentDataQuery.filters.add(filter);
    store.queries.metricDataQuery.filters.remove(filter.path);
    store.queries.metricDataQuery.filters.add(filter);
    store.queries.stateDataQuery.filters.remove(filter.path);
    store.queries.stateDataQuery.filters.add(filter);
    store.queries.gridDataQuery.filters.remove(filter.path);
    store.queries.gridDataQuery.filters.add(filter);
    if (changeFilterStatus) {
      store.chartFilters.set('filterStatus', 'FILTERS_APPLIED');
    }
  };
}
export default flowRight(inject('store'), observer)(Trend);
