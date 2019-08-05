import * as actionsTypes from './actionsTypes';

export const setIsMobile = (data) => ({ type: actionsTypes.MOBILE, data: data });

export const setInfo = (data) => ({ type: actionsTypes.INFO, data: data });

export const setLogin = (data) => ({ type: actionsTypes.LOGIN, data: data });

export const setDetail = (data) => ({ type: actionsTypes.DETAIL, data: data });

export const setChart = (data) => ({ type: actionsTypes.CHART, data: data });

export const setLatest = (data) => ({ type: actionsTypes.LATEST, data: data });

export const setOrders = (data) => ({ type: actionsTypes.ORDERS, data: data });

export const setBaseInfo = (data) => ({ type: actionsTypes.BASEINFO, data: data });

export const setKycInfo = (data) => ({ type: actionsTypes.KYCINFO, data: data });

export const setSafetyInfo = (data) => ({ type: actionsTypes.SAFETYINFO, data: data });

export const setAssets = (data, coin) => ({ type: actionsTypes.ASSET, data: data, coin: coin });

export const setAssetsType = (data) => ({ type: actionsTypes.ASSET_TYPE, data: data });

export const setMessageCount = (data) => ({ type: actionsTypes.MESSAGECOUNT, data: data });

export const setMessageSys = (data) => ({ type: actionsTypes.MESSAGESYS, data: data });

export const setMessageP2p = (data) => ({ type: actionsTypes.MESSAGEP2P, data: data });