import React from 'react';
import { createRoot } from 'react-dom/client';
import './design/tokens.css';
import './design/reset.css';
import { AppRouter } from './app/Router';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <AppRouter />
    </React.StrictMode>
  );
}
