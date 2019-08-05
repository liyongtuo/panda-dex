import React, { Component } from 'react';

export default class Image extends Component {
    
    render() {
        const style = {
            width: this.props.width,
            height: this.props.height,
            ...this.props.style
        }
        return (
            <img className={`${this.props.className ? this.props.className : ''}`} src={this.props.image || this.props.src} alt={this.props.alt} style={style}/>
        );
    }
}