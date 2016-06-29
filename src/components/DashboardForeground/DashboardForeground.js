import styles from './DashboardForeground.css';

import React from 'react';
import AboutBlock from '../AboutBlock/AboutBlock';
import BackgroundImage from '../BackgroundImage/BackgroundImage';
import YearTrendWrapper from '../YearTrendWrapper/YearTrendWrapper';
import MakeWrapper from '../MakeWrapper/MakeWrapper';
import OverlayInstructions from '../OverlayInstructions/OverlayInstructions';
import Connector from '../Connector/Connector';
import Header from '../Header/Header';
import ModelWrapper from '../ModelWrapper/ModelWrapper';
import Gauges from '../Gauges/Gauges';
import Tabs from '../Tabs/Tabs';
import Annotation from '../Annotation/Annotation';
import { VelocityComponent } from 'velocity-react';
import { observer } from 'mobx-react';

const DashboardForeground = observer((props, { store }) => {
    let animationProps;
    const liftDuration = 2000;
    let { hoodAction } = store.controls;
    if (hoodAction === 'CLOSE_HOOD') {
        animationProps = {
            duration: liftDuration,
            animation: {
                rotateX: 0
            },
            complete: function() {
                store.controls.arrowVisibility = 'SHOW_ARROW';
            }
        }
    } else {
        animationProps = {
            easing: 'easeOutBack',
            duration: liftDuration,
            animation: {
                rotateX: 90
            },
            complete: function() {
                store.controls.arrowVisibility = 'HIDE_ARROW';
            }
        }
    }
    return (
        <VelocityComponent {...animationProps}>
            <div
                className={styles.root}>
                <AboutBlock />
                <BackgroundImage />
                <YearTrendWrapper />
                <MakeWrapper />
                <OverlayInstructions />
                <Connector />
                <Header />
                <ModelWrapper />
                <Gauges />
                <Tabs />
                <Annotation />
            </div>
        </VelocityComponent>
    )
})

export default DashboardForeground;

DashboardForeground.contextTypes = {
    store: React.PropTypes.object
};