import React, { Component } from 'react';
import { DatePicker as AntDatePicker } from 'antd';

const _prefix = 'matrix-modal-datepicker'

export default class DatePicker extends Component {

    constructor(props) {
        super(props);
        this.state = {
            shake: false,
            focus: false,
        }
    }

    shake() {
        this.setState({ shake: true })
        setTimeout(() => {
            this.setState({
                shake: false
            })
        }, 500);
    }

    render() {
        const style = {}
        const labelStyle = {}

        const width = this.props.width ? this.props.width : ''
        const labelWidth = this.props.labelWidth ? this.props.labelWidth : ''

        if (this.props.width) {
            style.width = width
            style.minWidth = width
        }

        if (this.props.labelWidth) {
            labelStyle.width = labelWidth
            labelStyle.minWidth = labelWidth
        }

        const label = (
            <label className={`${_prefix}-label`} style={labelStyle}>
                {this.props.label}
            </label>
        )

        const errMsgWithLabel = (
            <div className={`${_prefix}-err ${this.state.shake ? 'animated shake' : ''}`}>
                <p style={labelStyle}></p>
                <p>
                    {this.props.errMsg}
                </p>
            </div>
        )

        const errMsg = (
            <div className={`${_prefix}-err ${this.state.shake ? 'animated shake' : ''}`}>
                <p>
                    {this.props.errMsg}
                </p>
            </div>
        )

        if (this.props.labelPlacement !== 'top') {
            return (
                <div className={`${_prefix} flex-align-center`}>
                    {this.props.label ? label : null}
                    <AntDatePicker
                        className={`${this.props.className} ${_prefix}`}
                        style={style}
                        {...this.props} />
                    <div className={`${_prefix}-bottom`}>
                        {this.props.labelPlacement === 'top' ? errMsg : errMsgWithLabel}
                    </div>
                </div>
            )
        } else {
            return (
                <div className={`${_prefix} flex-column`}>
                    {this.props.label ? label : null}
                    <AntDatePicker
                        className={`${this.props.className} ${_prefix}`}
                        style={style}
                        {...this.props} />
                    <div className={`${_prefix}-bottom`}>
                        {this.props.labelPlacement === 'top' ? errMsg : errMsgWithLabel}
                    </div>
                </div>
            );
        }
    }
}