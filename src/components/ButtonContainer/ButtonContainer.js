import flowRight from 'lodash.flowright';
import React from 'react';
import Top from '../Top/Top';
import ShowData from '../ShowData/ShowData';
import ArrowBottom from '../ArrowBottom/ArrowBottom';
import Bottom from '../Bottom/Bottom';
import Cover from '../Cover/Cover';
import { observer, inject } from 'mobx-react';

const ButtonContainer = function({ store }) {
  const { arrowVisibility, hoodAction } = store.controls;
  const newTop = store.layout.dashboardDimensions.height - 67;
  const buttonContainerStyle = {
    top: newTop,
  };
  return (
    <div
      className={
        hoodAction === 'OPEN_HOOD'
          ? 'button-container active'
          : 'button-container'
      }
      style={buttonContainerStyle}
      onClick={e => {
        e.stopPropagation();
        store.chartStatus.set('gridReady', true);
        if (hoodAction === 'CLOSE_HOOD') {
          store.controls.hoodAction = 'OPEN_HOOD';
        } else {
          store.controls.hoodAction = 'CLOSE_HOOD';
        }
      }}
    >
      <Top />
      <ShowData hoodAction={hoodAction} arrowVisibility={arrowVisibility} />
      <ArrowBottom hoodAction={hoodAction} arrowVisibility={arrowVisibility} />
      <Bottom />
      <Cover />
    </div>
  );
};

export default flowRight(inject('store'), observer)(ButtonContainer);
