import styles from './Title.css';

import React, { Component } from 'react';

export default class Title extends Component {
    render() {
        return <div className={styles.root} style={{position: 'relative'}}>Vehicle Complaints</div>
    }
}