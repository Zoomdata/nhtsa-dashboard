import styles from './Dashboard.css';

import React, { Component } from 'react';
import DashboardBackground from '../DashboardBackground/DashboardBackground';
import DashboardForeground from '../DashboardForeground/DashboardForeground';
import { getWidth, getHeight } from '../../utilities';
import { observer } from 'mobx-react';

@observer export default class Dashboard extends Component {
    setDimensions(comp) {
        if (comp !== null) {
            const el = comp;
            const rect = el.getBoundingClientRect();
            const { dashboardDimensions } = this.props;
            dashboardDimensions.width = getWidth(el),
            dashboardDimensions.height = getHeight(el),
            dashboardDimensions.offsetLeft =  rect.left + document.body.scrollLeft
        }
    }

    render() {
        const { browser } = this.context.store;
        browser.width;
        browser.height;
        return (
            <div
                className={styles.root}
                ref={comp => {
                    this.setDimensions(comp)
                }}
            >
                <DashboardBackground />
                <DashboardForeground />
            </div>
        )
    }
}

Dashboard.contextTypes = {
    store: React.PropTypes.object
};