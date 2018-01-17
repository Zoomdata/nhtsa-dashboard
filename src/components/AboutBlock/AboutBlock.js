import flowRight from 'lodash.flowright';
import React from 'react';
import AboutHeader from '../AboutHeader/AboutHeader';
import AboutDescription from '../AboutDescription/AboutDescription';
import ZDWebsiteButton from '../ZDWebsiteButton/ZDWebsiteButton';
import CloseAboutButton from '../CloseAboutButton/CloseAboutButton';
import { VelocityComponent } from 'velocity-react';
import { observer, inject } from 'mobx-react';

const AboutBlock = ({ store }) => {
  let animationProps;
  const { aboutVisibility } = store.controls;
  if (aboutVisibility === 'CLOSE_ABOUT') {
    animationProps = {
      animation: {
        opacity: 0,
      },
      display: 'none',
    };
  } else {
    animationProps = {
      animation: {
        opacity: 1,
      },
      display: 'block',
    };
  }
  return (
    <VelocityComponent {...animationProps}>
      <div className="about-block">
        <AboutHeader />
        <AboutDescription />
        <a target="_blank" rel="noopener noreferrer" href="http://zoomdata.com">
          <ZDWebsiteButton />
        </a>
        <CloseAboutButton />
      </div>
    </VelocityComponent>
  );
};

export default flowRight(inject('store'), observer)(AboutBlock);
