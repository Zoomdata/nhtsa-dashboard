import { observable, asStructure, asFlat, transaction, map } from 'mobx';

class UiState {
    constructor() {
        this.browser = observable(asStructure({
            width: window.innerWidth,
            height: window.innerHeight
        }));

        this.layout = observable({
            dashboardDimensions: {
                width: null,
                height: null,
                offsetLeft: null
            },
            makeWrapperDimensions: {
                width: null,
                height: null,
                offsetTop: null,
                offsetLeft: null
            },
            overlaySplatDimensions: {
                width: null
            }
        });

        this.controls = observable({
            hideOverlay: false,
            aboutVisibility: 'CLOSE_ABOUT',
            hoodAction: 'CLOSE_HOOD',
            arrowVisibility: 'SHOW_ARROW',
            activeTab: 'SHOW_SCATTERPLOT'
        });

        this.chartData = observable({
            makeData: map({}, asFlat),
            yearData: map({}, asFlat),
            modelData: map({}, asFlat),
            componentData: map({}, asFlat),
            metricTotalsData: map({}, asFlat),
            metricData: map({}, asFlat),
            stateData: map({}, asFlat),
            gridData: map({
                data: []
            }, asFlat)
        });

        this.chartFilters = map({
            filterStatus: 'FILTERS_RESET'
        });

        window.onresize = function() {
            transaction(function() {
                this.browser.width = window.innerWidth;
                this.browser.height = window.innerHeight;
            }.bind(this));
        }.bind(this);
    }
}

export default new UiState();