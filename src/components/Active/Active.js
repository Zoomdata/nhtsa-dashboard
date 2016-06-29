import styles from './Active.css';

import React from 'react';
import { observer } from 'mobx-react';
import { controller } from '../../zoomdata';

const Active = observer(function(props, { store }) {
    const { activeTab } = store.controls;
    const { chart } = props;
    const tab = activeTab.split('_')[1].toLowerCase();
    return (
        <li
            className={
                tab === chart ?
                styles.root :
                null
            }
            onClick={
                () => {
                    const selectedTab = 'SHOW_' + chart.toUpperCase();
                    if (selectedTab === 'SHOW_MAP') {
                        controller.set('mapReady', true);
                    }
                    store.controls.activeTab = selectedTab;
                }
            }>
            <a href={'#' + chart + '-tab'}>
                {chart === 'scatterplot' ?
                    'Failed Components' :
                    'Map'
                }
            </a>
        </li>
    )
});

export default Active;

Active.contextTypes = {
    store: React.PropTypes.object
};