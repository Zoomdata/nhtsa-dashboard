import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import flowRight from 'lodash.flowright';
import Dashboard from './components/Dashboard/Dashboard';
import ButtonContainer from './components/ButtonContainer/ButtonContainer';
import Overlay from './components/Overlay/Overlay';
import './App.css';
import { verticalScrollThreshold } from './config/app-constants';
import { getClient } from './Zoomdata';
import { queryConfig as makeDataConfig } from './config/queries/makeData';
import { queryConfig as yearDataConfig } from './config/queries/yearData';
import { queryConfig as modelDataConfig } from './config/queries/modelData';
import { queryConfig as componentDataConfig } from './config/queries/componentData';
import { queryConfig as metricTotalsDataConfig } from './config/queries/metricTotalsData';
import { queryConfig as metricDataConfig } from './config/queries/metricData';
import { queryConfig as stateDataConfig } from './config/queries/stateData';
import { queryConfig as gridDataConfig } from './config/queries/gridData';
class App extends Component {
  constructor(props) {
    super(props);
    this.initZoomdata();
  }
  render() {
    const { browser } = this.props.store;
    const { dashboardDimensions } = this.props.store.layout;
    let newBackgroundX =
      dashboardDimensions.offsetLeft + dashboardDimensions.width - 465;
    let newBackgroundY;
    let newOverflowY = 'hidden';
    if (window.innerHeight < verticalScrollThreshold) {
      newBackgroundY = verticalScrollThreshold - 323;
    } else {
      newBackgroundY = window.innerHeight - 323;
    }
    if (browser.height < verticalScrollThreshold) {
      newOverflowY = 'visible';
    }
    const nhtsaAppStyle = {
      backgroundPositionX: newBackgroundX,
      backgroundPositionY: newBackgroundY,
      overflowY: newOverflowY,
    };
    return (
      <div className="App" style={nhtsaAppStyle}>
        <Overlay />
        <Dashboard
          dashboardDimensions={dashboardDimensions}
          browser={browser}
        />
        <footer>
          © 2019 <a href="http://www.zoomdata.com/">Zoomdata</a>, Inc.{' '}
          <a href="http://www.zoomdata.com/contact">Contact</a>{' '}
          <a href="http://www.zoomdata.com/terms">Legal</a>
        </footer>
        <ButtonContainer />
      </div>
    );
  }

  initZoomdata = async () => {
    try {
      const { store } = this.props;
      store.client = await getClient();
      const sourceArray = await store.client.sources.fetch({
        name: 'Vehicle Complaints',
      });
      const source = sourceArray[0];
      this.initMakeData(source);
      this.initYearData(source);
      this.initModelData(source);
      this.initComponentData(source);
      this.initMetricTotalsData(source);
      this.initMetricData(source);
      this.initStateData(source);
      this.initGridData(source);
    } catch (e) {
      console.error(e);
    }
  };

  initMakeData = async source => {
    try {
      const { store } = this.props;
      store.queries.makeDataQuery = await store.client.createQuery(
        source,
        makeDataConfig,
      );
      store.client.runQuery(
        store.queries.makeDataQuery,
        data => {
          store.chartData.makeData = data;
        },
        console.error,
      );
    } catch (e) {
      console.error(e);
    }
  };

  initYearData = async source => {
    try {
      const { store } = this.props;
      store.queries.yearDataQuery = await store.client.createQuery(
        source,
        yearDataConfig,
      );
      store.client.runQuery(
        store.queries.yearDataQuery,
        data => {
          store.chartData.yearData = data;
        },
        console.error,
      );
    } catch (e) {
      console.error(e);
    }
  };

  initModelData = async source => {
    try {
      const { store } = this.props;
      store.queries.modelDataQuery = await store.client.createQuery(
        source,
        modelDataConfig,
      );
      store.client.runQuery(
        store.queries.modelDataQuery,
        data => {
          store.chartData.modelData = data;
        },
        console.error,
      );
    } catch (e) {
      console.error(e);
    }
  };

  initComponentData = async source => {
    try {
      const { store } = this.props;
      store.queries.componentDataQuery = await store.client.createQuery(
        source,
        componentDataConfig,
      );
      store.client.runQuery(
        store.queries.componentDataQuery,
        data => {
          store.chartData.componentData = data;
        },
        console.error,
      );
    } catch (e) {
      console.error(e);
    }
  };

  initMetricTotalsData = async source => {
    try {
      const { store } = this.props;
      store.queries.metricTotalsDataQuery = await store.client.createQuery(
        source,
        metricTotalsDataConfig,
      );
      store.client.runQuery(
        store.queries.metricTotalsDataQuery,
        data => {
          store.chartData.metricTotalsData = data;
        },
        console.error,
      );
    } catch (e) {
      console.error(e);
    }
  };

  initMetricData = async source => {
    try {
      const { store } = this.props;
      store.queries.metricDataQuery = await store.client.createQuery(
        source,
        metricDataConfig,
      );
      store.client.runQuery(
        store.queries.metricDataQuery,
        data => {
          store.chartData.metricData = data;
        },
        console.error,
      );
    } catch (e) {
      console.error(e);
    }
  };

  initStateData = async source => {
    try {
      const { store } = this.props;
      store.queries.stateDataQuery = await store.client.createQuery(
        source,
        stateDataConfig,
      );
    } catch (e) {
      console.error(e);
    }
  };

  initGridData = async source => {
    try {
      const { store } = this.props;
      store.queries.gridDataQuery = await store.client.createQuery(
        source,
        gridDataConfig,
      );
      const sorts = [
        {
          field: { field: { name: 'year_string' }, type: 'FIELD' },
          direction: 'ASC',
        },
      ];
      store.queries.gridDataQuery.set(['sorts'], sorts);
      store.queries.gridDataQuery.set(['offset'], 0);
    } catch (e) {
      console.error(e);
    }
  };
}

export default flowRight(
  inject('store'),
  observer,
)(App);
