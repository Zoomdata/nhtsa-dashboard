National Highway Transportation Safety Administration (NHTSA) Dashboard
===============

A dashboard using the [Zoomdata Javascript SDK](https://www.npmjs.com/package/zoomdata-client) for analyzing NHTSA public data found [here](http://www-odi.nhtsa.dot.gov/downloads/). Information about the Zoomdata Javascript SDK can be found [here](http://www.zoomdata.com/developers/).

This dashboard was developed using ReactJS components that can be found in `src/components`. Each component contains its own folder with a .js and .css files. The .css files follow the [CSS Modules](https://github.com/css-modules/css-modules) pattern. 

## Getting Started
1. Clone the repo.
2. `$ npm install`
3. `$ PORT=3000 npm start`
4. `$ Open a browser and hit http://localhost:3000` 

## To build the Production version
1. `$ npm run-script build`
2. The build directory will be created with all the necessary resources
