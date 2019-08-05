const host = window.location.host

const isHttp = window.location.protocol === 'http:'

export default {

    // 自选币
    _favorites: 'favorites',

    // 委托列表 & 成交记录
    _orders_key: 'orders_key',
    _my_orders: 'my_orders',
    _finish_orders: 'finish_orders',

    // k线 & 介绍
    _main_pad: 'main_pad',
    _pad_kline: 'pad_kline',
    _pad_desc: 'pad_desc',

    // k线版 & 简版
    _mode_key: 'mode_key',
    _mode_kline: 'mode_kline',
    _mode_simple: 'mode_simple',

    // 现价交易 & 市价交易
    _trade_key: 'trade_key',
    _trade_limit: 'trade_limit',
    _trade_market: 'trade_market',

    // 买入 & 卖出
    _trade_type: 'trade_type',
    _trade_buy: 'trade_buy',
    _trade_sell: 'trade_sell',

    // 交易类型
    BUY_LIMIT: 'BUY_LIMIT',
    SELL_LIMIT: 'SELL_LIMIT',
    BUY_MARKET: 'BUY_MARKET',
    SELL_MARKET: 'SELL_MARKET',

    // 最近成交显示条数
    _rencent_deals_count_limit: 50,

    // 买卖盘显示条数
    _current_orders_count_limit: 12,

    _max_deal_amount: 1000 * 10000,

    depthMenu: [{
        label: '8位小数',
        value: '0.00000001',
        decimal: 8,
    }, {
        label: '6位小数',
        value: '0.000001',
        decimal: 6,
    }, {
        label: '4位小数',
        value: '0.0001',
        decimal: 4,
    }, {
        label: '2位小数',
        value: '0.01',
        decimal: 2,
    }, {
        label: '1位整数',
        value: '1'
    }, {
        label: '十位整数',
        value: '10'
    }, {
        label: '百位整数',
        value: '100'
    }],

    intervalMap: {
        '1': '1min',
        '3': '3min',
        '5': '5min',
        '15': '15min',
        '30': '30min',
        '60': '1hour',
        '120': '2hour',
        '1D': '1day',
        '1W': '1week',
    },

    _socket_url: (isHttp ? 'ws://' : 'wss://') + host + '/matrix-evil/websocket/spot',

    _hash_url: 'https://tronscan.org/#/transaction/',

}