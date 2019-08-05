import React, { Component } from 'react';
import { Checkbox as AntCheckbox } from 'antd';

const _prefix = 'matrix-checkbox'

export default class Checkbox extends Component {
    render() {
        return (
            <span className={`${_prefix} ${this.props.className}`}>
                <AntCheckbox {...this.props}></AntCheckbox>
            </span>
        );
    }
}