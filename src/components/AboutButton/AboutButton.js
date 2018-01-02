import flowRight from 'lodash.flowright';
import React from 'react';
import { observer, inject } from 'mobx-react';
import image from '../../images/about-button.png';

const AboutButton = ({ store }) => {
  return (
    <img
      alt=""
      className="about-button"
      width="119"
      height="28.5"
      src={image}
      onClick={e => {
        e.stopPropagation();
        store.controls.aboutVisibility = 'OPEN_ABOUT';
      }}
    />
  );
};

export default flowRight(inject('store'), observer)(AboutButton);
