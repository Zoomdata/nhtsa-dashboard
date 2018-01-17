import flowRight from 'lodash.flowright';
import React from 'react';
import { observer, inject } from 'mobx-react';

function MakeHeader({ store }) {
  const makeHeaderStyle = {
    zIndex: 1,
  };
  const { hideOverlay } = store.controls;
  return (
    <div className="make-header" style={hideOverlay ? makeHeaderStyle : null}>
      Complaints <br /> by <b>Make</b>
    </div>
  );
}

export default flowRight(inject('store'), observer)(MakeHeader);
