import styles from './GridContainer.css';

import React, { Component } from 'react';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid/dist/styles/ag-grid.css';
import './src/agGridStyles/theme-dark.css';
import ColDefFactory from './src/ColDefFactory';
import { getHeight } from '../../utilities';
import { gridDetails } from '../../config/app-constants';
import { observer } from 'mobx-react';
import { fetchGridData, controller } from '../../zoomdata';

@observer export default class GridContainer extends Component {
    onGridReady(params) {
        this.api = params.api;
        this.columnApi = params.columnApi;
        const gridBody = document.getElementsByClassName('ag-body-viewport')[0];
        gridBody.addEventListener('scroll', function() {
            if (gridBody.scrollHeight - getHeight(gridBody) - gridBody.scrollTop < 200 && gridDetails.hasNextDetails && !gridDetails.loadingDetails) {
                fetchGridData(controller.get('gridDataQuery').queryConfig);
            }
        });
    }
    componentDidUpdate() {
        if (!this.api) {
            return;
        }
        const data = this.context.store.chartData.gridData.get('data');
        this.api.setRowData(data);
        this.api.sizeColumnsToFit()
    }
    componentWillUnmount() {
        this.api.destroy();
    }
    componentWillMount() {
        this.columnDefs = new ColDefFactory().createColDefs();
    }
    render() {
        /* eslint-disable no-unused-vars */
        const data = this.context.store.chartData.gridData.get('data');
        /* eslint-enable no-unused-vars */
        const gridGroupStyle = {
            height: '100%'
        };
        return (
            <div
                className={styles.root}
            >
                <div
                    className="ag-dark"
                    style={gridGroupStyle}
                >
                    <AgGridReact
                        onGridReady={this.onGridReady.bind(this)}
                        columnDefs={this.columnDefs}
                        enableSorting="false"
                        enableFilter="false"
                        headerHeight="55"
                        rowHeight="28"
                        suppressRowClickSelection="true"
                        suppressCellSelection="true"
                    />
                </div>
            </div>
        )
    }
}

GridContainer.contextTypes = {
    store: React.PropTypes.object
};