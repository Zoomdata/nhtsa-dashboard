import styles from './ArrowBottom.css';

import React from 'react';

const ArrowBottom = ({
    hoodAction,
    arrowVisibility
}) => {
    const arrowBottomStyles = {
        display: 'none'
    };

    return (
        <div
            className={
                hoodAction === 'OPEN_HOOD' ?
                styles.active :
                styles.normal
            }
            style={
                arrowVisibility === 'HIDE_ARROW' ?
                    arrowBottomStyles :
                    null
            }
        >
        </div>
    )
};

export default ArrowBottom;
