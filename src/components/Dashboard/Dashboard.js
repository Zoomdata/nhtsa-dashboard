import flowRight from 'lodash.flowright';
import { inject } from 'mobx-react/index';
import React, { Component } from 'react';
import DashboardBackground from '../DashboardBackground/DashboardBackground';
import DashboardForeground from '../DashboardForeground/DashboardForeground';
import { getWidth, getHeight } from '../../utilities';
import { observer } from 'mobx-react';

class Dashboard extends Component {
  setDimensions(comp) {
    if (comp !== null) {
      const el = comp;
      const rect = el.getBoundingClientRect();
      const { dashboardDimensions } = this.props;
      dashboardDimensions.width = getWidth(el);
      dashboardDimensions.height = getHeight(el);
      dashboardDimensions.offsetLeft = rect.left + document.body.scrollLeft;
    }
  }

  render() {
    const { browser } = this.props.store;
    /* eslint-disable no-unused-expressions */
    browser.width;
    browser.height;
    /* eslint-enable no-unused-expressions */
    return (
      <div
        className="dashboard"
        ref={comp => {
          this.setDimensions(comp);
        }}
      >
        <DashboardBackground />
        <DashboardForeground />
      </div>
    );
  }
}

export default flowRight(inject('store'), observer)(Dashboard);
