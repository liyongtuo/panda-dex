import React, { Component } from 'react';

const _prefix = 'matrix-input'

export default class Input extends Component {

    constructor(props) {
        super(props)
        this.state = {
            focus: false,
            shake: false
        }
        this.oldValue = ''
    }

    componentDidMount = () => {
        this.lv.value = this.props.value
    }

    onChange(value) {
        if (this.props.onChange) {
            this.props.onChange(value)
        }
    }

    onBlur() {
        if (this.lv.value === '') {
            this.setState({ focus: false })
        }
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

        const primary = this.props.primary ? `${_prefix}-primary` : ''

        const style = {}
        const labelStyle = {}

        const width = this.props.width ? this.props.width : '400px'

        if (this.props.width) {
            style.width = width
            style.minWidth = width
        }

        const label = (
            <span className={`${_prefix}-label`}>
                {this.props.label}
            </span>
        )

        const errMsg = (
            <div className={`${_prefix}-err ${this.state.shake ? 'animated shake' : ''}`}>
                <p style={labelStyle}></p>
                <p>
                    {typeof this.props.errMsg === 'function' ? this.props.errMsg() : this.props.errMsg}
                </p>
            </div>
        )

        return (
            <div className={`${primary}`}>
                <div
                    className={`${_prefix} ${this.state.focus || this.props.value ? `${_prefix}-focus` : ''}`}
                    style={style}
                    onClick={(e) => {
                        if (e.target.className === _prefix) {
                            this.lv.focus()
                        }
                    }}>
                    <div className={`${_prefix}-label`}>
                        {this.props.label ? label : null}
                    </div>
                    <div className={`${_prefix}-top`}>
                        {this.props.prepend ? <div className={`${_prefix}-prepend`}>{this.props.prepend}</div> : null}
                        <input
                            value={this.props.value}
                            ref={el => this.lv = el}
                            placeholder={this.props.placeholder}
                            onFocus={() => { this.onFocus() }}
                            onBlur={() => { this.onBlur() }}
                            onChange={(event) => { this.onChange(event.target.value) }}
                            maxLength={this.props.maxLength}
                            autoComplete={this.props.autoComplete}
                            type={this.props.type}
                            onKeyUp={event => {
                                if (event.keyCode === 13) {
                                    if (this.props.onEnter) {
                                        this.props.onEnter()
                                    }
                                }
                            }}
                        />
                        {this.props.disabled ? <div className={`${_prefix}-disabled`}></div> : null}
                        {this.props.append ? <div className={`${_prefix}-append`}>{this.props.append}</div> : null}
                        {/* <div className={`${_prefix}-bottom-line`}></div> */}
                    </div>
                    <div className={`${_prefix}-bottom`}>
                        {this.props.errMsg ? errMsg : null}
                    </div>
                    {/* {this.props.tip ?
                        <div className={`${_prefix}-tip`}>
                            {this.props.tip}
                        </div> : null} */}
                </div>
            </div>
        );
    }
}