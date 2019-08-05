import React, { Component } from 'react'
import { Icon } from 'antd';

export default class Favorite extends Component {
    render() {
        if (this.props.favorite) {
            return (
                <Icon
                    type="star"
                    theme="filled"
                    className={`clickable color-font-second ${this.props.className}`}
                    onClick={() => { this.props.onFavorite && this.props.onUnFavorite() }}
                />
            )
        }
        return (
            <Icon
                type="star"
                // theme="filled"
                className={`clickable color-font-second ${this.props.className}`}
                onClick={() => { this.props.onUnFavorite && this.props.onFavorite() }}
            />
        )
    }
}
