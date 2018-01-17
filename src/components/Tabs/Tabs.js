import React from 'react';
import TabLinks from '../TabLinks/TabLinks';
import TabContent from '../TabContent/TabContent';

const Tabs = () => {
  return (
    <div className="tabs">
      <TabLinks />
      <TabContent />
    </div>
  );
};

export default Tabs;
