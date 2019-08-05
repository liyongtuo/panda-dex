import React, { Component } from 'react';
import intl from 'react-intl-universal';

const Icons = {
    fail: require('@/images/toast/fail.png'),
    loading: require('@/images/toast/loading.png'),
    offline: require('@/images/toast/offline.png'),
    success: require('@/images/toast/success.png'),
    warning: require('@/images/toast/warning.png'),
}
export default class Notice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hour: '00',
            minute: '00',
            second: '00',
            remain: '00',
        }
    }

    componentDidMount() {
        if (this.props.type === 'lock') {
            const remain = parseInt((this.props.content.time - new Date().getTime()) / 1000)
            this.remain = remain
            this.count()
        }
    }


    count() {
        const second = this.remain % 60
        const minute = this.remain / (60) > 1 ? parseInt(this.remain / (60) % 60) : '00'
        const hour = this.remain / (60 * 60) > 1 ? '0' + parseInt(this.remain / (60 * 60)) : '00'
        this.setState({
            hour, minute, second, remain: this.remain
        })
        this.remain--
        setTimeout(() => {
            this.count()
        }, 1000);
    }

    render() {

        const { type, content } = this.props

        if (type === 'lock') {
            return (
                <div className="notice">
                    <p>
                        <span className="color-white ft-size-18">
                            {intl.get('ACCOUNT_LOCKED')}
                        </span>
                    </p>
                    <p>
                        <span className="color-white ft-size-13">
                            {intl.get('REASON')}：<span className="color-orange-deep">{content.reason}</span>
                        </span>
                    </p>
                    <p>
                        <span className="color-white ft-size-16">
                            {intl.get('PLEASE')}<span className="color-orange-deep">{this.state.hour}:{this.state.minute}:{this.state.second}</span>{intl.get('LATER_LOGIN')}
                        </span>
                    </p>
                </div>
            )
        }

        return (
            <div className="notice">
                <img src={Icons[type]} alt="" />
                <p>
                    {content}
                </p>
            </div>
        );
    }
}