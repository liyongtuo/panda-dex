import { post, get } from '../method';

// import { url } from '../config';/

const _prefix = '/matrix-evil';

let request = {


    //---------------------------------------Market Api Controller---------------------------------------

    /**
     *获取用户自选合约
     *获取用户自选合约
     */
    getApiMarketV1Optionals: (data) => get(`${_prefix}/api/market/v1/optionals`),

    /**
     *获取所有交易对ticker信息
     *获取所有交易对ticker信息
     */
    getApiMarketV1AccessTickers: (data) => get(`${_prefix}/api/market/v1/access/tickers`),

    /**
     *添加自选
     */
    getApiMarketV1AddOptional: (data) => get(`${_prefix}/api/market/v1/addOptional`, data),


    /**
     *取消自选
     */
    getApiMarketV1CancelOptional: (data) => get(`${_prefix}/api/market/v1/cancelOptional`, data),

    /**
     *获取所有交易对信息的接口
     *获取所有交易对信息
     */
    getApiMarketV1AccessProducts: (data) => get(`${_prefix}/api/market/v1/access/products`),



    //---------------------------------------Order Api Controller---------------------------------------


    /**
     *下单接口
     *下单指令目前为止分为四类（BUY_LIMIT SELL_LIMIT  BUY_MARKET  SELL_MARKET）
     */
    postApiOrderV1CreateOrder: (data) => post(`${_prefix}/api/order/v1/create_order`, data),

    /**
     *下单接口（不需要验证）
     *下单指令目前为止分为两类（限价指令，市价指令）
     */
    postApiOrderV1TmpCreateOrder: (data) => post(`${_prefix}/api/order/v1/tmp/create_order`, data),

    /**
    * 历史订单
    */
    getApiOrderV1HistoryOrderList: (data) => get(`${_prefix}/api/order/v1/history_order_list`, data),


    /**
     * 获取订单详情
     */
    getApiOrderOrdersMatches: (data) => get(`${_prefix}/api/order/orders/matches`, data),


    /**
     *getOrderRecord
     */
    getApiOrderV1OrderRecord: (data) => get(`${_prefix}/api/order/v1/order_record`),

    /**
     *取消订单接口(暂时不要用)
     *传入订单ID，市价单不允许撤销
     */
    getApiOrderV1OrdersCancel: (data) => get(`${_prefix}/api/order/v1/orders/cancel`, data),

    /**
     *委托列表
     *个人委托列表
     */
    getApiOrderV1UnfullfillOrderList: (data) => get(`${_prefix}/api/order/v1/unfullfill_order_list`),


    /**
     * 限制条件
     */
    getApiMarketV1AccessSymbolLimit: (data) => get(`${_prefix}/api/market/v1/access/symbol_limit`, data),

    /**
     * 订单条件查询
     */
    postApiOrderV1Orders: (data) => post(`${_prefix}/api/order/v1/orders`, data),

    //---------------------------------------Balance Controller---------------------------------------


    /**
     *获取账户信息(临时)
     *获取用户账户信息(临时)
     */
    getApiBalanceV1TmpAccountsInfo: (data) => get(`${_prefix}/api/balance/v1/tmp/accounts_info`),

    /**
     *获取账户信息
     *获取用户账户信息
     */
    getApiBalanceV1AccountsInfo: (data) => get(`${_prefix}/api/balance/v1/accounts_info`),



    //---------------------------------------K Line Controller---------------------------------------


    /**
     *getKLine
     */
    getApiKlineList: (data) => get(`${_prefix}/api/kline/v1/access/list?size=${data.size}&symbol=${data.symbol}&type=${data.type}`),

    /**
     *  k线历史数据
     */
    postApiKlineV1AccessSymbolList: (data) => post(`${_prefix}/api/kline/v1/access/symbol/list`, data),

}
export default request;