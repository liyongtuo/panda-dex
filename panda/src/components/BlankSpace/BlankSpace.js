import React, { Component } from 'react';

export default class BlankSpace extends Component {
    render() {
        const style = {
            width: '100%',
            height: this.props.size ? this.props.size : '.1rem'
        }
        return (
            <div style={style}></div>
        );
    }
}