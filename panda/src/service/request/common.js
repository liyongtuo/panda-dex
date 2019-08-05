import { post, get } from '../method';

// import { url } from '../config';

const _prefix = `matrix-base`;

const request = {


    /**
     *根据api_key查该用户邀请信息
     */
    getCommonAccessInvitedInfo: (data) => get(`${_prefix}/common/access/invited_info?api_key=${data.api_key}`),

    /**
     *根据api_key查该用户基本信息
     */
    getCommonUserBaseInfo: (data) => get(`${_prefix}/common/user/base_info?api_key=${data.api_key}`),

    /**
     *发信息(sms、email)验证码
     *{"operate":"操作项，比如绑定手机号等","nvc":"demo中getNVCVal()","need_account":"true:根据type必须填入手机号或邮箱，false则为后台从数据库拿手机号或邮箱","area_code":"86","email":"hcd199004@qq.com","phone":"18614022073",,"type":"sms=短信，email=邮件"}
     */
    postCommonAccessCaptchaSendMessage: (data) => post(`${_prefix}/common/access/captcha/send_message`, data),

    /**
     *发信息(sms、email)验证码
     *{"need_account":"true:根据type必须填入手机号或邮箱，false则为后台从数据库拿手机号或邮箱","area_code":"86","email":"hcd199004@qq.com","phone":"18614022073",,"type":"sms=短信，email=邮件"}
     */
    postCommonAccessSendMessage: (data) => post(`${_prefix}/common/access/send_message`, data),

    /**
     *图片验证码
     *图片验证码有效期是两分钟，有图片验证码的地方都调这个接口
     */
    getCommonAccessCaptcha: (data) => get(`${_prefix}/common/access/base64/captcha`),

    /**
     *quadrant支持的所有币种
     */
    getCommonAccessCoins: (data) => get(`${_prefix}/common/access/coins`),

    /**
     *检查验证码或支付密码
     *{"captcha":null,"email":null,"pay_pwd":null,"phone":null,"type":"phone, email, pay_pwd"}
     */
    postCommonCheckCaptchaPwd: (data) => post(`${_prefix}/common/check/captcha_pwd`, data),

    /**
     * 埋点
     */
    postCommonAccessClickEvent: (data) => post(`${_prefix}/common/access/click_event`, data),

    /**
     * 图片验证码
     */
    getCaptcha: () => get(`${_prefix}/common/access/captcha`),

    /**
     * banner 公告
     */
    postCommonAccessBannerNotice: () => post(`${_prefix}/common/access/banner_notice`)

};

export default request;