import styles from './OverlayDescription.css';

import React, { Component } from 'react';
import { VelocityComponent } from 'velocity-react';
import { observer } from 'mobx-react';

@observer export default class OverlayDescription extends Component {
    render() {
        const { hideOverlay } = this.props;
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
                <div
                    className={styles.root}
                >
                    WE used the Zoomdata API to create an app that
                    <br />
                    visualizes a <b>quarter-million</b> records in real time.
                </div>
            </VelocityComponent>
        )
    }
}