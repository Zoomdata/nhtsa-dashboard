import flowRight from 'lodash.flowright';
import React, { Component } from 'react';
import OverlaySplat from '../OverlaySplat/OverlaySplat';
import OverlayTitle from '../OverlayTitle/OverlayTitle';
import { VelocityComponent } from 'velocity-react';
import { observer, inject } from 'mobx-react';

class Overlay extends Component {
  render() {
    const {
      makeWrapperDimensions,
      overlaySplatDimensions,
    } = this.props.store.layout;
    const { aboutVisibility } = this.props.store.controls;
    const { hideOverlay } = this.props.store.controls;
    let animationProps;
    if (hideOverlay) {
      animationProps = {
        animation: {
          opacity: 0,
        },
        display: 'none',
      };
    } else {
      animationProps = {
        animation: {
          opacity: 1,
        },
        display: 'auto',
      };
    }

    if (hideOverlay) {
      if (aboutVisibility === 'OPEN_ABOUT') {
        animationProps = {
          animation: {
            opacity: 1,
          },
          display: 'inline',
        };
        this.overlayStyle = {
          backgroundImage: 'none',
          backgroundColor: 'rgba(0,0,0,0.8)',
        };
      } else {
        animationProps = {
          animation: {
            opacity: 0,
          },
          display: 'none',
        };
      }
    } else {
      this.overlayStyle = {};
    }

    return (
      <VelocityComponent {...animationProps}>
        <div className="overlay" style={this.overlayStyle}>
          <OverlaySplat
            makeWrapperDimensions={makeWrapperDimensions}
            overlaySplatDimensions={overlaySplatDimensions}
            aboutVisibility={aboutVisibility}
            hideOverlay={hideOverlay}
          />
          <OverlayTitle
            makeWrapperDimensions={makeWrapperDimensions}
            aboutVisibility={aboutVisibility}
            hideOverlay={hideOverlay}
          />
        </div>
      </VelocityComponent>
    );
  }
}

export default flowRight(inject('store'), observer)(Overlay);
