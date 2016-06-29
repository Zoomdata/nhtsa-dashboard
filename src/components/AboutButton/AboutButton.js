import styles from './AboutButton.css';

import React from 'react';
import { observer } from 'mobx-react';
import image from '../../images/about-button.png';

const AboutButton = observer((props, { store }) => {
    return (
        <img
            className={
                styles.root
            }
            width="119"
            height="28.5"
            src={image}
            onClick={
                (e) => {
                    e.stopPropagation();
                    store.controls.aboutVisibility = 'OPEN_ABOUT';
                }
            }
        />
    )
});

export default AboutButton;

AboutButton.contextTypes = {
    store: React.PropTypes.object
};