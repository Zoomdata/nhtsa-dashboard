import flowRight from 'lodash.flowright';
import { toJS } from 'mobx';
import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-dark.css';
import { getHeight } from '../../utilities';
import { observer, inject } from 'mobx-react';
import { frameworkComponents } from './CellRenderers';
import { columnDefs } from './ColumnDefinitions';

class GridContainer extends Component {
  constructor(props) {
    super(props);
    this.onGridReady = this.onGridReady.bind(this);
  }

  onGridReady(params) {
    this.api = params.api;
    this.columnApi = params.columnApi;
    // gridBody.addEventListener('scroll', function() {
    //   if (
    //     gridBody.scrollHeight - getHeight(gridBody) - gridBody.scrollTop <
    //       200 &&
    //     gridDetails.hasNextDetails &&
    //     !gridDetails.loadingDetails
    //   ) {
    //     fetchGridData(controller.get('gridDataQuery').queryConfig);
    //   }
    // });
  }

  componentDidUpdate() {
    if (!this.api) {
      return;
    }
    const data = toJS(this.props.store.chartData.gridData);
    this.api.setRowData(data);
    this.api.sizeColumnsToFit();
  }

  componentWillUnmount() {
    this.api.destroy();
  }

  render() {
    /* eslint-disable no-unused-vars */
    const data = toJS(this.props.store.chartData.gridData);
    /* eslint-enable no-unused-vars */
    return (
      <div className="grid-container">
        <div id="grid-chart" className="ag-theme-dark">
          <AgGridReact
            onGridReady={this.onGridReady}
            columnDefs={columnDefs}
            enableSorting="false"
            enableFilter="false"
            headerHeight="55"
            rowHeight="28"
            suppressRowClickSelection="true"
            suppressCellSelection="true"
            suppressScrollOnNewData="true"
            frameworkComponents={frameworkComponents}
            onViewportChanged={() => {
              const { store } = this.props;
              const gridBody = document.getElementsByClassName(
                'ag-body-viewport',
              )[0];
              if (
                gridBody.scrollHeight -
                  getHeight(gridBody) -
                  gridBody.scrollTop <
                  200 &&
                store.queries.gridDataQuery &&
                !store.chartStatus.get('gridLoadingData')
              ) {
                store.chartStatus.set('gridLoadingData', true);
                store.queries.gridDataQuery.set(
                  ['offset'],
                  store.queries.gridDataQuery.get(['offset']) +
                    store.queries.gridDataQuery.get(['limit']),
                );
              }
            }}
          />
        </div>
      </div>
    );
  }
}
export default flowRight(inject('store'), observer)(GridContainer);
