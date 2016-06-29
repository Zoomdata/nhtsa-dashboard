import styles from './NhtsaApp.css';

import React, { Component } from 'react';
import Overlay from '../../components/Overlay/Overlay';
import Dashboard from '../../components/Dashboard/Dashboard';
import ButtonContainer from '../../components/ButtonContainer/ButtonContainer';
import { verticalScrollThreshold } from '../../config/app-constants';
import { observer } from 'mobx-react';

@observer export default class NhtsaApp extends Component {
    render() {
        const { browser } = this.context.store;
        const { dashboardDimensions } = this.context.store.layout;
        let newBackgroundX = (dashboardDimensions.offsetLeft + dashboardDimensions.width) - 465;
        let newBackgroundY;
        let newOverflowY = 'hidden';
        if (window.innerHeight < verticalScrollThreshold) {
            newBackgroundY = verticalScrollThreshold - 323;
        } else {
            newBackgroundY = window.innerHeight - 323;
        }
        if (browser.height < verticalScrollThreshold) {
            newOverflowY = 'visible';
        }
        const nhtsaAppStyle = {
            backgroundPositionX: newBackgroundX,
            backgroundPositionY: newBackgroundY,
            overflowY: newOverflowY
        };
        return (
            <div
                className={styles.root}
                style={nhtsaAppStyle}
            >
                <Overlay />
                <Dashboard
                    dashboardDimensions={dashboardDimensions}
                    browser={browser}
                />
                <footer>
                 © 2016 <a href="http://www.zoomdata.com/">Zoomdata</a>, Inc. <a href="http://www.zoomdata.com/contact">Contact</a> <a href="http://www.zoomdata.com/terms">Legal</a>
                 </footer>
                <ButtonContainer />
            </div>
        )
    }
}

NhtsaApp.contextTypes = {
    store: React.PropTypes.object
};
