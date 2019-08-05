import { getWithToken, postWithToken } from '../method';

const [get] = [getWithToken, postWithToken];

const url = '/data-center';

const request = {

    // 实时币价
    getMarketAssetsPrice: () => get(`${url}/access/market/assets/price`)

};

export default request;
