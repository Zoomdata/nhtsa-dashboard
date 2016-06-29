import styles from './Tab.css';
import { observer } from 'mobx-react';
import React from 'react';
import ComponentScatterplot from '../ComponentScatterplot/ComponentScatterplot';
import Map from '../Map/Map';

const Tab = observer(function(props, { store }) {
    const { activeTab } = store.controls;
    const { chart } = props;
    const tab = activeTab.split('_')[1].toLowerCase();
    return (
        <div
            className={
                tab === chart ?
                styles.active :
                styles.normal
            }>{chart === 'scatterplot' ? <ComponentScatterplot /> : <Map />}
        </div>
    )
});

export default Tab;

Tab.contextTypes = {
    store: React.PropTypes.object
};