import styles from './Label.css';

import React, { Component } from 'react';

export default class Label extends Component {
    render() {
        return <div className={styles.root}>
            <b>
                Reset<br />Filters
            </b>
        </div>
    }
}