import React, { Component } from 'react';
import { Menu as AntMenu } from 'antd';

const _prefix = 'matrix-menu'

export default class Menu extends Component {
    render() {
        return (
            <div className={`${_prefix}`}>
                <AntMenu
                    {...this.props}
                >
                    {this.props.children}
                </AntMenu>
            </div>
        );
    }
}