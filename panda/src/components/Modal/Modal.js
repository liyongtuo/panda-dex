import React, { Component } from 'react';
import { Modal as AntModal } from 'antd';

const images = {
    close: require('@/images/toast/close.png')
}

export default class Modal extends Component {
    render() {
        if (this.props.blank) {
            return (
                <AntModal
                    wrapClassName={`matrix-modal matrix-modal-blank ${this.props.className}`}
                    mask={false}
                    centered
                    closable={false}
                    footer={null}
                    {...this.props}
                >
                    {this.props.children}
                </AntModal>
            )
        }
        return (
            <AntModal
                wrapClassName={`matrix-modal ${this.props.className}`}
                mask={false}
                centered
                closable={false}
                footer={null}
                {...this.props}
            >
                {this.props.children}
                {this.props.closable === false ? null :
                    <img src={images.close} alt="close" className="matrix-modal-close"
                        onClick={() => {
                            if (this.props.onCancel) {
                                this.props.onCancel()
                            }
                        }}
                    />
                }
            </AntModal>
        );
    }
}