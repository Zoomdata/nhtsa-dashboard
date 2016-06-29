import styles from './MakeWrapper.css';

import React , { Component } from 'react';
import MakeHeader from '../MakeHeader/MakeHeader';
import MakeBarChart from '../MakeBarChart/MakeBarChart';
import { getWidth, getHeight } from '../../utilities';
import { observer } from 'mobx-react';

@observer export default class MakeWrapper extends Component {
    setDimensions(comp) {
        if (comp !== null) {
            const el = comp;
            const rect = el.getBoundingClientRect();
            const { makeWrapperDimensions } = this.context.store.layout;
            makeWrapperDimensions.width =  getWidth(el),
            makeWrapperDimensions.height = getHeight(el),
            makeWrapperDimensions.offsetTop = rect.top + document.body.scrollTop,
            makeWrapperDimensions.offsetLeft = rect.left + document.body.scrollLeft
        }
    }
    render() {
        const { browser } = this.context.store;
        browser.width;
        browser.height;
        /* eslint-disable no-unused-vars */
        const { hideOverlay } = this.context.store.controls;
        /* eslint-enable no-unused-vars */
        return (
            <div
                className={styles.root}
                ref={comp => {
                    this.setDimensions(comp)
                }}
            >
                <MakeHeader />
                <MakeBarChart />
            </div>
        )
    }
}

MakeWrapper.contextTypes = {
    store: React.PropTypes.object
};

