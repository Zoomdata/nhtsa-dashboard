import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import store from './stores/UiState';
import { Provider } from 'mobx-react';
import 'normalize.css/normalize.css';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
registerServiceWorker();
