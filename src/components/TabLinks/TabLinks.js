import React from 'react';
import Active from '../../components/Active/Active';

const TabLinks = () => {
  return (
    <ul className="tab-links">
      <Active chart="scatterplot" />
      <Active chart="map" />
    </ul>
  );
};

export default TabLinks;
