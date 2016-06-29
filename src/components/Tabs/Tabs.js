import styles from './Tabs.css';

import React from 'react';
import TabLinks from '../TabLinks/TabLinks';
import TabContent from '../TabContent/TabContent';

const Tabs = () => {
    return (
        <div className={styles.root}>
            <TabLinks />
            <TabContent />
        </div>
    )
}

export default Tabs;