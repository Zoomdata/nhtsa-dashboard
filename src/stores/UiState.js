import { observable, transaction } from 'mobx';
import { queryConfig as gridDataConfig } from '../config/queries/gridData';

class UiState {
  constructor() {
    this.client = observable.ref(null);

    this.browser = observable({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    this.layout = observable({
      dashboardDimensions: {
        width: null,
        height: null,
        offsetLeft: null,
      },
      makeWrapperDimensions: {
        width: null,
        height: null,
        offsetTop: null,
        offsetLeft: null,
      },
      overlaySplatDimensions: {
        width: null,
      },
    });

    this.controls = observable({
      hideOverlay: false,
      aboutVisibility: 'CLOSE_ABOUT',
      hoodAction: 'CLOSE_HOOD',
      arrowVisibility: 'SHOW_ARROW',
      activeTab: 'SHOW_SCATTERPLOT',
    });

    this.queries = observable({
      makeDataQuery: observable.ref(null),
      yearDataQuery: observable.ref(null),
      modelDataQuery: observable.ref(null),
      componentDataQuery: observable.ref(null),
      metricTotalsDataQuery: observable.ref(null),
      metricDataQuery: observable.ref(null),
      stateDataQuery: observable.ref(null),
      gridDataQuery: observable.ref(null),
    });

    this.chartData = observable({
      makeData: observable.shallow([]),
      yearData: observable.shallow([]),
      modelData: observable.shallow([]),
      componentData: observable.shallow([]),
      metricTotalsData: observable.shallow([]),
      metricData: observable.shallow([]),
      stateData: observable.shallow([]),
      gridData: observable.shallow([]),
    });

    this.chartFilters = observable.map({
      filterStatus: 'FILTERS_RESET',
    });

    this.chartStatus = observable.map({
      mapReady: false,
      gridReady: false,
      gridLoadingData: false,
    });

    this.chartStatus.observe(
      function(changes) {
        if (changes.name === 'mapReady' && changes.newValue === true) {
          this.client.runQuery(this.queries.stateDataQuery, data => {
            this.chartData.stateData = data;
          });
        }
        if (changes.name === 'gridReady' && changes.newValue === true) {
          this.client.runQuery(this.queries.gridDataQuery, data => {
            if (
              this.queries.gridDataQuery.get(['offset']) <
              this.queries.gridDataQuery.get(['limit'])
            ) {
              this.chartData.gridData = data.map(row => {
                const datum = {};
                row.forEach((value, index) => {
                  datum[gridDataConfig.fields[index].name] = value;
                });
                return datum;
              });
            } else {
              const newData = data.map(row => {
                const datum = {};
                row.forEach((value, index) => {
                  datum[gridDataConfig.fields[index].name] = value;
                });
                return datum;
              });
              const oldData = this.chartData.gridData;
              this.chartData.gridData = oldData.concat(newData);
              this.chartStatus.set('gridLoadingData', false);
            }
          });
        }
      }.bind(this),
    );

    window.onresize = function() {
      transaction(
        function() {
          this.browser.width = window.innerWidth;
          this.browser.height = window.innerHeight;
        }.bind(this),
      );
    }.bind(this);
  }
}

export default new UiState();
