import index from './request/index';
import otc from './request/otc';
import wallet from './request/wallet';
import news from './request/news';
import auth from './request/auth';
import noauth from './request/NoAuth';
import invitation from './request/invitation';
import cnyt from './request/cnyt';
import common from './request/common';
import setting from './request/setting';
import finance from './request/finance';
import dataCenter from './request/data-center';
import message from './request/message';
import spot from './request/spot';

const request = Object.assign(
    {},
    common,
    index,
    otc,
    wallet,
    news,
    auth,
    noauth,
    invitation,
    cnyt,
    finance,
    setting,
    dataCenter,
    message,
    spot
);

export default request;
