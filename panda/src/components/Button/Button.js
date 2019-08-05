import React, { Component } from 'react';

const _prefix = 'matrix-btn'

export default class Button extends Component {

    render() {

        let type = 'primary'
        if (this.props.disabled) {
            type = 'disable'
        } else if(this.props.ghost) {
            type = 'ghost'
        } else {
            if (this.props.loading) {
                type = 'loading'
            }
        }

        let text = ''
        if (this.props.children) {
            text = this.props.children
        }
        if (this.props.loading) {
            if (this.props.loadingText) {
                text = this.props.loadingText
            }
        }

        const style = {
            width: '4rem',
            maxWidth: '100%',
            ...this.props.style
        }
        if (this.props.width) {
            style.width = this.props.width
        }

        const loading = (
            <svg className={`${_prefix}-svg-loading`}>
                <g transform="translate(5 10)">
                    <circle cx="0" cy="0" r="2.5" fill="#fff" transform="scale(0.544934 0.544934)">
                        <animateTransform attributeName="transform" type="scale" begin="-0.26666666666666666s" calcMode="spline" keySplines="0.3 0 0.7 1;0.3 0 0.7 1" values="0;1;0" keyTimes="0;0.5;1" dur="0.8s" repeatCount="indefinite"></animateTransform>
                    </circle>
                </g>
                <g transform="translate(15 10)">
                    <circle cx="0" cy="0" r="2.5" fill="#ffffff" transform="scale(0.998004 0.998004)">
                        <animateTransform attributeName="transform" type="scale" begin="-0.13333333333333333s" calcMode="spline" keySplines="0.3 0 0.7 1;0.3 0 0.7 1" values="0;1;0" keyTimes="0;0.5;1" dur="0.8s" repeatCount="indefinite"></animateTransform>
                    </circle>
                </g>
                <g transform="translate(25 10)">
                    <circle cx="0" cy="0" r="2.5" fill="#ffffff" transform="scale(0.987271 0.987271)">
                        <animateTransform attributeName="transform" type="scale" begin="0s" calcMode="spline" keySplines="0.3 0 0.7 1;0.3 0 0.7 1" values="0;1;0" keyTimes="0;0.5;1" dur="0.8s" repeatCount="indefinite"></animateTransform>
                    </circle>
                </g>
            </svg>
        )
        return (
            <button
                className={`${_prefix} ${_prefix}-${type} ${this.props.color} ${this.props.className}`}
                style={style}
                disabled={this.props.disabled}
                onClick={() => {
                    if (this.props.disabled) return
                    if (this.props.loading) return
                    if (this.props.onClick)
                        this.props.onClick()
                }}
            >
                {text}{this.props.loading && !this.props.disabled ? loading : null}
            </button>
        );
    }
}