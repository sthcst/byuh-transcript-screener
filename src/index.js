import './polyfills';
import React from 'react';
import ReactDOM from 'react-dom/client';
import TranscriptScreener from './TranscriptScreener_Beautiful';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TranscriptScreener />
  </React.StrictMode>
);