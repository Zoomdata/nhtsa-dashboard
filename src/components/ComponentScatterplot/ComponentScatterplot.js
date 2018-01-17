import flowRight from 'lodash.flowright';
import { toJS } from 'mobx';
import React from 'react';
import ScatterplotChart from '../ScatterplotChart/ScatterplotChart';
import { observer, inject } from 'mobx-react';

function ComponentScatterplot({ store }) {
  const data = toJS(store.chartData.componentData);
  /* eslint-disable no-unused-expressions */
  store.browser.width;
  store.browser.height;
  store.controls.activeTab;
  /* eslint-enable no-unused-expressions */
  return (
    <div className="scatterplot">
      <ScatterplotChart data={data} />
    </div>
  );
}

export default flowRight(inject('store'), observer)(ComponentScatterplot);
