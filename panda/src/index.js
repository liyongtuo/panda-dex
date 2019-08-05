import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './registerServiceWorker';

// import './styles/App.less';

import './App.module.styl';

import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './store/reducers';

import 'animate.css'

import Service from './service';

import { LocaleProvider } from "antd";
import zhCN from 'antd/lib/locale-provider/zh_CN';
// import enUS from 'antd/lib/locale-provider/en_US';
// import 'moment/locale/zh-cn';
// import 'moment/locale/en-us';

Storage.Service = Service

const store = createStore(rootReducer);

ReactDOM.render(
    <LocaleProvider locale={zhCN}>
        <Provider store={store}>
            <App />
        </Provider>
    </LocaleProvider>,
    document.getElementById('root')
);

serviceWorker.unregister();
