import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './style.css';
import App from './App';
import SiteRouter from './router/SiteRouter'
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<SiteRouter />, document.getElementById('root'));
registerServiceWorker();
