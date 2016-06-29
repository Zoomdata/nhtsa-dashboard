import styles from './TabLinks.css';

import React from 'react';
import Active from '../../components/Active/Active';

const TabLinks = () => {
    return (
        <ul className={styles.root}>
            <Active chart="scatterplot" />
            <Active chart="map" />
        </ul>
    )
}

export default TabLinks;