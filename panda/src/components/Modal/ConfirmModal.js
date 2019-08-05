import React, { Component } from 'react';
import Modal from './Modal';
import Button from '../Button';
import Image from '../Image';
import intl from 'react-intl-universal';

const images = {
    warning: require('@/images/toast/warning.png'),
    info: require('@/images/toast/info.png')
}

export default class ConfirmModal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            visible: true,
            loading: false,
            content: '',
            render: false,
        }
    }

    componentDidMount = () => {
        if (this.props.promiseContent) {
            this.props.promiseContent().then(res => {
                this.setState({
                    content: res,
                    render: true
                })
            })
        }
    }


    onOK() {
        if (this.props.onClickOK) {
            this.setState({ loading: true })
            this.props.onClickOK().then(() => {
                this.setState({
                    loading: false,
                    visible: false
                })
            })
        } else {
            this.setState({ visible: false })
        }
    }

    onCancel() {
        if (this.props.onClickCancel) {
            this.props.onClickCancel()
        }
        this.setState({ visible: false })
    }

    render() {

        const container = (
            <div className="matrix-modal-confirm text-center">
                <div>
                    <Image
                        image={images.warning}
                        width=".56rem"
                        height=".56rem"
                    />
                </div>
                <div className="color-white mt-30">
                    {this.props.promiseContent ?
                        <div>
                            {this.state.render ? this.state.content : this.props.content}
                        </div>
                        :
                        this.props.content}
                </div>
                <div className="mt-40">
                    <Button onClick={() => {
                        this.setState({ visible: false })
                        if (this.props.onOK) {
                            this.props.onOK()
                        }
                    }}>{this.props.okText || intl.get('CONFIRM')}</Button>
                </div>
            </div>
        )
        const hasCancel = (
            <div className="matrix-modal-confirm text-center">
                <div>
                    <Image
                        image={images[this.props.icon || 'warning']}
                        width=".56rem"
                        height=".56rem"
                    />
                </div>
                <div className="color-white mt-30">
                    {this.props.promiseContent ?
                        <div>
                            {this.state.render ? this.state.content : this.props.content}
                        </div>
                        :
                        this.props.content}
                </div>
                {
                    this.props.hasCancel ?
                        <div className="mt-40 flex-around">
                            <Button
                                width="1.66rem"
                                onClick={() => { this.onCancel() }}
                                ghost
                                color={this.props.cancelColor || ''}
                            >{this.props.cancelText || intl.get('CANCEL')}</Button>
                            <Button width="1.66rem"
                                loading={this.state.loading}
                                onClick={() => { this.onOK() }}
                                color={this.props.okColor || ''}
                            >{this.props.okText || intl.get('CONFIRM')}</Button>
                        </div>
                        :
                        <div className="mt-40">
                            <Button
                                loading={this.state.loading}
                                onClick={() => { this.onOK() }}
                                color={this.props.okColor || ''}
                            >{this.props.okText || intl.get('CONFIRM')}</Button>
                        </div>
                }
            </div>
        )
        return (
            <Modal
                visible={this.state.visible}
                onCancel={() => { this.setState({ visible: false }) }}
                {...this.props}
            >
                {this.props.promise ? hasCancel : container}
            </Modal>
        );
    }
}