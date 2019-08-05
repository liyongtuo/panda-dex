import React, { Component } from 'react';

const _prefix = 'matrix-stick-title'

export default class StickTitle extends Component {
    render() {
        return (
            <div className={`${_prefix} flex-align-center ${this.props.className}`}>
                {/* <span className={`${_prefix}-stick ${this.props.color} mr-10`}></span> */}
                <span className={`${_prefix}-title color-primary-deep`}>
                    {this.props.title}
                </span>
            </div>
        );
    }
}