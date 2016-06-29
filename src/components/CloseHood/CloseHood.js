import styles from './CloseHood.css';

import React from 'react';
import { observer } from 'mobx-react';
import image from '../../images/close-hood.png';

const CloseHood = observer(function(props, { store }) {
    return (
        <img
            className={styles.root}
            width="189"
            height="52"
            src={image}
            onClick={
                () => {
                    store.controls.hoodAction = 'CLOSE_HOOD';
                }
            }
        >

        </img>
    )
});

export default CloseHood;

CloseHood.contextTypes = {
    store: React.PropTypes.object
};