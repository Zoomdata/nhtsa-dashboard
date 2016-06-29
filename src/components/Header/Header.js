import styles from './Header.css';

import React, { Component } from 'react';
import Title from '../Title/Title';
import Stats from '../Stats/Stats';

export default class Header extends Component {
    render() {
        return <div className={styles.root}>
            <Title />
            <Stats />
        </div>
    }
}