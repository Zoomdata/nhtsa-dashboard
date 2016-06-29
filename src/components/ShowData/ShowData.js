import styles from './ShowData.css';

import React from 'react';
import image from '../../images/show-data.png';

const ShowData = ({
    hoodAction,
    arrowVisibility
}) => {
    const showDataStyles = {
        display: 'none'
    };

    return (
        <img
            className={
                hoodAction === 'OPEN_HOOD' ?
                styles.active :
                styles.normal
            }
            style={
                arrowVisibility === 'HIDE_ARROW' ?
                    showDataStyles :
                    null
            }
            width="104"
            height="77"
            src={image} />
    )
};

export default ShowData;