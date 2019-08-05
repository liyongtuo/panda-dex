// import util from '@/util';
import intl from 'react-intl-universal';
import { Toast } from '@/components'
import BigNumber from 'bignumber.js';

export default {
    resetForm: function () {
        const keys = Object.keys(this.state.form)
        const form = {}
        const errMsg = {}
        keys.forEach(value => {
            form[value] = ''
            errMsg[value] = ''
        })
        this.setState({
            form,
            errMsg,
            oldPhoneCheck: false,
            oldEmailCheck: false,
            securityCheck: false,
            usePhoneCode: false,
            useEmailCode: false,
        })
        if (this.phoneCode) {
            this.phoneCode.stop()
        }
        if (this.emailCode) {
            this.emailCode.stop()
        }
        if (this.checkCode) {
            this.checkCode.stop()
        }
    },
    updateState: function (key, value, callback) {
        const data = {
            form: { ...this.state.form },
            errMsg: { ...this.state.errMsg }
        }
        data.form[key] = value
        data.errMsg[key] = ''
        this.setState(data, () => {callback && callback()})
    },
    getUrlParams: function (key) {
        try {
            let search = window.location.hash.substring(window.location.hash.indexOf('?') + 1);
            const temp = new URLSearchParams(search);
            return temp.get(key);
        } catch (e) {
            return '';
        }
    },
    dateFormater: function (date, type) {
        // return util.formatDate(date, type)
        return date;
    },
    handleError: function (res) {
        if (res.response_code === 'EMAIL_CAPTCHA_EXCEPTION') {
            this.setState({ errMsg: { ...this.state.errMsg, emailCode: intl.get('ERROR_EMAIL_CAPTCHA_EXCEPTION') } })
        } else if (res.response_code === 'PHONE_CAPTCHA_EXCEPTION') {
            this.setState({ errMsg: { ...this.state.errMsg, phoneCode: intl.get('ERROR_PHONE_CAPTCHA_EXCEPTION') } })
        } else if (res.response_code === 'GA_CAPTCHA_EXCEPTION') {
            this.setState({ errMsg: { ...this.state.errMsg, googleCode: intl.get('ERROR_GA_CAPTCHA_EXCEPTION') } })
        } else if (res.response_code === 'CAPTCHA_EXCEPTION') {
            if (this.phoneCodeInput) {
                this.setState({ errMsg: { ...this.state.errMsg, phoneCode: intl.get('ERROR_CAPTCHA') } })
            } else if (this.emailCodeInput) {
                this.setState({ errMsg: { ...this.state.errMsg, emailCode: intl.get('ERROR_CAPTCHA') } })
            } else if (this.googleCodeInput) {
                this.setState({ errMsg: { ...this.state.errMsg, googleCode: intl.get('ERROR_CAPTCHA') } })
            }
        } else {
            Toast.fail(res.response_msg)
        }
    },
    toPriceNum: function (num, precision) {
        if (num === '---') return '---'
        if (num) return new BigNumber(num).toFixed(precision);
        num = '0.'
        for (let i = 0; i < precision; i++) {
            num += '0'
        }
        return num
    },
    toAmountNum: function (num) {
        if (num === '---') return '---'
        if (num) return parseFloat(num).toFixed(4);
        return "0.0000"
    },
    getPair: function (pair) {
        if (!pair) return '- / -'
        return pair.split('_')[0].toUpperCase() + '/' + pair.split('_')[1].toUpperCase()
    },
    getToken: function(pair) {
        if (!pair) return '-'
        return pair.split('_')[0].toUpperCase()
    },
    getPrice: function(pair) {
        if (!pair) return '-'
        return pair.split('_')[1].toUpperCase()
    },
    getBluredEmail: function(email) {
        if (!email) return ''
        const start = email.split('@')[0]
        const end = email.split('@')[1]
        return start.substr(0, 3) + '****@' + end
    },
    getBluredPhone: function(phone) {
        if (!phone) return ''
        return phone.substr(0, 3) +  '****' + phone.substr(7, 4)
    },
    getBluredBank: function(bank) {
        if (!bank) return ''
        return '**** **** **** ' + bank.substr(-4, 4)
    },
    getBluredAccount: function(account) {
        if (!account) return ''
        return '**** **** ' + account.substr(-4, 4)
    }
}
