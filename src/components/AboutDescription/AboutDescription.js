import styles from './AboutDescription.css';

import React, { Component } from 'react';

export default class AboutDescription extends Component {
    render() {
        return <div className={styles.root}>
            This demo creates a live visualization of over 250,000 vehicle complaints compiled by the National Highway Traffic Safety Administration (NHTSA) from 1995 to 2014. It is built with the Zoomdata API, which allows companies to tap the big data processing capability of Zoomdata, with whatever application they like.
        </div>
    }
}