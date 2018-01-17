import React from 'react';

const ArrowBottom = ({ arrowVisibility }) => {
  const arrowBottomStyles = {
    display: 'none',
  };

  return (
    <div
      className="arrow-bottom"
      style={arrowVisibility === 'HIDE_ARROW' ? arrowBottomStyles : null}
    />
  );
};

export default ArrowBottom;
