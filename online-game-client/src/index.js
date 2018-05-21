import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './style.css';
import App from './App';
import SiteRouter from './router/SiteRouter'
import {Provider} from 'react-redux'
import registerServiceWorker from './registerServiceWorker';
import store from "./store";

ReactDOM.render(
    <Provider store={store}>
        <SiteRouter/>
    </Provider>,
    document.getElementById('root')
);


registerServiceWorker();
