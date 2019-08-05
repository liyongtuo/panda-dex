import React, { Component } from 'react';
import { Radio as AntRadio } from 'antd';

export default class Radio extends Component {
    render() {
        return (
            <AntRadio>
                {this.props.children}
            </AntRadio>
        );
    }
}

Radio.Group = AntRadio.Group