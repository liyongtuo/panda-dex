import React, { Component } from 'react';

const _prefix = 'matrix-modal-input'

export default class Input extends Component {

    constructor(props) {
        super(props)
        this.state = {
            focus: false,
            shake: false
        }
        this.oldValue = ''
    }

    onChange(value) {
        if (this.props.onChange) {
            this.props.onChange(value)
        }
    }

    onBlur() {
        this.setState({ focus: false })
        if (this.props.onBlur) {
            this.props.onBlur(this.lv.value)
        }
    }

    onFocus() {
        this.setState({ focus: true })
        if (this.props.onFocus) {
            this.props.onFocus(this.lv.value)
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

        const disabled = this.props.disabled

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

        const renderTop = () => {
            if (this.props.labelPlacement !== 'top') {
                return (
                    <div className={`${_prefix}-top ${this.state.focus ? `${_prefix}-top-focus` : ''} flex-align-center`}>
                        {this.props.label ? label : null}
                        <div className={`${_prefix}-container flex-align-center ${disabled ? 'disabled': ''}`}>
                            {this.props.prepend ? <div className={`${_prefix}-prepend`}>{this.props.prepend}</div> : null}
                            <input
                                value={this.props.value}
                                ref={el => this.lv = el}
                                placeholder={this.props.placeholder}
                                onFocus={() => { this.onFocus() }}
                                onBlur={() => { this.onBlur() }}
                                onChange={(event) => { this.onChange(event.target.value) }}
                                maxLength={this.props.maxLength || ''}
                                autoComplete={this.props.autoComplete}
                                type={this.props.type || ''}
                                disabled={this.props.disabled}
                                onKeyUp={event => {
                                    if (event.keyCode === 13) {
                                        if (this.props.onEnter) {
                                            this.props.onEnter()
                                        }
                                    }
                                }}
                            />
                            {this.props.append ? <div className={`${_prefix}-append`}>{this.props.append}</div> : null}
                        </div>
                    </div>
                )
            } else if (this.props.labelPlacement === 'top') {
                return (
                    <div className={`${_prefix}-top ${this.state.focus ? `${_prefix}-top-focus` : ''} flex-column`}>
                        {this.props.label ? label : null}
                        <div className={`${_prefix}-container ${disabled ? 'disabled': ''} flex-align-center mt-10 width-p-100`}>
                        {this.props.prepend ? <div className={`${_prefix}-prepend`}>{this.props.prepend}</div> : null}
                            <input
                                value={this.props.value}
                                ref={el => this.lv = el}
                                placeholder={this.props.placeholder}
                                onFocus={() => { this.onFocus() }}
                                onBlur={() => { this.onBlur() }}
                                onChange={(event) => { this.onChange(event.target.value) }}
                                autoComplete={this.props.autoComplete}
                                maxLength={this.props.maxLength || ''}
                                type={this.props.type || ''}
                                disabled={this.props.disabled}
                                onKeyUp={event => {
                                    if (event.keyCode === 13) {
                                        if (this.props.onEnter) {
                                            this.props.onEnter()
                                        }
                                    }
                                }}
                            />
                            {this.props.append ? <div className={`${_prefix}-append`}>{this.props.append}</div> : null}
                        </div>
                    </div>
                )
            }
        }

        return (
            <div
                className={`${_prefix}`}
                style={{ ...style, ...this.props.style }}
                onClick={(e) => {
                    if (e.target.className === _prefix) {
                        this.lv.focus()
                    }
                }}>
                {renderTop()}
                <div className={`${_prefix}-bottom`}>
                    {this.props.labelPlacement === 'top' ? errMsg : errMsgWithLabel}
                </div>
            </div>
        );
    }
}