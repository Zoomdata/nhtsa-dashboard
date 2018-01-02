import React, { Component } from 'react';
import OverlayDescription from '../OverlayDescription/OverlayDescription';
import { observer } from 'mobx-react';

class OverlayTitle extends Component {
  render() {
    const { makeWrapperDimensions, aboutVisibility, hideOverlay } = this.props;
    const overlayTitleStyle = {
      top: makeWrapperDimensions.offsetTop,
      left: makeWrapperDimensions.offsetLeft + makeWrapperDimensions.width + 75,
    };

    if (hideOverlay) {
      if (aboutVisibility === 'OPEN_ABOUT') {
        this.overlayTitleStyle = {
          top: makeWrapperDimensions.offsetTop,
          left:
            makeWrapperDimensions.offsetLeft + makeWrapperDimensions.width + 75,
          display: 'none',
        };
      }
    } else {
      this.overlayTitleStyle = {
        top: makeWrapperDimensions.offsetTop,
        left:
          makeWrapperDimensions.offsetLeft + makeWrapperDimensions.width + 75,
        display: 'block',
      };
    }

    return (
      <div
        className="overlay-title"
        style={
          this.overlayTitleStyle ? this.overlayTitleStyle : overlayTitleStyle
        }
      >
        VEHICLE
        <br />
        COMPLAINTS
        <OverlayDescription hideOverlay={hideOverlay} />
      </div>
    );
  }
}

export default observer(OverlayTitle);
