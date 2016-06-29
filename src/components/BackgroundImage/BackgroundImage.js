import styles from './BackgroundImage.css';

import React, { Component } from 'react';
import image from '../../images/car_background@2x.jpg';

export default class BackgroundImage extends Component {
    render() {
        return <img src={image} className={styles.root}></img>
    }
}