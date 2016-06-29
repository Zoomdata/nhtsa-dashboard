import styles from './MakeHeader.css';

import React from 'react';
import { observer } from 'mobx-react';

function MakeHeader(props, { store }) {
    const makeHeaderStyle = {
        zIndex: 1
    };
    const { hideOverlay } = store.controls;
    return (
        <div
            className={styles.root}
            style={
                hideOverlay ? makeHeaderStyle : null
            }
        >
            Complaints <br /> by <b>Make</b>
        </div>
    )
}

MakeHeader.contextTypes = {
    store: React.PropTypes.object
};

export default observer(MakeHeader);

