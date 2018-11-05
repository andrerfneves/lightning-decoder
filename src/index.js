// Core Libs
import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';

// Main Component
import App from './app';

// Constants
import { GA_CODE } from './constants/ga';

// Analytics Hook
ReactGA.initialize(GA_CODE);
ReactGA.pageview(
  window.location.pathname + window.location.search
);

// DOM Render
ReactDOM.render(
  <App />,
  document.getElementById('root'),
);

