import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import './chess.css';
import './coordinates.css';

ReactDOM.render(
  <React.StrictMode>
    <App verbose />
  </React.StrictMode>,
  document.getElementById('root')
);
