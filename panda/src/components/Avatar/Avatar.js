import React, { Component } from 'react';
import RoundImage from '../RoundImage';

const _default_icon = require('../../images/index/default_icon.png')
export default class Avatar extends Component {

    render() {

        const _blue = '#AFC5F2'
        const _purple = '#C3ADC4'
        const _pink = '#EFCAD2'
        const _yellow = '#EFCAD2'
        const _orange = '#EEC2A9'
        const _green = '#A2BDB8'
        const _login = '#7591AA'

        const _colors = [_blue, _purple, _pink, _yellow, _orange, _green]

        const _color = this.props.nickName ? _colors[this.props.nickName.length % 6] : _colors[0]
        const _size = this.props.size || '1rem'
        const _font_size = this.props.fontSize || '.5rem'
        const loginStyle = {
            backgroundColor: '#2c3848',
            border: '1px solid ' + _login,
            color: _login,
        }
        const style = {
            backgroundColor: _color,
            width: _size,
            height: _size,
            minWidth: _size,
            minHeight: _size,
            borderRadius: this.props.rect ? '4px' : '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: _font_size,
            color: '#fff',
            ...loginStyle,
            ...this.props.style
        }

        return this.props.image ?
            <RoundImage {...this.props} style={{ borderRadius: style.borderRadius, ...this.props.style }} /> :
            <RoundImage {...this.props} image={_default_icon} style={{ borderRadius: style.borderRadius, ...this.props.style }} />
    }
}