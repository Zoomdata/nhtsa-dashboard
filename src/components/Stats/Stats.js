import styles from './Stats.css';

import React, { Component } from 'react';
import Reset from '../Reset/Reset';
import LED from '../LED/LED';
import Filler from '../Filler/Filler';

export default class Stats extends  Component {
    render() {
        return <div className={styles.root}>
            <Reset />
            <LED position="5"/>
            <Filler text="of" />
            <LED position="6"/>
            <Filler text="Complaints" />
        </div>
    }
}