import flowRight from 'lodash.flowright';
import React, { Component } from 'react';
import MakeHeader from '../MakeHeader/MakeHeader';
import MakeBarChart from '../MakeBarChart/MakeBarChart';
import { getWidth, getHeight } from '../../utilities';
import { observer, inject } from 'mobx-react';

class MakeWrapper extends Component {
  setDimensions(comp) {
    if (comp !== null) {
      const el = comp;
      const rect = el.getBoundingClientRect();
      const { makeWrapperDimensions } = this.props.store.layout;
      makeWrapperDimensions.width = getWidth(el);
      makeWrapperDimensions.height = getHeight(el);
      makeWrapperDimensions.offsetTop = rect.top + document.body.scrollTop;
      makeWrapperDimensions.offsetLeft = rect.left + document.body.scrollLeft;
    }
  }
  render() {
    const { browser } = this.props.store;
    /* eslint-disable no-unused-expressions */
    browser.width;
    browser.height;
    /* eslint-enable no-unused-expressions */
    /* eslint-disable no-unused-vars */
    const { hideOverlay } = this.props.store.controls;
    /* eslint-enable no-unused-vars */
    return (
      <div
        className="make-wrapper"
        ref={comp => {
          this.setDimensions(comp);
        }}
      >
        <MakeHeader />
        <MakeBarChart />
      </div>
    );
  }
}

export default flowRight(inject('store'), observer)(MakeWrapper);
