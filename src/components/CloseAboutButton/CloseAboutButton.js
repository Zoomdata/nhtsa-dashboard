import flowRight from 'lodash.flowright';
import React from 'react';
import { observer, inject } from 'mobx-react';

const CloseAboutButton = ({ store }) => {
  return (
    <div
      className="close-about-button"
      onClick={e => {
        e.stopPropagation();
        store.controls.aboutVisibility = 'CLOSE_ABOUT';
      }}
    >
      Return
    </div>
  );
};

export default flowRight(inject('store'), observer)(CloseAboutButton);
