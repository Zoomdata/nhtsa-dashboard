import styles from './Foreground.css';

import React from 'react';

const Foreground = ({data}) => {
    return (
        <div
            className={styles.root}
        >
            {data}
        </div>
    )
};

export default Foreground;