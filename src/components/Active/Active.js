import flowRight from 'lodash.flowright';
import React from 'react';
import { observer, inject } from 'mobx-react';

const Active = function({ chart, store }) {
  const { activeTab } = store.controls;
  const tab = activeTab.split('_')[1].toLowerCase();
  return (
    <li
      className={tab === chart ? 'active' : null}
      onClick={() => {
        const selectedTab = 'SHOW_' + chart.toUpperCase();
        if (selectedTab === 'SHOW_MAP') {
          store.chartStatus.set('mapReady', true);
        }
        store.controls.activeTab = selectedTab;
      }}
    >
      <a href={'#' + chart + '-tab'}>
        {chart === 'scatterplot' ? 'Failed Components' : 'Map'}
      </a>
    </li>
  );
};

export default flowRight(inject('store'), observer)(Active);
