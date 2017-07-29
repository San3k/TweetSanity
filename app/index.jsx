import React from 'react';
import { whyDidYouUpdate } from 'why-did-you-update';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import 'semantic-ui-css/semantic.min.css';
import './styles/main.scss';
import App from './App';

const app = document.getElementById('root');

const renderer = (Root) => {
  render(<AppContainer><Root /></AppContainer>, app);
};

renderer(App);

if (module.hot) {
  module.hot.accept('./App', () => renderer(App));
}

// if (process.env.NODE_ENV !== 'production') {
//   whyDidYouUpdate(React);
// }
