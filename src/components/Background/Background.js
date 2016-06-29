import styles from './Background.css';

import React from 'react';

const Background = ({data}) => {
    return (
        <div
            className={styles.root}
        >
            {data}
        </div>
    )
};

export default Background;