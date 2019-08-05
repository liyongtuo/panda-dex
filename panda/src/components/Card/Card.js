import React, { Component } from 'react';

const _prefix = 'matrix-card'

const images = {
    right: require('@/images/card/right.png'),
    right_dark: require('@/images/card/right-dark.png')
}

export default class Card extends Component {

    render() {

        const hideLine = this.props.hideLine ? 'hide-line' : '';

        const rightArrow = () => (
            <div className={`${_prefix}-right-arrow`}>
                <img src={images.right_dark} alt="" />
            </div>
        )

        const renderTitle = () => (
            <div className={`${_prefix}-title-bar ${hideLine} flex-between flex-align-center`} onClick={() => {
                if (this.props.onClick) {
                    this.props.onClick()
                }
            }}>
                <div className={`${_prefix}-title flex-align-center ft-size-16 ft-weight-500 color-primary-deep`}>
                    {this.props.title}
                </div>
                <div>
                    {this.props.titleAppend || null}
                    {this.props.onClick ? rightArrow() : null}
                </div>
            </div>
        )
        const renderSideBar = () => (
            <div className={`${_prefix}-sidebar`}>
                {this.props.sideBar}
            </div>
        )

        return (
            <div
                className={`${_prefix} ${this.props.border ? `${_prefix}-border` : ''} ${this.props.far ? `${_prefix}-far` : ''} ${this.props.className || ''} flex`}
                style={{ ...this.props.style }}
            >
                {this.props.sideBar ? renderSideBar() : null}
                <div className={`${_prefix}-container ${this.props.noPadding ? `${_prefix}-no-padding` : ''}`}>
                    {this.props.title ? renderTitle() : null}
                    {this.props.children ?
                        <div className={`${_prefix}-content`}>
                            {this.props.children}
                        </div>
                        : null}
                </div>
            </div>
        );
    }
}