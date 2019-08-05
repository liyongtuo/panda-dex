import React, { Component } from 'react';

export default class RoundImage extends Component {

    render() {
        const size = this.props.size
        const style = {
            width: size,
            height: size,
            minWidth: size,
            minHeight: size,
            borderRadius: '50%',
            ...this.props.style
        }
        return (
            <div className={`${this.props.className} matrix-round-img`} style={style}>
                <img
                    src={this.props.image}
                    alt=""
                />
            </div>
        );
    }
}