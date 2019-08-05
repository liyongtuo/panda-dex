import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
    Button,
    Captcha,
    Toast,
    CheckCode,
} from '@/components';
import Modal from './Modal';
import { notification } from 'antd'
import md5 from 'md5';
import intl from 'react-intl-universal';
import mixins from '@/mixins';
import { mixin } from 'core-decorators';

const intlPrefix = 'USER_SETTINGS_';

const _googleCheckWidthPhone = 'AUTH_NEED_SECOND_CHECK_GA_SMS'
const _googleCheckWidthEmail = 'AUTH_NEED_SECOND_CHECK_GA_EMAIL'
const _phoneCheck = 'AUTH_NEED_SECOND_CHECK_SMS'
const _emailCheck = 'AUTH_NEED_SECOND_CHECK_EMAIL'

@mixin(mixins)
class LoginModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            account: '',
            password: '',
            captcha: '',
            accountErr: '',
            passwordErr: '',
            captchaErr: '',
            loading: false,
            loginConfirm: false,
            confirmType: _googleCheckWidthPhone,
            codeLoading: false,
            needCaptcha: false,
            usePhoneCode: false,
            useEmailCode: false,

            visible: true,
        }
    }

    doLogin() {
        const data = {
            account: this.state.account,
            password: md5(this.state.password),
            captcha: this.state.captcha,
        }
        this.setState({ loading: true })
        Storage.Service.postAuthAccessLogin(data).then(res => {
            console.log(res)
            this.setState({ loading: false })
            if (res.response_code === '00') {
                this.loginSuccess()
            } else {
                if (res.response_code === 'AUTH_LOGIN_ACCOUNT_PWD_EXCEPTION_NEED_CAPTCHA') {
                    this.setState({ needCaptcha: true })
                    Toast.fail(intl.get('ERROR_ACCOUNT_OR_PASSWORD'))
                } else if (res.response_code === 'AUTH_LOGIN_FAIL_EXCEPTION') {
                    if (!this.state.needCaptcha) {
                        this.setState({ needCaptcha: true })
                    } else {
                        this.setState({ captchaErr: intl.get('ERROR_CAPTCHA') })
                    }
                } else if (res.response_code === _googleCheckWidthPhone || res.response_code === _googleCheckWidthEmail || res.response_code === _phoneCheck || res.response_code === _emailCheck) {
                    this.setState({
                        loginConfirm: true,
                        confirmType: res.response_code,
                        reasonType: res.content
                    })
                } else if (res.response_code === 'AUTH_LOCK') {
                    Toast.lock(res.content, 0)
                } else {
                    Toast.fail(res.response_msg, 1)
                }
                if (this.state.needCaptcha && this.captcha) {
                    this.captcha.reload()
                }
            }
        })
    }

    getCheckCode(type) {
        const data = {
            need_account: false,
            type: type === 'phone' ? 'sms' : 'email',
            path: '/auth/access/login_second',
        }
        this.setState({ codeLoading: true })
        Storage.Service.postCommonAccessSendMessage(data).then(res => {
            this.setState({ codeLoading: false })
            if (res.response_code === '00') {
                this.checkCode.counting()
            } else {
                Toast.fail(res.response_msg, 1)
            }
        }).catch(err => {
            console.log(err)
        })
    }

    doLoginConfirm() {
        const data = {
            captcha: this.state.captcha,
            type: ''
        }
        if (this.state.confirmType === _googleCheckWidthPhone || this.state.confirmType === _googleCheckWidthEmail) {
            data.type = 'ga'
        }
        if (this.state.confirmType === _phoneCheck || this.state.usePhoneCode) {
            data.type = 'sms'
        }
        if (this.state.confirmType === _emailCheck || this.state.useEmailCode) {
            data.type = 'email'
        }
        this.setState({ loading: true })
        Storage.Service.getAuthAccessLoginSecond(data).then(res => {
            this.setState({ loading: false })
            if (res.response_code === '00') {
                this.loginSuccess()
            } else {
                if (res.response_code === 'AUTH_REGISTER_FAIL_EXCEPTION') {
                    this.setState({ captchaErr: res.response_msg })
                } else if (res.response_code === 'AUTH_NOT_LOGIN') {
                    this.setState({ loginConfirm: false })
                    Toast.warning(intl.get('ERROR_PLEASE_RELOGIN'))
                } else {
                    Toast.fail(res.response_msg)
                }
            }
        })
    }

    loginSuccess() {
        this.setState({ visible: false }, () => {
            notification.info({
                message: (
                    <span className="notification">
                        {intl.get(`USER_SETTINGS_TIP_LOGIN_EXPIRATION`)}
                    </span>
                ),
                duration: 2
            })
        })
        if (this.props.onSuccess) {
            this.props.onSuccess()
        }
    }

    shake() {
        this.accountInput.shake()
        this.passwordInput.shake()
        if (this.state.needCaptcha) {
            this.captchaInput.shake()
        }
    }

    checkAndConfirmLogin() {
        if (this.check('code')) {
            this.doLoginConfirm()
        } else {
            this.shake()
        }
    }

    checkAndLogin() {
        if (this.check('', true)) {
            this.doLogin()
        } else {
            this.shake()
        }
    }

    check(name, checkAll) {
        let flag = true
        if (checkAll || name === 'account') {
            if (!this.state.account) {
                this.setState({ accountErr: intl.get('ERROR_ACCOUNT_IS_REQUIRED') })
                flag = false
            }
        }
        if (checkAll || name === 'password') {
            if (!this.state.password) {
                this.setState({ passwordErr: intl.get('ERROR_PASSWORD_IS_REQUIRED') })
                flag = false
            }
        }
        if ((checkAll && this.state.needCaptcha) || name === 'captcha') {
            console.log('captcha')
            if (!this.state.captcha) {
                this.setState({ captchaErr: intl.get('ERROR_CHECK_CODE_IS_REQUIRED') })
                flag = false
            }
        }
        return flag
    }

    render() {
        const captcha = (
            <Captcha ref={el => this.captcha = el} />
        )
        const append = (type) => (
            <div className={`check-code`}>
                <CheckCode
                    ref={el => this.checkCode = el}
                    loading={this.state.codeLoading}
                    onClick={() => {
                        this.getCheckCode(type)
                    }} />
            </div>
        )
        const googleCode = () => (
            <Modal.Input
                ref={el => this.captchaInput = el}
                value={this.state.captcha}
                label={intl.get(`${intlPrefix}LABEL_GOOGLE_CHECK`)}
                placeholder={intl.get(`${intlPrefix}PLACEHOLDER_GOOGLE_CHECK`)}
                maxLength={6}
                labelPlacement="top"
                onChange={(v) => { this.setState({ captcha: v, captchaErr: '' }) }}
                onEnter={() => { this.checkAndConfirmLogin() }}
                errMsg={this.state.captchaErr}
                onBlur={() => { this.check('captcha') }}
            />
        )
        const phoneCode = () => (
            <div className="flex-align-center">
                <Modal.Input
                    ref={el => this.captchaInput = el}
                    value={this.state.captcha}
                    label={intl.get('SMS_CAPTCHA')}
                    placeholder={intl.get('ERROR_PHONE_CODE_IS_REQUIRED')}
                    labelPlacement="top"
                    width="2.65rem"
                    maxLength={5}
                    onChange={(v) => { this.setState({ captcha: v, captchaErr: '' }) }}
                    errMsg={this.state.captchaErr}
                    onEnter={() => { this.checkAndConfirmLogin() }}
                    onBlur={() => { this.check('code') }}
                    append={append('phone')}
                />
                <div className="color-tip ft-size-12 ml-10 mt-15">
                    <p>
                        {intl.get(`${intlPrefix}TIP_SMS_1`)}
                    </p>
                    <p>
                        {intl.get(`${intlPrefix}TIP_SMS_2`)}
                    </p>
                </div>
            </div>
        )
        const emailCode = () => (
            <div className="flex-align-center">
                <Modal.Input
                    ref={el => this.captchaInput = el}
                    value={this.state.captcha}
                    label={intl.get(`${intlPrefix}LABEL_EMAIL_CHECK`)}
                    placeholder={intl.get('ERROR_EMAIL_CODE_IS_REQUIRED')}
                    labelPlacement="top"
                    width="2.65rem"
                    maxLength={5}
                    onChange={(v) => { this.setState({ captcha: v, captchaErr: '' }) }}
                    errMsg={this.state.captchaErr}
                    onEnter={() => { this.checkAndConfirmLogin() }}
                    onBlur={() => { this.check('code') }}
                    append={append('email')}
                />
                <div className="color-tip ft-size-12 ml-10 mt-15">
                    <p>
                        {intl.get(`${intlPrefix}TIP_EMAIL_1`)}
                    </p>
                    <p>
                        {intl.get(`${intlPrefix}TIP_EMAIL_2`)}
                    </p>
                </div>
            </div>
        )

        const renderLoginConfirm = (
            <div>
                <div className="color-white text-center ft-size-20 mt-40">
                    {intl.get(`${intlPrefix}TITLE_LOGIN_CONFIRM_1`, {
                        type: this.state.reasonType === 'device' ? intl.get(`${intlPrefix}TITLE_LOGIN_CONFIRM_4`) : intl.get(`${intlPrefix}TITLE_LOGIN_CONFIRM_3`)
                    })}，{intl.get(`${intlPrefix}TITLE_LOGIN_CONFIRM_2`)}
                </div>
                <div className="padding-x-30 mt-30">
                    {(this.state.confirmType === _googleCheckWidthPhone || this.state.confirmType === _googleCheckWidthEmail)
                        && !this.state.usePhoneCode && !this.state.useEmailCode ? googleCode() : null}
                    {this.state.confirmType === _phoneCheck || this.state.usePhoneCode ? phoneCode() : null}
                    {this.state.confirmType === _emailCheck || this.state.useEmailCode ? emailCode() : null}
                    <div className="mt-40 mb-40">
                        <Button
                            loading={this.state.loading}
                            loadingText=""
                            onClick={() => {
                                this.checkAndConfirmLogin()
                            }}
                        >{intl.get('CHECK')}</Button>
                        {
                            this.state.confirmType === _googleCheckWidthPhone ?
                                <div className="underline-click ft-size-14 mt-10">
                                    <span className="color-white mr-5">
                                        {intl.get('SWITCH_TO')}
                                    </span>
                                    {
                                        this.state.usePhoneCode ?
                                            <a onClick={() => {
                                                this.setState({ usePhoneCode: false })
                                            }}>
                                                {intl.get('GOOGLE_CHECK')}
                                            </a>
                                            :
                                            <a onClick={() => {
                                                this.setState({ usePhoneCode: true })
                                            }}>
                                                {intl.get('PHONE_CHECK')}
                                            </a>
                                    }
                                </div>
                                :
                                null
                        }
                    </div>
                </div>
            </div>
        )

        const renderLogin = (
            <div>
                <div className="text-center color-white ft-size-20 mt-40">
                    {intl.get('ACCOUNT_LOGIN')}
                </div>
                <div className="padding-x-50 mt-30">
                    <Modal.Input
                        ref={el => this.accountInput = el}
                        value={this.state.account}
                        label={intl.get('ACCOUNT')}
                        placeholder={intl.get(`${intlPrefix}PLACEHOLDER_LOGIN_ACCOUNT`)}
                        labelPlacement="top"
                        onChange={(v) => { this.setState({ account: v, accountErr: '' }) }}
                        errMsg={this.state.accountErr}
                        onBlur={() => { this.check('account') }}
                        onEnter={() => { this.checkAndLogin() }}
                    />
                    <Modal.Input
                        ref={el => this.passwordInput = el}
                        value={this.state.password}
                        label={intl.get('PASSWORD')}
                        placeholder={intl.get('ERROR_PASSWORD_IS_REQUIRED')}
                        type="password"
                        labelPlacement="top"
                        onChange={(v) => { this.setState({ password: v, passwordErr: '' }) }}
                        errMsg={this.state.passwordErr}
                        onBlur={() => { this.check('password') }}
                        onEnter={() => { this.checkAndLogin() }}
                    />
                    {
                        this.state.needCaptcha ?
                            <Modal.Input
                                ref={el => this.captchaInput = el}
                                value={this.state.captcha}
                                label={intl.get('CHECK_CODE')}
                                placeholder={intl.get('ERROR_CHECK_CODE_IS_REQUIRED')}
                                maxLength={5}
                                labelPlacement="top"
                                onChange={(v) => { this.setState({ captcha: v, captchaErr: '' }) }}
                                errMsg={this.state.captchaErr}
                                append={captcha}
                                onBlur={() => { this.check('captcha') }}
                                onEnter={() => { this.checkAndLogin() }}
                            /> : null
                    }
                </div>
                <div className="text-center mt-20 mb-50">
                    <Button
                        loading={this.state.loading}
                        loadingText=""
                        onClick={() => {
                            this.checkAndLogin()
                        }}
                    >{intl.get('LOGIN')}</Button>
                    <div className="padding-x-40 flex-between color-white mt-20 ft-size-14">
                        <span>
                            {intl.get('NO_ACCOUNT')} <a className="click-primary" onClick={() => {
                                this.setState({ visible: false })
                                window.location.href = "#/auth/register"
                            }}>{intl.get('REGISTER_NOW')}</a>
                        </span>
                        <span>
                            <a className="click-primary" onClick={() => {
                                this.setState({ visible: false })
                                window.location.href = "#/auth/forget_pass"
                            }}>
                                {intl.get('FORGET_PASS')}
                            </a>
                        </span>
                    </div>
                </div>
            </div>
        )

        return (
            <Modal
                visible={this.state.visible}
                onCancel={() => { this.setState({ visible: false }) }}
                maskClosable={false}
            >
                {this.state.loginConfirm ? renderLoginConfirm : renderLogin}
            </Modal>
        )
    }

}

const show = (props) => {

    let component = null;
    const div = document.createElement('div');
    document.body.appendChild(div);

    const afterClose = () => {
        ReactDOM.unmountComponentAtNode(div);
        document.body.removeChild(div);

        if (typeof props.afterClose === 'function') {
            props.afterClose();
        }
    }

    ReactDOM.render(
        <LoginModal
            ref={el => component = el}
            afterClose={afterClose}
            {...props}
        ></LoginModal>,
        div
    );
    return component;
}

export default (props) => show({
    ...props,
});