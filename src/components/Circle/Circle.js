import flowRight from 'lodash.flowright';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

class Circle extends Component {
  render() {
    const { store } = this.props;
    const filterStatus = store.chartFilters.get('filterStatus');
    return (
      <div
        className={
          filterStatus === 'FILTERS_APPLIED' ? 'circle' : 'circle disabled'
        }
        onClick={this.onClick}
      >
        ↺
      </div>
    );
  }

  onClick = () => {
    const { store } = this.props;
    store.queries.gridDataQuery.set(['offset'], 0);
    store.chartFilters.set('filterStatus', 'FILTERS_RESET');
    store.chartFilters.delete('model');
    store.queries.componentDataQuery.filters.remove('model');
    store.queries.metricDataQuery.filters.remove('model');
    store.queries.stateDataQuery.filters.remove('model');
  };
}

export default flowRight(inject('store'), observer)(Circle);
