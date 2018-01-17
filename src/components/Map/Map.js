import flowRight from 'lodash.flowright';
import { toJS } from 'mobx';
import React from 'react';
import MapChart from '../MapChart/MapChart';
import { observer, inject } from 'mobx-react';

const Map = function({ store }) {
  const data = toJS(store.chartData.stateData);
  /* eslint-disable no-unused-expressions */
  store.browser.width;
  store.browser.height;
  store.controls.activeTab;
  /* eslint-enable no-unused-expressions */
  return (
    <div className="map">
      <MapChart data={data} />
    </div>
  );
};

export default flowRight(inject('store'), observer)(Map);
