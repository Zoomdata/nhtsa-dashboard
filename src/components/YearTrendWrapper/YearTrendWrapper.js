import React from 'react';
import TrendHeader from '../TrendHeader/TrendHeader';
import Trend from '../Trend/Trend';
import AboutButton from '../AboutButton/AboutButton';

const YearTrendWrapper = () => {
  return (
    <div className="year-trend-wrapper">
      <TrendHeader />
      <Trend />
      <AboutButton />
    </div>
  );
};

export default YearTrendWrapper;
