import styles from './ModelHeader.css';

import React, { Component } from 'react';

export default class ModelHeader extends Component {
    render() {
        return <div className={styles.root}>
            Complaints<br />by <b>Model</b>
        </div>
    }
}