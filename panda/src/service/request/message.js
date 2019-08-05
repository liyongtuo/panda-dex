import { getWithToken, postWithToken } from '../method';

const [get, post] = [getWithToken, postWithToken];

const url = '/matrix-message';

const request = {

    // 获取未读消息条数
    getMessageNoticeCount: (api_key) => get(`${url}/station/access/notice_count?api_key=${api_key}`),

    // 获取订单消息
    getMessageP2P: (api_key) => get(`${url}/station/access/p2p/get_notices?api_key=${api_key}`),

    // 获取系统消息
    getMessageSystem: (api_key) => get(`${url}/station/access/system/get_notices?api_key=${api_key}`),

    // 标记已读
    postMessageReadNotive: (data) => post(`${url}/station/assess/read_notice`, data),

    // 即时消息
    getImmediateNotice: (api_key) => get(`${url}/station/access/immediate_notice?api_key=${api_key}`),

};

export default request;
