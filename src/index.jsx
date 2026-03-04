// Core Libs
import React from 'react';
import { createRoot } from 'react-dom/client';

// Main Component
import { App } from './app.jsx';

// DOM Render
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
