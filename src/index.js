/* eslint-disable no-unused-vars */
import normalize from 'normalize.css';
/* eslint-enable no-unused-vars */
import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import NhtsaApp from './components/NhtsaApp/NhtsaApp';
import Provider from './stores/Provider';
import store from './stores/UiState';

const root = document.getElementById('root');

render(
    <Provider store={store}>
        <NhtsaApp />
    </Provider>,
    root
);


