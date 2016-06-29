import styles from './Top.css';

import React from 'react';
import image from '../../images/slot-top.png';

const Top = () => {
    return (
        <img
            className={styles.root}
            width="120" height="3"
            src={image} />
    )
};

export default Top;