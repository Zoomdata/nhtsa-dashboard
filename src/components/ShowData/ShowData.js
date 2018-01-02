import React from 'react';
import image from '../../images/show-data.png';

const ShowData = ({ arrowVisibility }) => {
  const showDataStyles = {
    display: 'none',
  };

  return (
    <img
      alt=""
      className="show-data"
      style={arrowVisibility === 'HIDE_ARROW' ? showDataStyles : null}
      width="104"
      height="77"
      src={image}
    />
  );
};

export default ShowData;
