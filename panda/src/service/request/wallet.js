import { get, post } from '../method';

import { url } from '../config';

const _prefix = `${url}/matrix-base/wallet`;

const request = {

    /**
     *获取充币地址
     */
    getWalletAddress: (data) => get(`${_prefix}/deposit/address`, data),

    /**
     *获取充币历史地址
     */
    getWalletHistoryAddress: (data) => get(`${_prefix}/deposit/history_address`, data),

    /**
     *绑定提现地址
     */
    postWalletBindWithdrawalAddress: (data) => post(`${_prefix}/bind_withdrawal/address`, data),

    /**
     *资金划转
     */
    postWalletAssetTransfer: (data) => post(`${_prefix}/asset_transfer`, data),

    /**
     *提现
     */
    postWalletWithdrawal: (data) => post(`${_prefix}/withdrawal`, data),

    /**
     *充值记录
     */
    getWalletDepositPipeline: (data) => get(`${_prefix}/deposit_pipeline`, data),

     /**
     *充值记录
     */
    getWalletDepositPipelines: (data) => get(`${_prefix}/deposit_pipelines`, data),

    /**
     *提现记录(带参)
     */
    getWalletWithdrawalPipeline: (data) => get(`${_prefix}/withdrawal_pipeline`, data),

    /**
     *提现记录
     */
    getWalletWithdrawalPipelines: (data) => get(`${_prefix}/withdrawal_pipelines`, data),

    /**
     * 历史提币地址
     */
    getWalletWithdrawalHistory: (data) => get(`${_prefix}/withdrawal/history_address`, data),

    /**
     * 法币账户
     */
    getWalletFiat: () => get(`${_prefix}/fiat`),

    /**
     * 我的资产
     */
    getWalletMyAssets: () => get(`${_prefix}/my_assets`),

    /**
     * matrix平台支持的资产
     */
    getWalletAssets: () => get(`${_prefix}/assets`),

    /**
     * 我的钱包
     */
    getWalletMyWallet: () => get(`${_prefix}/wallet`),

    /**
     * 我的钱包-交易流水
     */
    getWalletMyWalletPipeline: (data) => get(`${_prefix}/wallet/pipeline`, data),

    /**
     * 我的钱包 - 两个值
     */
    getOtcListSellBuy: () => get(`/matrix-otc/list/common/sell_buy`)
};

export default request;
