import React, { Component } from 'react';
import { HashRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

import { hot } from 'react-hot-loader';

import intl from 'react-intl-universal';
import zh from './locales/zh-CN/index';

import asyncComponent from './Bundle';

const Spot = asyncComponent(() => import('./pages/Spot/Spot'));

const locales = {
    "zh-CN": zh,
};

const RedirectComponent = () => (
    <Redirect to="/spot" />
);

const mobile = window.innerWidth <= 900

if (!localStorage.getItem('lang')) {
    localStorage.setItem('lang', 'zh-CN')
}


@hot(module)
export default class App extends Component {

    state = {
        initDone: false,
        mobile: mobile,
        guide: true,
    };

    componentDidMount() {
        this.loadLocales();
        window.onresize = () => {
            this.setState({
                mobile: window.innerWidth <= 900
            })
            window.onWindowResize && window.onWindowResize(window.innerWidth)
        }
        if (false) {
            window.console = {
                info: () => {
                },
                log: () => {
                },
                warn: () => {
                },
                debug: () => {
                },
                error: () => {
                }
            };
        }
    }

    loadLocales() {
        // init method will load CLDR locale data according to currentLocale
        // react-intl-universal is singleton, so you should init it only once in your app
        intl
            .init({
                currentLocale: locales[localStorage.getItem("lang")] ? localStorage.getItem("lang") : 'zh-CN',
                locales: locales
            })
            .then(() => {
                // After loading CLDR locale data, start to render
                this.setState({ initDone: true });
            });
    }

    render() {

        return (
            <Router>
                <section className="main">
                    <div className="content">
                        <Switch>
                            <Route path="/spot" component={Spot} />
                            <Route path="*" component={RedirectComponent} />
                        </Switch>
                    </div>
                </section>
            </Router>
        );
    }
}
