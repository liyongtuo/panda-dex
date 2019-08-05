import React, { Component } from 'react';

const _prefix = 'matrix-label'

export default class Label extends Component {
    render() {
        return (
            <span className={`${_prefix} ft-size-12`}>
                <span className={`${_prefix}-type`}>
                    {this.props.type}：
                </span>
                <span className={`${_prefix}-value`}>
                    {this.props.value}
                </span>
                <a className={`${_prefix}-close ft-size-17`}>
                    ×
                </a>
            </span>
        );
    }
}