import { getWithToken, postWithToken } from '../method';

import { url } from '../config';

const prefix = `${url}/trade/cnyt`;

const request = {

    // 转账流水
    cnytPipeline: (data) => getWithToken(`${prefix}/pipeline`, data),

    // 转账
    cnytTransfer: (data) => postWithToken(`${prefix}/transfer`, data)
};

export default request;