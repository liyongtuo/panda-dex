import React, { Component } from 'react';
import Modal from './Modal';
import Button from '../Button';
import {Icon} from 'antd';
import intl from 'react-intl-universal';
import qrcode from '@/images/vena_qrcode.jpg';
const _pre = "not-open";

export default class ConfirmModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: true
        }
    }

    close = () => {
        this.setState({ visible: false })
    };

    render() {

        const container = (
                <div className={`${_pre}`}>
                    <Icon type="exclamation-circle" theme="outlined" style={{fontSize: '.5rem'}} />
                
                    <div className="mt-20">
                        {intl.get('NOT_OPEN_1')}<br/>
                        {intl.get('NOT_OPEN_2')}
                    </div>

                    <div className="mt-20">
                        {
                            intl.get('NOT_OPEN_5') ?
                                intl.getHTML('NOT_OPEN_5')
                                :
                                <img src={qrcode} alt=""/>
                        }

                    </div>

                    <div className={`${_pre}-sub mt-10`}>
                        {intl.get('NOT_OPEN_3')}
                    </div>

                    <div className="padding-x-40 mt-30">
                        <Button width='100%' onClick={this.close}>
                            {intl.get('NOT_OPEN_4')}
                        </Button>
                    </div>
                </div>
        )
        return (
            <Modal
                visible={this.state.visible}
                onCancel={this.close}
                {...this.props}
            >
                {container}
            </Modal>
        );
    }
}