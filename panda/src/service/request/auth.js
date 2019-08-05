import { post, get } from '../method';

const _prefix = `/matrix-base`;

const request = {

	/**
	 *重置密码
	 *{"password":"密码"}
	 */
	postAuthAccessReset: (data) => post(`${_prefix}/auth/access/reset`, data),

	/**
	 *登录
	 *{"account":"[账号、手机号、邮箱]","password":"密码","captcha":"验证码，code为AUTH_LOGIN_ACCOUNT_PWD_EXCEPTION_NEED_CAPTCHA时下一次请求需要验证码，前三次不需要"}
	 */
	postAuthAccessLogin: (data) => post(`${_prefix}/auth/access/login`, data),


	/**
	 *登录二次验证
	 *type=ga,sms,email
	 */
	getAuthAccessLoginSecond: (data) => get(`${_prefix}/auth/access/login_second?captcha=${data.captcha}&type=${data.type}`),


	/**
	 *登录信息
	 */
	getAuthLoginInfo: (data) => get(`${_prefix}/auth/login_info`),

	/**
	 *注册
	 *{"account":"[账号、手机号、邮箱]","password":"密码","captcha":"短信或邮箱验证码","invitation_code":"邀请码[非必填]"}
	 */
	postAuthAccessRegister: (data) => post(`${_prefix}/auth/access/register`, data),

	/**
	 *重置密码确认身份
	 *{"account":null,"captcha":null,"picture_captcha":null}
	 */
	postAuthAccessConfirmIdentity: (data) => post(`${_prefix}/auth/access/confirm_identity`, data),

	/**
	 *重置密码发送信息
	 *{"account":null}
	 */
	postAuthAccessRestSendMessage: (data) => post(`${_prefix}/auth/access/rest/send_message`, data),

    /**
	 * 登出
     */
	getAuthLogout: () => get(`${_prefix}/auth/logout`)
};

export default request;