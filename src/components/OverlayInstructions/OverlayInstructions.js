import flowRight from 'lodash.flowright';
import React, { Component } from 'react';
import { VelocityComponent } from 'velocity-react';
import image from '../../images/pick_a_make.png';
import { observer, inject } from 'mobx-react';

class OverlayInstructions extends Component {
  render() {
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

    return (
      <VelocityComponent {...animationProps}>
        <img
          alt=""
          src={image}
          className="overlay-instructions"
          width="427"
          height="177"
        />
      </VelocityComponent>
    );
  }
}

export default flowRight(inject('store'), observer)(OverlayInstructions);
