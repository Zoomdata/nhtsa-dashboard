import styles from './CloseAboutButton.css';

import React  from 'react';
import { observer } from 'mobx-react';

const CloseAboutButton = observer((props, { store }) => {
    return (
        <div
            className={
                styles.root
            }
            onClick={
                (e) => {
                    e.stopPropagation();
                    store.controls.aboutVisibility = 'CLOSE_ABOUT';
                }
            }
        >Return
        </div>
    )
});

export default CloseAboutButton;

CloseAboutButton.contextTypes = {
    store: React.PropTypes.object
};
