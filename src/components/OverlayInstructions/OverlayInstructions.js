import styles from './OverlayInstructions.css';

import React, { Component } from 'react';
import { VelocityComponent } from 'velocity-react';
import image from '../../images/pick_a_make.png';
import { observer } from 'mobx-react';

@observer class OverlayInstructions extends Component {
    render() {
        const { hideOverlay } = this.context.store.controls;
        let animationProps;
        if (hideOverlay) {
            animationProps = {
                animation: {
                    opacity: 0
                },
                display: 'none'
            }
        } else {
            animationProps = {
                animation: {
                    opacity: 1
                },
                display: 'auto'
            }
        }

        return (
            <VelocityComponent {...animationProps}>
                <img
                    src={image}
                    className={styles.root}
                    width="427"
                    height="177"
                >
                </img>
            </VelocityComponent>
        )
    }
}

export default OverlayInstructions;

OverlayInstructions.contextTypes = {
    store: React.PropTypes.object
};