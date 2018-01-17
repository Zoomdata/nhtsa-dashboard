import flowRight from 'lodash.flowright';
import { observer, inject } from 'mobx-react';
import React from 'react';
import ComponentScatterplot from '../ComponentScatterplot/ComponentScatterplot';
import Map from '../Map/Map';

const Tab = function({ chart, store }) {
  const { activeTab } = store.controls;
  const tab = activeTab.split('_')[1].toLowerCase();
  return (
    <div className={tab === chart ? 'tab active' : 'tab'}>
      {chart === 'scatterplot' ? <ComponentScatterplot /> : <Map />}
    </div>
  );
};

export default flowRight(inject('store'), observer)(Tab);
