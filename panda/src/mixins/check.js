import intl from 'react-intl-universal';

const checkRule = {
    phone: function (flag, errMsg) {
        let v = this.state.form.phone
        if (!v) {
            errMsg.phone = intl.get('ERROR_PHONE_IS_REQUIRED')
            flag = false
        } else {
            if (this.state.areaCode === '86') {
                const phoneReg = /^1[3|4|5|6|7|8|9]\d{9}/
                if (!phoneReg.test(v)) {
                    errMsg.phone = intl.get('ERROR_PHONE_IS_INVALID')
                    flag = false
                }
            } else {
                const phoneReg = /\d{7,11}/
                if (!phoneReg.test(v)) {
                    errMsg.phone = intl.get('ERROR_PHONE_IS_INVALID')
                    flag = false
                }
            }
        }
        return flag
    },
    email: function (flag, errMsg) {
        const Reg = /^[A-Za-z0-9\u4e00-\u9fa5_.-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
        let v = this.state.form.email
        if (!v) {
            errMsg.email = intl.get('ERROR_EMAIL_IS_REQUIRED')
            flag = false
        } else if (!Reg.test(v)) {
            errMsg.email = intl.get('ERROR_EMAIL_IS_INVALID')
            flag = false
        }
        return flag
    },
    code: function (flag, errMsg) {
        const Reg = /^[0-9a-z]{5}$/
        let v = this.state.form.code
        if (!v) {
            errMsg.code = intl.get('ERROR_CHECK_CODE_IS_REQUIRED')
            flag = false
        } else if (!Reg.test(v)) {
            errMsg.code = intl.get('ERROR_CHECK_CODE_IS_INVALID')
            flag = false
        }
        return flag
    },
    phoneCode: function (flag, errMsg) {
        const Reg = /^[0-9a-z]{5}$/
        let v = this.state.form.phoneCode
        if (!v) {
            errMsg.phoneCode = intl.get('ERROR_CHECK_CODE_IS_REQUIRED')
            flag = false
        } else if (!Reg.test(v)) {
            errMsg.phoneCode = intl.get('ERROR_CHECK_CODE_IS_INVALID')
            flag = false
        }
        return flag
    },
    emailCode: function (flag, errMsg) {
        const Reg = /^[0-9a-z]{5}$/
        let v = this.state.form.emailCode
        if (!v) {
            errMsg.emailCode = intl.get('ERROR_CHECK_CODE_IS_REQUIRED')
            flag = false
        } else if (!Reg.test(v)) {
            errMsg.emailCode = intl.get('ERROR_CHECK_CODE_IS_INVALID')
            flag = false
        }
        return flag
    },
    oldFundPassword: function (flag, errMsg) {
        const Reg = /^[0-9]{6}$/
        let v = this.state.form.oldFundPassword
        if (!v) {
            errMsg.oldFundPassword = intl.get('ERROR_OLD_FUND_PASSWORD_IS_REQUIRED')
            flag = false
        } else if (!Reg.test(v)) {
            errMsg.oldFundPassword = intl.get('ERROR_OLD_PASSWORD_IS_INVALID')
            flag = false
        }
        return flag
    },
    oldPassword: function (flag, errMsg) {
        const Reg = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d]{6,30}$/
        let v = this.state.form.oldPassword
        if (!v) {
            errMsg.oldPassword = intl.get('ERROR_OLD_PASSWORD_IS_REQUIRED')
            flag = false
        } else if (!Reg.test(v)) {
            errMsg.oldPassword = intl.get('ERROR_OLD_PASSWORD_IS_INVALID')
            flag = false
        }
        return flag
    },
    password: function (flag, errMsg) {
        const Reg = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d]{6,30}$/
        let v = this.state.form.password
        if (!v) {
            errMsg.password = intl.get('ERROR_PASSWORD_IS_REQUIRED')
            flag = false
        } else if (!Reg.test(v)) {
            errMsg.password = intl.get('ERROR_PASSWORD_IS_INVALID')
            flag = false
        }
        return flag
    },
    newPassword: function (flag, errMsg) {
        const numberChecker = /[0-9]/
        const lowercaseChecker = /[a-z]/
        const upercaseChecker = /[A-Z]/
        const lengthChecker = /[0-9a-zA-Z]{6,30}/
        let v = this.state.form.newPassword
        if (!v) {
            errMsg.newPassword = '0'
            flag = false
        } else {
            const results = [
                numberChecker.test(v) ? 1 : 0,
                lowercaseChecker.test(v) ? 1 : 0,
                upercaseChecker.test(v) ? 1 : 0,
                lengthChecker.test(v) ? 1 : 0,
            ]
            let result = results.join('')
            result = parseInt(result, 2)
            if (result < parseInt(1111, 2)) {
                flag = false
            }
            errMsg.newPassword = result
        }
        return flag
    },
    confirmPassword: function (flag, errMsg) {
        const key = 'confirmPassword'
        let v = this.state.form[key]
        if (!v) {
            errMsg[key] = intl.get('ERROR_CONFIRM_PASSWORD_IS_REQUIRED')
            flag = false
        } else if (this.state.form.password !== v && this.state.form.newPassword !== v) {
            errMsg[key] = intl.get('ERROR_CONFIRM_PASSWORD_IS_NOT_THE_SAME')
            flag = false
        }
        return flag
    },
    fundPassword: function (flag, errMsg) {
        const Reg = /^[0-9]{6}$/
        let v = this.state.form.fundPassword
        if (!v) {
            errMsg.fundPassword = intl.get('ERROR_FUND_PASSWORD_IS_REQUIRED')
            flag = false
        } else if (!Reg.test(v)) {
            errMsg.fundPassword = intl.get('ERROR_PASSWORD_IS_INVALID')
            flag = false
        }
        return flag
    },
    confirmFundPassword: function (flag, errMsg) {
        const key = 'confirmFundPassword'
        let v = this.state.form[key]
        if (!v) {
            errMsg[key] = intl.get('ERROR_CONFIRM_PASSWORD_IS_REQUIRED')
            flag = false
        } else if (this.state.form.fundPassword !== v) {
            errMsg[key] = intl.get('ERROR_CONFIRM_PASSWORD_IS_NOT_THE_SAME')
            flag = false
        }
        return flag
    },
    googleCode: function (flag, errMsg) {
        const Reg = /^[0-9]{6}$/
        let v = this.state.form.googleCode
        if (!v) {
            errMsg.googleCode = intl.get('ERROR_CHECK_CODE_IS_REQUIRED')
            flag = false
        } else if (!Reg.test(v)) {
            errMsg.googleCode = intl.get('ERROR_CHECK_CODE_IS_INVALID')
            flag = false
        }
        return flag
    },
    name: function (flag, errMsg) {
        // const Reg = /^([a-zA-Z0-9\u4e00-\u9fa5\·]{1,10})$/
        const key = 'name'
        let v = this.state.form[key]
        if (!v) {
            errMsg[key] = intl.get('ERROR_NAME_IS_REQUIRED')
            flag = false
        }
        // else if (!Reg.test(v)) {
        //     errMsg[key] = intl.get('ERROR_NAME_IS_INVALID')
        //     flag = false
        // }
        return flag
    },
    matrixId: function (flag, errMsg) {
        const Reg = /^([a-zA-Z0-9_]{6,30})$/
        const key = 'matrixId'
        let v = this.state.form[key]
        if (!v) {
            errMsg[key] = intl.get('ERROR_VENA_ID_IS_REQUIRED')
            flag = false
        } else if (!Reg.test(v)) {
            errMsg[key] = intl.get('ERROR_VENA_ID_IS_INVALID')
            flag = false
        }
        return flag
    },
    alipay: function (flag, errMsg) {
        const key = 'alipay'
        let v = this.state.form[key]
        if (!v) {
            errMsg[key] = intl.get('ERROR_ALIPAY_IS_REQUIRED')
            flag = false
        }
        return flag
    },
    wechat: function (flag, errMsg) {
        const key = 'wechat'
        let v = this.state.form[key]
        if (!v) {
            errMsg[key] = intl.get('ERROR_WECHAT_IS_REQUIRED')
            flag = false
        }
        return flag
    },
    photo: function (flag, errMsg) {
        const key = 'photo'
        let v = this.state.form[key]
        if (!v) {
            flag = false
        }
        return flag
    },
    country: function (flag, errMsg) {
        const key = 'country'
        let v = this.state.form[key]
        if (!v) {
            errMsg[key] = intl.get('ERROR_COUNTRY_IS_REQUIRED')
            flag = false
        }
        return flag
    },
    startTime: function (flag, errMsg) {
        const key = 'startTime'
        let v = this.state.form[key]
        if (!v) {
            errMsg[key] = intl.get('ERROR_START_TIME_IS_REQUIRED')
            flag = false
        }
        return flag
    },
    endTime: function (flag, errMsg) {
        const key = 'endTime'
        let v = this.state.form[key]
        if (!v) {
            errMsg[key] = intl.get('ERROR_END_TIME_IS_REQUIRED')
            flag = false
        }
        return flag
    },
    cardNumber: function (flag, errMsg) {
        const key = 'cardNumber'
        let v = this.state.form[key]
        if (!v) {
            errMsg[key] = intl.get('ERROR_BANK_IS_REQUIRED')
            flag = false
        }
        return flag
    },
    bankName: function (flag, errMsg) {
        const key = 'bankName'
        let v = this.state.form[key]
        if (!v) {
            errMsg[key] = intl.get('ERROR_BANK_NAME_IS_REQUIRED')
            flag = false
        }
        return flag
    },
    bankBranchName: function (flag, errMsg) {
        const key = 'bankBranchName'
        let v = this.state.form[key]
        if (!v) {
            errMsg[key] = intl.get('ERROR_BANK_BRANCH_NAME_IS_REQUIRED')
            flag = false
        }
        return flag
    },
    confirmName: function (flag, errMsg) {
        const key = 'confirmName'
        let v = this.state.form[key]
        if (!v) {
            errMsg[key] = intl.get('ERROR_CONFIRM_NAME_IS_REQUIRED')
            flag = false
        } else if (this.state.form.name !== v) {
            errMsg[key] = intl.get('ERROR_CONFIRM_NAME_IS_INVALID')
            flag = false
        }
        return flag
    },
    IDType: function (flag, errMsg) {
        const key = 'IDType'
        let v = this.state.form[key]
        if (!v) {
            errMsg[key] = intl.get('ERROR_ID_TYPE_IS_REQUIRED')
            flag = false
        }
        return flag
    },
    IDNumber: function (flag, errMsg) {
        const key = 'IDNumber'
        let v = this.state.form[key]
        const country = this.state.form.country
        if (!v) {
            errMsg[key] = intl.get('ERROR_ID_NUMBER_IS_REQUIRED')
            flag = false
        } else if (country === 'Mainland China') {
            const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X)$)/
            if (!reg.test(v)) {
                errMsg[key] = intl.get('ERROR_ID_NUMBER_IS_INVALID')
                flag = false
            }
        } else if (country === 'Hongkong China') {
            const reg = /^[A-Z0-9\(,\)]{8,11}$/
            if (!reg.test(v)) {
                errMsg[key] = intl.get('ERROR_ID_NUMBER_IS_INVALID')
                flag = false
            }
        } else if (country === 'Macao China') {
            const reg = /^[0-9\(\)]{8,10}$/
            if (!reg.test(v)) {
                errMsg[key] = intl.get('ERROR_ID_NUMBER_IS_INVALID')
                flag = false
            }
        } else if (country === 'Taiwan China') {
            const reg = /^[A-Z][0-9]{9}$/
            if (!reg.test(v)) {
                errMsg[key] = intl.get('ERROR_ID_NUMBER_IS_INVALID')
                flag = false
            }
        } else if (country === 'Singapore') {
            const reg = /^[0-9]{7}[A,B,C,D,E,F,G,H,I,Z,J]$/
            if (!reg.test(v)) {
                errMsg[key] = intl.get('ERROR_ID_NUMBER_IS_INVALID')
                flag = false
            }
        } else if (country === 'Vietnam') {
            const reg = /^[0-9]{9}$/
            if (!reg.test(v)) {
                errMsg[key] = intl.get('ERROR_ID_NUMBER_IS_INVALID')
                flag = false
            }
        } else if (country === 'Japan') {
            const reg = /^[0-9]{12}$/
            if (!reg.test(v)) {
                errMsg[key] = intl.get('ERROR_ID_NUMBER_IS_INVALID')
                flag = false
            }
        } else if (country === 'Korea') {
            const reg = /^[0-9-]{13,14}$/
            if (!reg.test(v)) {
                errMsg[key] = intl.get('ERROR_ID_NUMBER_IS_INVALID')
                flag = false
            }
        } else if (country === 'USA') {
            const reg = /^[A-Z0-9-]$/
            if (!reg.test(v)) {
                errMsg[key] = intl.get('ERROR_ID_NUMBER_IS_INVALID')
                flag = false
            }
        } else if (country === 'Russia') {
            const reg = /^[A-Z0-9a-z]{10,12}}/
            if (!reg.test(v)) {
                errMsg[key] = intl.get('ERROR_ID_NUMBER_IS_INVALID')
                flag = false
            }
        }
        return flag
    },
}

function check(checkList, showError) {
    let flag = true
    let errMsg = {}
    checkList.forEach(item => {
        if (checkRule[item]) {
            let rule = checkRule[item].bind(this)
            flag = rule(flag, errMsg)
        }
    })
    if (!showError) {
        this.setState({ errMsg: { ...this.state.errMsg, ...errMsg } })
    }
    return flag
}

export default check;