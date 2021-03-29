import { StrictMode } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './app';
import './index.css';
import store from './stores';

render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
  document.getElementById('root')
);
