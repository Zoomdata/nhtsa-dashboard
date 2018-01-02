import flowRight from 'lodash.flowright';
import React from 'react';
import { observer, inject } from 'mobx-react';
import image from '../../images/close-hood.png';

const CloseHood = function({ store }) {
  return (
    <img
      alt=""
      className="close-hood"
      width="189"
      height="52"
      src={image}
      onClick={() => {
        store.controls.hoodAction = 'CLOSE_HOOD';
      }}
    />
  );
};

export default flowRight(inject('store'), observer)(CloseHood);
