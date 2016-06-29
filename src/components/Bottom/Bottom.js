import styles from './Bottom.css';

import React from 'react';
import image from '../../images/slot-bottom.png'

const Bottom = () => {
    return (
        <img
            className={styles.root}
            width="120" height="3.5"
            src={image}
        />
    )
};

export default Bottom;