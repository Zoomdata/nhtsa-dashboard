import styles from './ModelWrapper.css';

import React, { Component } from 'react';
import ModelHeader from '../ModelHeader/ModelHeader';
import ModelBarChart from '../ModelBarChart/ModelBarChart';

export default class ModelWrapper extends Component {
    render() {
        return <div className={styles.root}>
            <ModelHeader />
            <ModelBarChart />
        </div>
    }
}