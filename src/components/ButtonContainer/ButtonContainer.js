import styles from './ButtonContainer.css';

import React from 'react';
import Top from '../Top/Top';
import ShowData from '../ShowData/ShowData';
import ArrowBottom from '../ArrowBottom/ArrowBottom';
import Bottom from '../Bottom/Bottom';
import Cover from '../Cover/Cover';
import { observer } from 'mobx-react';
import { controller } from '../../zoomdata';

const ButtonContainer = observer(function(props, { store }) {
    const { arrowVisibility, hoodAction } = store.controls;
    const newTop = store.layout.dashboardDimensions.height - 67;
    const buttonContainerStyle = {
        top: newTop
    }
    return (
        <div
            className={styles.root}
            style={buttonContainerStyle}
            onClick={
                (e) => {
                    e.stopPropagation();
                    controller.set('gridReady', true);
                    if (hoodAction === 'CLOSE_HOOD') {
                        store.controls.hoodAction = 'OPEN_HOOD';
                        //gridDetails.offset = 0;
                        //gridDetails.hasNextDetails = true;
                    } else {
                        store.controls.hoodAction = 'CLOSE_HOOD'
                    }
                }
            }
        >
            <Top />
            <ShowData
                hoodAction={hoodAction}
                arrowVisibility={arrowVisibility}
            />
            <ArrowBottom
                hoodAction={hoodAction}
                arrowVisibility={arrowVisibility}
            />
            <Bottom />
            <Cover />
        </div>
    )
});

export default ButtonContainer;

ButtonContainer.contextTypes = {
    store: React.PropTypes.object
};
