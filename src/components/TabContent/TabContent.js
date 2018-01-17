import React from 'react';
import Tab from '../../components/Tab/Tab';

const TabContent = () => {
  return (
    <div className="tab-content">
      <Tab chart="scatterplot" />
      <Tab chart="map" />
    </div>
  );
};

export default TabContent;
