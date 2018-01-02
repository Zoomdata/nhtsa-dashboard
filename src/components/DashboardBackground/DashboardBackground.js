import React from 'react';
import H2Header from '../H2Header/H2Header';
import GridContainer from '../GridContainer/GridContainer';
import CloseHood from '../CloseHood/CloseHood';

const DashboardBackground = () => {
  return (
    <div className="dashboard-background">
      <H2Header />
      <GridContainer />
      <CloseHood />
    </div>
  );
};

export default DashboardBackground;
