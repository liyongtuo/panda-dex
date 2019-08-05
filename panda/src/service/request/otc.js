import { getWithToken, postWithToken } from '../method';

const [get, post] = [getWithToken, postWithToken];

const url = '/matrix-otc';

const request = {

    // 新增订单
    postAddOrder: (data) => post(`${url}/add_order`, data),

    // 新增子订单
    postAddTrade: (data) => post(`${url}/add_trade`, data),

    // 币种信息
    getCoinInfo: (coin) => get(`${url}/access/coin_info?coin=${coin}`),

    // 确认收款
    postConfirmCollection: (data) => post(`${url}/confirm_collection`, data),

    // 取消交易
    postCancelTrade: (data) => post(`${url}/cancel_trade`, data),

    // 确认付款
    postConfirmPayment: (data) => post(`${url}/confirm_payment`, data),

    // 暂停接单
    postPauseOrder: (data) => post(`${url}/list/pause_order`, data),

    // 继续接单
    postContinueOrder: (data) => post(`${url}/list/continue_order`, data),

    // 修改订单
    postModifyOrder: (data) => post(`${url}/list/modify_order`, data),

    // 撤销订单
    postCancelOrder: (data) => post(`${url}/list/cancel_order`, data),

    // 最近成交
    getLatestTrade: () => get(`${url}/access/latest_trade`),

    // 订单列表
    getOrderList: (data) => get(`${url}/access/order_list`, data),

    // 支持的otc列表
    getOtcList: () => get(`${url}/access/enable_list`),

    // 预下单
    postPreAddTrade: (data) => post(`${url}/pre_add_trade`, data),

    // 币种分时图
    getSharingPlans: (coin, type) => get(`${url}/access/sharing_plans?coin=${coin}&type=${type}`),

    // 订单详情
    getOrderDetails: (oid) => get(`${url}/access/order_details?oid=${oid}`),

    // 获取今日取消次数
    getCancelCount: (oid) => get(`${url}/cancel_count?oid=${oid}`),

    // 子订单详情
    getTradeDetails: (tid) => get(`${url}/trade_details?tid=${tid}`),

    // 刷新预下单价格锁定时间
    postUpdatePreTrade: (data) => post(`${url}/update_pre_trade`, data),

    // 我的交易订单
    getListMyTrade: (data) => get(`${url}/list/my_trade`, data),

    // 我的交易统计
    getMyTradeStat: () => get(`${url}/list/my_trade_stat`),

    // 我的委托单
    getListMyOrder: (data) => get(`${url}/list/my_order`, data),

    // 委托单详情
    getMyOrderDetail: (data) => get(`${url}/list/order_details?oid=${data.oid}`),

    // 获取聊天
    getGetNotice: (tid) => get(`${url}/get_notice?tid=${tid}`),

    // 获取未读消息条数
    postAddNotice: (data) => post(`${url}/add_notice`, data),

};

export default request;
