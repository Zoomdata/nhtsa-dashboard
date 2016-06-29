import { map } from 'mobx';
import ZoomdataSDK from 'zoomdata-client';
import { server } from '../config/zoomdata-connections/production';
import * as makeData from '../config/queries/makeData';
import * as yearData from '../config/queries/yearData';
import * as modelData from '../config/queries/modelData';
import * as componentData from '../config/queries/componentData';
import * as metricTotalsData from '../config/queries/metricTotalsData';
import * as metricData from '../config/queries/metricData';
import * as stateData from '../config/queries/stateData';
import * as gridData from '../config/queries/gridData';
import store from '../stores/UiState';
import { gridDetails } from '../config/app-constants';
import { secure, host, port, path } from '../config/oauth';
import mapKeys from 'lodash.mapkeys';
import camelCase from 'lodash.camelcase';

const { credentials, application } = server;

export let controller = map();

ZoomdataSDK.createClient({
    credentials: credentials.toJs(),
    application: application
}).then(function(client) {
    this.set('client', client)
}.bind(controller));


controller.observe(function(props) {
    if (props.name === 'client' && props.type === 'add') {
        props.object.get('client').sources.update({
            name: 'Vehicle Complaints'
        }).then(function () {
            props.object.set('sourceReady', true);
        }.bind(props.object));

        props.object.set('createQuery', function (queryName, source, queryConfig) {
            this.get('client').createQuery(
                {name: source},
                queryConfig
            ).then(function (query) {
                this.set(queryName, query);
            }.bind(this))
        }.bind(props.object));

        props.object.set('runQuery', function (query, queryStore) {
            this.get('client').run(query).then(function (thread) {
                thread.on('thread:message', function (data) {
                    queryStore.set('data', data.slice());
                })
            })
        }.bind(props.object));
    }
    if (props.name === 'sourceReady' && props.type === 'add') {
        props.object.get('createQuery')('makeDataQuery', makeData.source, makeData.queryConfig);
        props.object.get('createQuery')('yearDataQuery', yearData.source, yearData.queryConfig);
        props.object.get('createQuery')('modelDataQuery', modelData.source, modelData.queryConfig);
        props.object.get('createQuery')('componentDataQuery', componentData.source, componentData.queryConfig);
        props.object.get('createQuery')('metricTotalsDataQuery', metricTotalsData.source, metricTotalsData.queryConfig);
        props.object.get('createQuery')('metricDataQuery', metricData.source, metricData.queryConfig);
        props.object.get('createQuery')('stateDataQuery', stateData.source, stateData.queryConfig);

        props.object.set('gridDataQuery', gridData);
    }
});

controller.observe(function(props) {
    if (props.name === 'makeDataQuery' && props.type === 'add') {
        props.object.get('runQuery')(props.object.get('makeDataQuery'), store.chartData.makeData);
    }
    if (props.name === 'yearDataQuery' && props.type === 'add') {
        props.object.get('runQuery')(props.object.get('yearDataQuery'), store.chartData.yearData);
    }
    if (props.name === 'modelDataQuery' && props.type === 'add') {
        props.object.get('runQuery')(props.object.get('modelDataQuery'), store.chartData.modelData);
    }
    if (props.name === 'componentDataQuery' && props.type === 'add') {
        props.object.get('runQuery')(props.object.get('componentDataQuery'), store.chartData.componentData);
    }
    if (props.name === 'metricTotalsDataQuery' && props.type === 'add') {
        props.object.get('runQuery')(props.object.get('metricTotalsDataQuery'), store.chartData.metricTotalsData);
    }
    if (props.name === 'metricDataQuery' && props.type === 'add') {
        props.object.get('runQuery')(props.object.get('metricDataQuery'), store.chartData.metricData);
    }
    if (props.name === 'mapReady' && props.type === 'add') {
        props.object.get('runQuery')(props.object.get('stateDataQuery'), store.chartData.stateData);
    }
    if( props.name === 'gridReady' && props.type === 'add') {
        const querySource = props.object.get('client').sources.find({name: gridData.source});
        gridData.queryConfig.streamSourceId = querySource.id;
        fetchGridData(props.object.get('gridDataQuery').queryConfig);
    }
});

function getPreviewEndpointURL() {
    let endpointURL = secure ? 'https://' : 'http://';
    endpointURL += port ? host + ':' + port + path + '/service/stream/preview' : host + path + '/service/stream/preview';
    endpointURL += '?key=' + '57740838e4b0678411040887';

    return endpointURL;
}

export function fetchGridData(query) {
    gridDetails.loadingDetails = true;
    const url = getPreviewEndpointURL();
    query.limit = gridDetails.limit;
    query.offset = gridDetails.offset;
    fetch(url, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(query)
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        gridDetails.hasNextDetails = data.hasNext;
        if (gridDetails.offset < gridDetails.limit) {
            store.chartData.gridData.set('data', data.documents.map(function(d) { return mapKeys(d, function(v, k) { return camelCase(k)})}).slice());
        } else {
            const newData = data.documents.map(function(d) { return mapKeys(d, function(v, k) { return camelCase(k)})})
            const oldData = store.chartData.gridData.get('data');
            store.chartData.gridData.set('data', oldData.concat(newData).slice());
        }
        gridDetails.offset += gridDetails.limit;
        gridDetails.loadingDetails = false;
    }).catch(function (err) {
        console.log('Error: ', err);
        gridDetails.loadingDetails = false;
        console.log(err);
    });
}