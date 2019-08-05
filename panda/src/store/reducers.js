import { combineReducers } from 'redux';
import * as actionsTypes from './actionsTypes';

const coins = ['BTC', 'ETH', 'USDT', 'TRX', 'VENA', 'BTT'];

function handleCoin(data) {
    const _res = {};
    data.forEach(item => {
        _res[item] = {
            price: '0',
            walletAvailable: 0,
            walletFrozen: 0,
            walletValue: 0,
            fiatAvailable: 0,
            fiatFrozen: 0,
            spotAvailable: 0,
            spotFrozen: 0,
        }
    });

    return _res
}

function handleAssets(data) {
    const _res = [];
    data.forEach(item => {
        _res.push({
            asset: item,
            available: 0, frozen: 0
        })
    });

    return _res
}

let init = {
    tradingPairs: [],
    userInfo: {
        pay_info: {
            payment_type: '000'
        }
    },
    isMobile: window.innerWidth <= 900,
    coinPrice: {},
    login: false,
    coin: handleCoin(coins),
    detail: {},
    latest: [],
    orders: [],
    chart: [],
    asset: {
        fiat: {},
        total_asset: {},
        wallet: {},
        spot: {},
        fiat_detail: handleAssets(coins),
        wallet_detail: handleAssets(coins),
        spot_detail: handleAssets(coins),
    },
    baseInfo: {},
    kycInfo: {},
    safetyInfo: {},
    messageCount: 0,
    messageSys: [],
    messageP2p: [],
    coinList: coins,
    coinInfo: []
};

export default combineReducers({
    dataX: (state = { ...init }, action) => {
        switch (action.type) {
            case actionsTypes.MOBILE:
                return { ...state, isMobile: action.data };
            case actionsTypes.INFO:
                return { ...state, userInfo: action.data };
            case actionsTypes.BASEINFO:
                return { ...state, baseInfo: action.data };
            case actionsTypes.KYCINFO:
                return { ...state, kycInfo: action.data };
            case actionsTypes.SAFETYINFO:
                return { ...state, safetyInfo: action.data };
            case actionsTypes.LOGIN:
                if (action.data) {
                    return { ...state, login: action.data };
                } else {
                    let _temp = state.coin;
                    coins.forEach(item => {
                        _temp[item].fiatAvailable = 0;
                        _temp[item].fiatFrozen = 0;
                        _temp[item].walletAvailable = 0;
                        _temp[item].walletFrozen = 0;
                    });

                    return { ...state, login: action.data, coin: _temp, userInfo: {} };
                }
            case actionsTypes.DETAIL:
                return { ...state, detail: action.data };
            case actionsTypes.CHART:
                return { ...state, chart: action.data };
            case actionsTypes.LATEST:
                return { ...state, latest: action.data };
            case actionsTypes.ORDERS:
                return { ...state, orders: action.data };
            case actionsTypes.MESSAGECOUNT:
                return { ...state, messageCount: action.data };
            case actionsTypes.MESSAGESYS:
                return { ...state, messageSys: action.data };
            case actionsTypes.MESSAGEP2P:
                return { ...state, messageP2p: action.data };
            case actionsTypes.ASSET:
                let _temp = state.coin;

                if (action.coin === 'asset') {
                    action.data.fiat_detail.forEach(item => {
                        if (!_temp[item.asset]) _temp[item.asset] = {};
                        _temp[item.asset].fiatAvailable = item.available;
                        _temp[item.asset].fiatFrozen = item.frozen;
                    });

                    action.data.spot_detail.forEach(item => {
                        if (!_temp[item.asset]) _temp[item.asset] = {};
                        _temp[item.asset].spotAvailable = item.available;
                        _temp[item.asset].spotFrozen = item.frozen;
                    });

                    action.data.wallet_detail.forEach(item => {
                        if (!_temp[item.asset]) _temp[item.asset] = {};
                        _temp[item.asset].walletAvailable = item.available;
                        _temp[item.asset].walletFrozen = item.frozen;
                        _temp[item.asset].walletValue = item.value;
                    });
                }

                if (action.coin === 'price') {
                    action.data.forEach(item => {
                        _temp[item.asset] = _temp[item.asset] || {};
                        _temp[item.asset].price = item.price;
                    })
                }

                return { ...state, asset: { ...state.asset, ...action.data }, coin: _temp };
            case actionsTypes.ASSET_TYPE:
                const _list = [];
                action.data.forEach(item => {
                    if (!item.locked) _list.push(item.asset)
                });
                return {
                    ...state,
                    coinInfo: action.data,
                    coinList: _list
                };
            default:
                return state;
        }
    }
});
