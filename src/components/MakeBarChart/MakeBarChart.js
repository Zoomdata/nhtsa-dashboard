import flowRight from 'lodash.flowright';
import { toJS } from 'mobx';
import React, { Component } from 'react';
import BarChart from '../BarChart/BarChart';
import { observer, inject } from 'mobx-react';

class MakeBarChart extends Component {
  render() {
    const { store } = this.props;
    const makeBarChartStyle = {
      zIndex: 1,
    };
    const { browser } = store;
    const { hideOverlay } = store.controls;
    /* eslint-disable no-unused-expressions */
    browser.height;
    browser.width;
    /* eslint-enable no-unused-expressions */
    const data = toJS(store.chartData.makeData);
    const make = toJS(store.chartFilters.get('make'));
    return (
      <div id="make-bar-chart" style={hideOverlay ? makeBarChartStyle : null}>
        <BarChart data={data} activeBar={make} onClick={this.onClick} />
      </div>
    );
  }

  onClick = (make, hideOverlay) => {
    const { store } = this.props;
    store.queries.gridDataQuery.set(['offset'], 0);
    const filter = {
      path: 'make',
      operation: 'IN',
      value: [make],
    };
    store.chartFilters.set('make', make);
    store.chartFilters.delete('model');
    store.queries.modelDataQuery.filters.remove(filter.path);
    store.queries.modelDataQuery.filters.add(filter);
    store.queries.componentDataQuery.filters.remove(filter.path);
    store.queries.componentDataQuery.filters.remove('model');
    store.queries.componentDataQuery.filters.add(filter);
    store.queries.metricDataQuery.filters.remove(filter.path);
    store.queries.metricDataQuery.filters.remove('model');
    store.queries.metricDataQuery.filters.add(filter);
    store.queries.stateDataQuery.filters.remove(filter.path);
    store.queries.stateDataQuery.filters.remove('model');
    store.queries.stateDataQuery.filters.add(filter);
    store.queries.gridDataQuery.filters.remove(filter.path);
    store.queries.gridDataQuery.filters.remove('model');
    store.queries.gridDataQuery.filters.add(filter);
    store.controls.hideOverlay = hideOverlay ? true : null;
  };
}

export default flowRight(inject('store'), observer)(MakeBarChart);
