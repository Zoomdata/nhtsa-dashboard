import styles from './TabContent.css';

import React from 'react';
import Tab from '../../components/Tab/Tab';

const TabContent = () => {
    return (
        <div className={styles.root}>
            <Tab chart="scatterplot" />
            <Tab chart="map" />
        </div>
    )
};

export default TabContent;