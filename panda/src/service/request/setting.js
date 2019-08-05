import { post, get } from '../method';

// import { url } from '../config';

const _prefix = `matrix-base`;

const request = {

    /**
     *设置资金密码验证频率
     *{"type":0} 0=每笔交易均验证,1=每小时验证一次,2=每天验证一次
     */
    postSettingPayPwdCheckRate: (data) => post(`${_prefix}/setting/pay_pwd/check_rate`, data),

    /**
     *重新绑定邮箱
     *{"email":"13313952927@qq.com","phone_captcha":"captcha","email_captcha":"captcha","ga_captcha":"captcha"}
     */
    postSettingKycRebindEmail: (data) => post(`${_prefix}/setting/kyc/rebind_email`, data),

    /**
     *ga两步安全验证
     *{"tag":"","sms_captcha":"","email_captcha":""}
     */
    postSettingBindGaCheck: (data) => post(`${_prefix}/setting/bind_ga/check`, data),

    /**
     *最近登录历史信息
     *登录状态：A=登录成功，B=存在风险
     */
    getSettingLatelyLoginPipeline: (data) => get(`${_prefix}/setting/lately_login_pipeline`),

    /**
     *修改语言
     *{"language":"0=简体字，1=繁体字，2=英语，其他待加"}
     */
    postSettingModifyLang: (data) => post(`${_prefix}/setting/modify_lang`, data),

    /**
     *修改密码
     *{"old_pwd":"","new_pwd":"","captcha":"手机验证码","ga_captcha":"ga验证码"}
     */
    postSettingModifyPwd: (data) => post(`${_prefix}/setting/modify_pwd`, data),

    /**
     *绑定ga
     *{"captcha":"ga验证码"}
     */
    postSettingBindGa: (data) => post(`${_prefix}/setting/bind_ga`, data),

    /**
     *设置/修改支付密码
     *{"ga_captcha":"ga验证码","pay_pwd":null,"old_pwd":"修改密码时该字段不能为空","captcha":"手机验证码"}
     */
    postSettingSetPayPwd: (data) => post(`${_prefix}/setting/set_pay_pwd`, data),

    /**
     *绑定邮箱
     *{"email":"13952133927@qq.com","phone_captcha":"captcha","email_captcha":"captcha"}
     */
    postSettingKycBindEmail: (data) => post(`${_prefix}/setting/kyc/bind_email`, data),

    /**
     *kyc绑定银行卡
     *{"bank_name":"","bank_branch_name":"","account_no":"银行卡账号"}
     */
    postSettingKycBindBankCard: (data) => post(`${_prefix}/setting/kyc/bind_bank_card`, data),

    /**
     *kyc上传身份证正反面照片
     *{"positive_img":"","reverse_img":"","hand_img":""}
     */
    postSettingKycUploadIdentity: (data) => post(`${_prefix}/setting/kyc/upload_identity`, data),

    /**
     *验证原手机和邮箱
     *{"type":"sms,email", "captcha":"captcha"}
     */
    postSettingKycCheckOldPhoneEmail: (data) => post(`${_prefix}/setting/kyc/check/old_phone_email`, data),

    /**
     *个人中心,暂不做
     */
    getSettingPersonalCenter: (data) => get(`${_prefix}/setting/personal_center`),

    /**
     *重置支付密码
     *{"ga_captcha":"ga验证码","email_captcha":"email验证码","pay_pwd":null,"captcha":"手机验证码"}
     */
    postSettingResetPayPwd: (data) => post(`${_prefix}/setting/reset_pay_pwd`, data),

    /**
     *账号管理-安全设置
     */
    getSettingSafetyInfo: (data) => get(`${_prefix}/setting/safety_info`),

    /**
     *获取ga参数
     */
    getSettingGa: (data) => get(`${_prefix}/setting/ga`, data),

    /**
     *设备数量设置
     *{"ga_captcha":"ga验证码","count":0,"captcha":"手机验证码"}
     */
    postSettingDeviceCount: (data) => post(`${_prefix}/setting/device_count`, data),

    /**
     *设置是否锁定账号
     *{"lock":0} 0=不锁定，1=锁定
     */
    postSettingLockAccount: (data) => post(`${_prefix}/setting/lock_account`, data),

    /**
     *修改性别
     *{"gender":"0=女，1=男，2=保密"}
     */
    postSettingModifyUserGender: (data) => post(`${_prefix}/setting/modify_user_gender`, data),

    /**
     *绑定手机
     *{"phone":"13952133927","phone_captcha":"captcha","email_captcha":"captcha","area_code":"86"}
     */
    postSettingKycBindPhone: (data) => post(`${_prefix}/setting/kyc/bind_phone`, data),

    /**
     *IP地址登录数量设置
     *{"ga_captcha":"ga验证码","count":0,"captcha":"手机验证码"}
     */
    postSettingIpCount: (data) => post(`${_prefix}/setting/ip_count`, data),

    /**
     *重新绑定手机
     *{"area_code":"86","phone":"13313952927","phone_captcha":"captcha","email_captcha":"captcha","ga_captcha":"captcha"}
     */
    postSettingKycRebindPhone: (data) => post(`${_prefix}/setting/kyc/rebind_phone`, data),

    /**
     *是否启用ga
     *{"ga":"0=关闭ga，1=打开ga"}
     */
    postSettingSetGa: (data) => post(`${_prefix}/setting/set_ga`, data),

    /**
     *修改头像
     *{"image":"oss头像url"}
     */
    postSettingModifyUserImage: (data) => post(`${_prefix}/setting/modify_user_image`, data),

    /**
     *kyc实名认证
     *{"name":null,"id_number":null,"type":"IDENTITY=身份证,PASSPORT=护照"}
     */
    postSettingKycAuthName: (data) => post(`${_prefix}/setting/kyc/auth_name`, data),

    /**
     *获取kyc信息
     */
    getSettingKycInfo: (data) => get(`${_prefix}/setting/kyc_info`),

    /**
     *修改昵称
     *{"nickname":"nickname"}
     */
    postSettingModifyNickname: (data) => post(`${_prefix}/setting/modify_nickname`, data),

    /**
     *设置【更新】支付方式
     *{"email_captcha":"","phone_captcha":"","ga_captcha":"","name":"","bank_name":"","bank_branch_name":"","account_no":"银行卡账号、支付宝账号、微信账号","type":"BANK=银行卡，ALIPAY=支付宝，WECHAT=微信支付","image":"二维码图片地址"}
     */
    postSettingSetPayType: (data) => post(`${_prefix}/setting/set_pay_type`, data),

    /**
     *设置账号
     *{"account":"zhang_san"}
     */
    postSettingSetAccount: (data) => post(`${_prefix}/setting/set_account`, data),

    /**
     *用户基本信息
     *安全等级：L=low,M=middle,H=high; 性别：man,woman, auth_name=是否实名认证
     */
    getSettingUserBaseInfo: (data) => get(`${_prefix}/setting/user_base_info`),

};

export default request;