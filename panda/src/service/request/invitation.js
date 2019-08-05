import { get, post } from '../method';

import { url } from '../config';

const prefix = `${url}/base/api`;

const invite = `/matrix-base/invite`;

const request = {

	// 邀请
    invitation: (data) => get(`${prefix}/invitation_info`, data),

    // 邀请排行
    getInviteBoard: () => get(`${invite}/board`),

    // 我的奖励
    getInviteMyAward: () => get(`${invite}/my_award`),

    // 邀请方式
    getInviteType: () => get(`${invite}/type`),

    // 邀请排行
    postInviteWithdraw: (data) => post(`${invite}/withdrawal`, data),

    // wx config
    getWxConfig: () => get(`${invite}/wx`),
    
};

export default request;