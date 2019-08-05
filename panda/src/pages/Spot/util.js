import accounting from 'accounting';
import pako from 'pako';
import { message } from 'antd';
import { Modal } from '../../components';
import BigNumber from 'bignumber.js';
// import emitter from '@/util/events';

export default function () {
    return {

        getFunctionSelector: abi => {
            return abi.name + '(' + this.getParamTypes(abi.inputs || []).join(',') + ')';
        },

        getParamTypes: params => {
            return params.map(({ type }) => type);
        },

        showLoginModal: () => {
            Modal.login({
                onSuccess: () => {
                    this.getLoginInfo()
                    this.props.setLogin(true)
                }
            })
        },

        // 获取数字小数部分的位数
        getDecimalDigits: (text) => {
            if (!text) {
                return 0
            }
            const textTemp = text.toString()
            if (textTemp.indexOf('.') > -1) {
                const splits = textTemp.split('.')
                return splits[splits.length - 1].length
            } else {
                return 0
            }
        },

        // 返回字符串中数字部分
        getNumber: (text, limit) => {
            const numText = text.replace(/[^\d]/g, '')
            if (limit && numText.length > limit) {
                return numText.substr(0, limit)
            } else {
                return numText
            }
        },

        // 格式化数字 添加逗号分位
        formatToNum: (text, limit) => {
            text = text.toString()
            if (text.indexOf('.') > -1) {
                const splits = text.split('.')
                if (limit === 0) {
                    return this.formatNumber(splits[0])
                }
                return this.formatNumber(splits[0]) + '.' + this.getNumber(splits[1], limit)
            } else {
                if (!/[\d]+/.test(text)) {
                    return ''
                }
                return this.formatNumber(text)
            }
        },

        formatPercent: (change, text) => {
            if (!text) return '+0.00%'
            return (parseFloat(change) >= 0 ? '+' : '') + text
        },

        getTokenBySymbol: (symbol) => {
            const token = symbol.split('_')[0] || '--'
            return token
        },

        getPriceBySymbol: (symbol) => {
            const price = symbol.split('_')[1] || '--'
            return price
        },

        formatNumber: (text) => {
            // return parseFloat(text)
            let amount = accounting.formatNumber(parseFloat(accounting.unformat(text)))
            amount = accounting.unformat(amount)
            return amount
        },

        unformatNumber: (text) => {
            return accounting.unformat(text)
        },

        // 获取当前交易对中交易币
        getCurrentToken: (pair) => {
            if (pair) {
                return pair.split('_')[0].toUpperCase()
            }
            if (this.currentPair) {
                return this.currentPair.split('_')[0].toUpperCase()
            } else {
                return '-'
            }
        },

        // 获取当前交易对中价格币
        getCurrentPrice: () => {
            if (this.currentPair) {
                return this.currentPair.split('_')[1].toUpperCase()
            } else {
                return '-'
            }
        },

        // 解压 websocket 数据
        ungzip: (zipData) => {
            return new Promise((resolve, reject) => {
                try {
                    const strData = atob(zipData)
                    const charData = strData.split('').map(v => v.charCodeAt(0))
                    const binData = new Uint8Array(charData)
                    const data = pako.inflate(binData);
                    const unZipData = String.fromCharCode.apply(null, new Uint16Array(data))
                    resolve(unZipData)
                } catch (e) {
                    reject(e)
                }
            })
        },

        // 统一处理请求错误
        handleSpotError: (res) => {
            try {
                if (res.error) {
                    if (res.error.code && res.error.code === 'AUTH_NOT_LOGIN') {
                        this.props.setLogin(false)
                        return
                    }
                    if (res.error.message)
                        message.error(res.error.message, 1)
                } else if (res.response_msg) {
                    message.error(res.response_msg, 1)
                }
            } catch (e) {
                console.log('解析错误信息失败', e)
            }
        },

        // 计算 总额
        getTotalAmount: (price, amount, decimal) => {
            const total = new BigNumber(this.unformatNumber(price))
                .multipliedBy(this.unformatNumber(amount))
                .decimalPlaces(decimal, BigNumber.ROUND_CEIL)
                .toString()
            return total
        },

        // 计算 数量
        getAmountByTotal: (total, price, decimal) => {
            if (!price) return 0
            const amount = (this.unformatNumber(total) / price)
            const amountFixed = amount.toFixed(decimal)
            return amountFixed
        },

        getMiningByTotal: (total, efficiency, decimal) => {
            const mining = new BigNumber(this.unformatNumber(total))
                .dividedBy(efficiency)
                .decimalPlaces(decimal, BigNumber.ROUND_DOWN)
                .toNumber()
            return mining || 0
        },

        delay: (ms) => {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve()
                }, ms);
            })
        },

        // 构建 trx10 转账签名
        signTransaction: async (amount, token) => {
            console.log('token', token)
            console.log('total', amount)
            let tronWeb = window.tronWeb;
            console.log(this)
            const currency = this.currenciesMap[token]
            console.log('currency', currency)
            if (currency.type === 2) {
                console.log('trc20')
                return await this.signTrx20Transaction(amount, token)
            }
            let transaction = {}
            if (token === 'TRX') {
                console.log(this.officialAccount, amount)
                transaction = await tronWeb.transactionBuilder.sendTrx(this.officialAccount, tronWeb.toSun(amount))
            } else {
                console.log(this.officialAccount, amount, currency.name, currency.tokenId)
                transaction = await tronWeb.transactionBuilder.sendToken(this.officialAccount, new BigNumber(amount).multipliedBy(10 ** currency.tokenDecimals).toNumber(), currency.tokenId.toString())
            }
            console.log('transaction', transaction)
            const signature = await tronWeb.trx.sign(transaction)
            console.log('signature', signature)
            return signature
        },

        // 构造 trx20 转账签名
        signTrx20Transaction: (amount, token) => {
            let tronWeb = window.tronWeb;
            const currency = this.currenciesMap[token]
            const info = JSON.parse(currency.contractInfo)
            this.abi = info.abi.entrys
            let abiTransfer = this.abi.find(el => el.name === 'transfer');
            let functionSelector = this.getFunctionSelector(abiTransfer);

            // to and amount
            let args = [this.officialAccount, new BigNumber(amount).multipliedBy(10 ** currency.tokenDecimals).toNumber()];
            const types = this.getParamTypes(abiTransfer.inputs || []);
            args.forEach((arg, index) => {
                if (types[index] === 'address')
                    args[index] = tronWeb.address.toHex(arg).replace(/^(41)/, '0x')

                if (types[index] === 'address[]') {
                    args[index] = args[index].map(address => {
                        return tronWeb.address.toHex(address).replace(/^(41)/, '0x')
                    })
                }
            });
            const parameters = args.map((value, index) => ({
                type: types[index],
                value
            }));
            console.log(functionSelector, parameters)
            //1. construction
            return tronWeb.transactionBuilder.triggerSmartContract(
                currency.tokenContractAddress,
                functionSelector,
                1000000000,
                0,
                parameters,
                tronWeb.defaultAddress.base58
            )
                .then(res => {
                    return res.transaction;
                })
                .then(tx => {
                    // 2. sign
                    return tronWeb.trx.sign(tx)
                })
        },

        tokenApproval: async (spender, value, currency) => {
            let tronWeb = window.tronWeb;

            const info = JSON.parse(currency.contractInfo)
            const abi = info.abi.entrys
            let abiApproval = abi.find(el => el.name === 'approve');
            let functionSelector = this.getFunctionSelector(abiApproval);
            const types = this.getParamTypes(abiApproval.inputs || []);
            let args = [
                tronWeb.address.toHex(spender).replace(/^()41/, '0x'),
                value,
            ]
            const parameters = args.map((value, index) => ({
                type: types[index],
                value
            }));
            console.log(functionSelector, parameters)
            await tronWeb.transactionBuilder.triggerSmartContract(
                currency.tokenContractAddress,
                functionSelector,
                1000000000,
                0,
                parameters,
                tronWeb.defaultAddress.base58
            )
                .then(res => res.transaction)
                .then(tx => tronWeb.trx.sign(tx))
                .then(tx => tronWeb.trx.sendRawTransaction(tx))
        }

    }
}
