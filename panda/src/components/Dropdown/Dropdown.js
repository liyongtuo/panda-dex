import React, { Component } from 'react';
import { Dropdown as AntDropdown, Icon } from 'antd';

export default class Dropdown extends Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false,
        }
    }

    render() {

        const dropdownStyle = {
            fontSize: '.16rem',
            transition: 'all .5s',
            marginLeft: '.05rem',
            ...this.props.iconStyle
        }

        return (
            <AntDropdown
                onVisibleChange={v => {
                    this.setState({ open: v })
                }}
                visible={this.state.open}
                {...this.props}
            >
                <span>
                    {this.props.children}
                    {this.props.noIcon ? null :
                        <Icon
                            style={{
                                ...dropdownStyle,
                                transform: this.state.open ? 'rotate(-180deg)' : 'rotate(0)',
                            }}
                            type="caret-down"
                            theme="outlined"
                        />
                    }
                </span>
            </AntDropdown>
        );
    }
}