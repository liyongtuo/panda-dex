import React, { Component } from 'react';
import intl from 'react-intl-universal';

const intlPrefix = 'USER_SETTINGS_';

export default class CheckCode extends Component {

    constructor(props) {
        super(props)
        this.state = {
            count: 60,
        }
    }

    componentWillUnmount() {
        this.setState({
            count: 0
        })
    }

    stop() {
        if (this.state.count !== 60) {
            this.setState({
                count: 0
            })
        }
    }

    counting() {
        const count = this.state.count - 1
        this.setState({ count})
        if (this.state.count > 0) {
            setTimeout(() => {
                this.counting()
            }, 1000);
        } else {
            this.setState({ count: 60 })
        }
    }

    render() {

        const loading = (
            <svg className={`check-code-loading`}>
                <g transform="translate(4 10)">
                    <circle cx="0" cy="0" r="2" fill="#0ACEDF" transform="scale(0.544934 0.544934)">
                        <animateTransform attributeName="transform" type="scale" begin="-0.26666666666666666s" calcMode="spline" keySplines="0.3 0 0.7 1;0.3 0 0.7 1" values="0;1;0" keyTimes="0;0.5;1" dur="0.8s" repeatCount="indefinite"></animateTransform>
                    </circle>
                </g>
                <g transform="translate(12 10)">
                    <circle cx="0" cy="0" r="2" fill="#0ACEDF" transform="scale(0.998004 0.998004)">
                        <animateTransform attributeName="transform" type="scale" begin="-0.13333333333333333s" calcMode="spline" keySplines="0.3 0 0.7 1;0.3 0 0.7 1" values="0;1;0" keyTimes="0;0.5;1" dur="0.8s" repeatCount="indefinite"></animateTransform>
                    </circle>
                </g>
                <g transform="translate(20 10)">
                    <circle cx="0" cy="0" r="2" fill="#0ACEDF" transform="scale(0.987271 0.987271)">
                        <animateTransform attributeName="transform" type="scale" begin="0s" calcMode="spline" keySplines="0.3 0 0.7 1;0.3 0 0.7 1" values="0;1;0" keyTimes="0;0.5;1" dur="0.8s" repeatCount="indefinite"></animateTransform>
                    </circle>
                </g>
            </svg>
        )

        const text = this.props.text || intl.get(`${intlPrefix}GET_CHECK_CODE`)

        const getCode = (
            <a onClick={() => {
                if (!this.props.onClick) return
                if (this.props.loading) return
                this.props.onClick()
            }}>
                {text}{this.props.loading ? loading : null}
            </a>
        )

        const waiting = this.state.count + intl.get(`${intlPrefix}GET_CHECK_CODE_TIME`)

        return this.state.count === 60 ? getCode : waiting;
    }
}