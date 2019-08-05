import config from './config';
import { Toast } from '@/components';
// import { message } from 'antd';
// import intl from 'react-intl-universal';
// import BigNumber from 'bignumber.js';
// import emitter from '../../util/events';

export default function () {

    return {

        // iframe 加载完成回调
        // onFrameLoad: async () => {
        //     emitter.addListener('addKline', this.onAddKline)
        //     emitter.addListener('removeKline', this.onRemoveKline)
        // },
        //
        // onAddKline: (period) => {
        //     this.subscribe({ event: 'addChannel', channel: `quo.${this.currentPair}.kline.${period}` })
        // },
        //
        // onRemoveKline: (period) => {
        //     this.subscribe({ event: 'removeChannel', channel: `quo.${this.currentPair}.kline.${period}` })
        // },

        onH5Load: async () => {
            // await this.getMarketProducts()
            // await this.getMarketTickers()
            // this.openWebSocket()
            // this.resetLoading()
        },

        // 发起 socket 请求
        // openWebSocket: () => {
        //     if (!this.ws) {
        //         this.ws = new WebSocket(config._socket_url)
        //     }
        //     this.ws.onopen = (evt) => {
        //         this.pingInterval = setInterval(() => {
        //             this.ws.send("{'event':'ping'}");
        //         }, 10000)
        //         this.onFrameLoad()
        //         setTimeout(() => {
        //             this.addSubscribe()
        //         }, 500);
        //         this.updateCurrentOrders({ bids: [], asks: [] })
        //     }
        //     this.ws.onmessage = (data) => {
        //         console.log(data.data)
        //         if (data.data instanceof Blob) {
        //             const blob = data.data
        //             const reader = new FileReader()
        //             reader.readAsText(blob)
        //             reader.onload = (evt) => {
        //                 if (evt.target.readyState === FileReader.DONE) {
        //                     this.ungzip(evt.target.result)
        //                         .then(res => {
        //                             this.hnadleReciveData(JSON.parse(res))
        //                         })
        //                         .catch(err => {
        //                             console.log('解压失败', err)
        //                         })
        //                 }
        //             }
        //         } else {
        //
        //         }
        //     }
        //     this.ws.onerror = (err) => {
        //         this.pingInterval && clearInterval(this.pingInterval)
        //         console.log(err)
        //     }
        //     this.ws.onclose = (evt) => {
        //         this.pingInterval && clearInterval(this.pingInterval)
        //         setTimeout(() => {
        //             this.ws = null
        //             this.openWebSocket()
        //         }, 2000);
        //     }
        // },

        // 重置表单加载状态
        resetLoading: () => {
            setTimeout(() => {
                this.setState({
                    loading: {
                        ...this.state.loading,
                        recentDeals: false,
                        currentOrders: false,
                    }
                })
            }, 10000);
        },

        // 添加订阅
        addSubscribe: () => {
            //ws.send("{'event':'addChannel', 'channel':'ticker.all'}");
            this.subscribe({ event: 'addChannel', channel: `quo.${this.currentPair}.deal` })
            this.subscribe({ event: 'addChannel', channel: `quo.${this.currentPair}.depth`, bids: 20, asks: 20 })
            this.subscribe({ event: 'addChannel', channel: `quo.${this.currentPair}.ticker.detail` })
            this.resetLoading()
        },

        // 取消订阅
        removeSubscribe: () => {
            this.subscribe({ event: 'removeChannel', channel: `quo.${this.currentPair}.deal` })
            this.subscribe({ event: 'removeChannel', channel: `quo.${this.currentPair}.depth`, bids: 20, asks: 20 })
            this.subscribe({ event: 'removeChannel', channel: `quo.${this.currentPair}.ticker.detail` })
        },

        // 更新当前交易对
        updateCurrentTicker: (data) => {
            if (this.currentTicker.symbolName !== data.symbolName) return
            this.currentTicker = data
            // 更新交易对菜单
            const index = this.state.tickersList.findIndex(item => item.symbolName === this.currentPair)
            this.state.tickersList[index] = data
            // 更新买卖盘最新价格
            const currentOrdersList = [...this.state.currentOrdersList]
            const indexI = currentOrdersList.findIndex(item => item.id === 0)
            if (currentOrdersList[indexI]) {
                currentOrdersList[indexI].price = data.lastPrice
                currentOrdersList[indexI].amount = data.change
            }
            this.tickersMap = { ...this.tickersMap, [this.currentPair]: data }
            this.setState({
                currentTicker: data,
                currentOrdersList: currentOrdersList
            }, () => { this.updateTitle() })
        },

        // 更新最贱成交记录
        updateRecentDeal: (data) => {
            if (data.init) {
                this.setState({
                    recentDealList: []
                })
            }
            data = data.deals
            this.setState({ loading: { ...this.state.loading, recentDeals: false } })
            const dataList = data.map((item, index) => {
                return {
                    id: index,
                    time: item[1],
                    price: item[2],
                    amount: item[3],
                    type: item[4]
                }
            })
            const newList = [...dataList, ...this.state.recentDealList].sort((a, b) => b.time - a.time).splice(0, config._rencent_deals_count_limit)
            newList.forEach((item, index) => {
                item.key = index
            })
            this.setState({ recentDealList: newList })
        },

        // 切换深度、深度改变
        onDepthChange: () => {
            const depth = this.depthItem.value
            let sellOrders = this.mergeDepth(this.sellOrders, depth)
            let buyOrders = this.mergeDepth(this.buyOrders, depth)
            buyOrders.sort((a, b) => b.price - a.price)
            sellOrders.sort((a, b) => a.price - b.price)
            for (let i = 0; i < config._current_orders_count_limit; i++) {
                buyOrders.push({ price: '---', amount: '---' })
                sellOrders.push({ price: '---', amount: '---' })
            }
            buyOrders.forEach((buyItem, index) => {
                buyItem.id = index + 1
            })
            sellOrders.forEach((sellItem, index) => {
                sellItem.id = -(index + 1)
            })
            const newList = [
                ...sellOrders.splice(0, config._current_orders_count_limit).reverse(),
                {
                    id: 0,
                    price: this.currentTicker.lastPrice || 0,
                    amount: this.currentTicker.change
                },
                ...buyOrders.splice(0, config._current_orders_count_limit),
            ]
            newList.forEach((item) => {
                item.key = item.id.toString()
            })
            this.setState({ currentOrdersList: newList })
        },

        // 深度合并
        mergeDepth: (list, depth) => {
            const depthMap = new Map()
            list.forEach(item => {
                let price = 0
                if (parseFloat(depth) < 1) {
                    price = parseFloat(item.price.toFixed(this.getDecimalDigits(depth)))
                    if (item.type === 'SELL') {
                        if (price < item.price) {
                            price += parseFloat(depth)
                        }
                    } else {
                        if (price > item.price) {
                            price -= parseFloat(depth)
                        }
                    }
                } else {
                    price = parseInt(item.price / depth, 19) * depth
                    if (item.type === 'SELL') {
                        if (price < item.price) {
                            price += parseInt(depth, 19)
                        }
                    } else {
                        if (price > item.price) {
                            price -= parseInt(depth, 19)
                        }
                    }
                }
                if (depthMap.has(price)) {
                    depthMap.get(price).amount += item.amount
                } else {
                    depthMap.set(price, {
                        price: price,
                        amount: item.amount
                    })
                }
            })
            let depthList = []
            for (const item of depthMap) {
                depthList.push(item[1])
            }
            return depthList
        },

        // 更新买卖盘数据
        updateCurrentOrders: (data) => {
            console.log(data)
            // this.klineWindow && this.klineWindow.updateDepth(data)
            if (data.init) {
                this.sellOrders = new Map()
                this.buyOrders = new Map()
            }
            if (data.asks) {
                data.asks.forEach(item => {
                    if (item[1] === 0) {
                        this.sellOrders.delete(item[0])
                    } else {
                        this.sellOrders.set(item[0], {
                            price: item[0],
                            amount: item[1],
                            type: 'SELL'
                        })
                    }
                })
            }
            if (data.bids) {
                data.bids.forEach(item => {
                    if (item[1] === 0) {
                        this.buyOrders.delete(item[0])
                    } else {
                        this.buyOrders.set(item[0], {
                            price: item[0],
                            amount: item[1],
                            type: 'BUY'
                        })
                    }
                })
            }
            this.onDepthChange()
        },

        // 订阅数据
        subscribe: (params) => {
            this.ws.send(JSON.stringify(params))
        },

        // 更新委托列表或成交记录
        updateOrders: () => {
            if (this.state.ordersKey === config._my_orders) {
                this.getMyOrders(true)
            } else {
                this.getMyHistoryOrders(true)
            }
        },

        // 当前交易对改变
        // onCurrentPairChange: (currentPair) => {
        //     this.removeSubscribe()
        //     this.currentPair = currentPair
        //     this.getSymbolLimit(this.currentPair)
        //     emitter.emit('onSymbolChange', this.currentPair)
        //     this.currentTicker = this.tickersMap[currentPair]
        //     this.updateUrl()
        //     if (this.state.currentOnly) {
        //         this.updateOrders()
        //     }
        //     this.setState({
        //         currentPair,
        //         currentTicker: this.tickersMap[currentPair],
        //         currentOrdersList: [],
        //         recentDealList: [],
        //         buyError: '',
        //         sellError: '',
        //         form: {
        //             ...this.state.form,
        //             buyPrice: this.formatToNum(this.currentTicker.lastPrice.toString()),
        //             sellPrice: this.formatToNum(this.currentTicker.lastPrice.toString()),
        //             buyAmount: '',
        //             buyPercent: '',
        //             sellAmount: '',
        //             sellPercent: '',
        //         },
        //         loading: {
        //             ...this.state.loading,
        //             recentDeals: true,
        //             currentOrders: true,
        //         }
        //     }, () => {
        //         this.klineIframe && (this.klineIframe.src = this.klineIframe.src)
        //         this.addSubscribe()
        //         this.updateTitle()
        //     })
        // },

        // 更新路由
        updateUrl: () => {
            window.location.href = '#/spot?pair=' + this.currentPair
        },

        // 更新当前网页标题
        // updateTitle: () => {
        //     let title = ''
        //     title += this.currentTicker.lastPrice + ' '
        //     title += this.getCurrentToken() + '/'
        //     title += this.getCurrentPrice() + ' | '
        //     title += 'Matrix Market Global'
        //     document.title = title
        // },
        //
        // // 处理 ws 接收数据
        // hnadleReciveData: (data) => {
        //     const others = data.others
        //     console.log(data)
        //     const params = others.split('.')
        //     console.log(params)
        //     if (params[2] === 'kline') {
        //         console.log('收到消息->kline', data)
        //         if (data.data) {
        //             data.data.forEach(item => {
        //                 item[0] = item[0] * 1000
        //             })
        //             emitter.emit('onKline', data.data)
        //             // this.klineWindow && this.klineWindow.updateData(data.data)
        //         }
        //     } else if (params[2] === 'deal') {
        //         console.log('收到消息->deal', data)
        //         if (data.data && data.data.deals)
        //             this.updateRecentDeal(data.data)
        //     } else if (params[2] === 'depth') {
        //         console.log('收到消息->depth', data)
        //         if (data.data) {
        //             this.setState({ loading: { ...this.state.loading, currentOrders: false } })
        //             this.updateCurrentOrders(data.data)
        //         }
        //     } else if (params[2] === 'ticker') {
        //         console.log('收到消息->ticker', data)
        //         if (data.data)
        //             this.updateCurrentTicker(data.data)
        //     }
        // },
        //
        // // 获取账户信息
        // getAccountInfo: () => {
        //     this.balanceInterval = setInterval(() => {
        //         let { login } = this.props.dataX
        //         if (!login) return
        //         this.getAccountBalance()
        //     }, 2000);
        // },
        //
        // getAccountBalance: () => {
        //     Storage.Service.getApiBalanceV1AccountsInfo().then(res => {
        //         if (res.success === 'SUCCESS') {
        //             const assets = {}
        //             res.data.forEach(item => {
        //                 assets[item.currency.toUpperCase()] = item.available
        //             })
        //             this.setState({ assets })
        //         } else {
        //             this.handleSpotError(res)
        //         }
        //     })
        // },
        //
        // // 添加自选交易对
        // addFavorite: (pair) => {
        //     Storage.Service.getApiMarketV1AddOptional({ symbol: pair }).then(res => {
        //         if (res.success === 'SUCCESS') {
        //             this.state.favoritePairList.add(pair)
        //             this.setState({ favoritePairList: this.state.favoritePairList })
        //         } else {
        //             if (res.error.code && res.error.code === 'AUTH_NOT_LOGIN') {
        //                 message.info(intl.get('MAIN_118'))
        //             }
        //             this.handleSpotError(res)
        //         }
        //     })
        // },
        //
        // // 取消自选交易对
        // removeFavorite: (record) => {
        //     const id = this.products[record.symbolName].id
        //     Storage.Service.getApiMarketV1CancelOptional({ id }).then(res => {
        //         if (res.success === 'SUCCESS') {
        //             this.state.favoritePairList.delete(record.symbolName)
        //             this.setState({ favoritePairList: this.state.favoritePairList })
        //         } else {
        //             this.handleSpotError(res)
        //         }
        //     })
        // },
        //
        // // 获取用户自选交易对
        // getFavorites: () => {
        //     if (!this.productList) return
        //     Storage.Service.getApiMarketV1Optionals().then(res => {
        //         if (res.success === 'SUCCESS') {
        //             let products = {}
        //             let favoritePairList = new Set()
        //             this.productList.forEach(item => {
        //                 products[item.id] = item
        //             })
        //             res.data.forEach(id => {
        //                 if (products[id])
        //                     favoritePairList.add(products[id].symbolName)
        //             })
        //             this.setState({
        //                 favoritePairList
        //             })
        //         }
        //     })
        // },
        //
        // // 我的委托列表
        // getMyOrders: (loading) => {
        //     if (loading) {
        //         this.setState({ loading: { ...this.state.loading, myOrders: true } })
        //     }
        //     const data = {
        //         symbol: this.state.currentOnly ? this.currentPair : '',
        //         limit: 20,
        //     }
        //     Storage.Service.getApiOrderV1UnfullfillOrderList(data).then(res => {
        //         let { login } = this.props.dataX
        //         if (!login) {
        //             this.setState({ loading: { ...this.state.loading, myOrders: false } })
        //             return
        //         }
        //         if (res.success === 'SUCCESS') {
        //             this.setState({ myOrdersList: res.data }, () => {
        //                 if (loading) {
        //                     this.setState({ loading: { ...this.state.loading, myOrders: false } })
        //                 }
        //             })
        //         } else {
        //             if (loading) {
        //                 this.setState({ loading: { ...this.state.loading, myOrders: false } })
        //             }
        //         }
        //     })
        //         .catch(() => {
        //             this.setState({ loading: { ...this.state.loading, myOrders: false } })
        //         })
        // },
        //
        // // 获取订单详情
        // getOrderDetail: (id, limit) => {
        //     const data = {
        //         id,
        //         limit: limit || 20
        //     }
        //     Storage.Service.getApiOrderOrdersMatches(data).then(res => {
        //         this.state.expandedRowLoading.delete(id)
        //         if (res.success === 'SUCCESS') {
        //             this.state.expandedRowData[id] = res.data
        //         } else {
        //             this.handleSpotError(res)
        //         }
        //         this.setState({
        //             expandedRowData: this.state.expandedRowData,
        //             expandedRowLoading: this.state.expandedRowLoading
        //         })
        //     })
        // },
        //
        // getDetailH5: (id, limit) => {
        //     const data = {
        //         id,
        //         limit: limit || 50
        //     }
        //     this.setState({ detailLoading: true })
        //     Storage.Service.getApiOrderOrdersMatches(data).then(res => {
        //         this.setState({ detailLoading: false })
        //         if (res.success === 'SUCCESS') {
        //             this.setState({
        //                 orderDetail: res.data
        //             })
        //         } else {
        //             this.handleSpotError(res)
        //         }
        //     })
        // },
        //
        // // 我的成交记录
        // getMyHistoryOrders: (loading) => {
        //     if (loading) {
        //         this.setState({ loading: { ...this.state.loading, historyOrders: true } })
        //     }
        //     const data = {
        //         symbol: this.state.currentOnly ? this.currentPair : '',
        //         limit: 50,
        //     }
        //     Storage.Service.getApiOrderV1HistoryOrderList(data).then(res => {
        //         let { login } = this.props.dataX
        //         if (!login) {
        //             this.setState({ loading: { ...this.state.loading, historyOrders: false } })
        //             return
        //         }
        //         if (res.success === 'SUCCESS') {
        //             this.setState({ myHistoryOrdersList: res.data }, () => {
        //                 if (loading) {
        //                     this.setState({ loading: { ...this.state.loading, historyOrders: false } })
        //                 }
        //             })
        //         } else {
        //             if (loading) {
        //                 this.setState({ loading: { ...this.state.loading, historyOrders: false } })
        //             }
        //         }
        //     })
        //         .catch(() => {
        //             this.setState({ loading: { ...this.state.loading, historyOrders: false } })
        //         })
        // },
        //
        // getOrders: () => {
        //     if (this.props.dataX.login) {
        //         if (this.state.ordersKey === config._my_orders) {
        //             this.getMyOrders(true)
        //         } else {
        //             this.getMyHistoryOrders(true)
        //         }
        //     } else {
        //         this.setState({ loading: { ...this.state.loading, myOrders: false, historyOrders: false } })
        //     }
        //     this.ordersInterval = setInterval(() => {
        //         if (!this.props.dataX.login) return
        //         if (this.state.ordersKey === config._my_orders) {
        //             this.getMyOrders(false)
        //         } else {
        //             this.getMyHistoryOrders(false)
        //         }
        //     }, 3000);
        // },
        //
        // //获取所有交易对 ticker 信息
        // getMarketTickers: (main, init) => {
        //     // if (!init) {
        //     //     this.tickerInterval = setInterval(() => {
        //     //         this.getMarketTickers(true, true)
        //     //     }, 5000);
        //     // }
        //     if (main) {
        //         Storage.Service.getApiMarketV1AccessTickers().then(res => {
        //             try {
        //                 if (res.success === 'SUCCESS') {
        //                     res.data.forEach(item => {
        //                         this.tickersMap[item.symbolName] = item
        //                     })
        //                     this.setState({
        //                         tickersList: res.data,
        //                     })
        //                 }
        //             } catch (e) {
        //                 console.log(intl.get('MAIN_118'), e)
        //             }
        //         })
        //         return
        //     }
        //     return new Promise((resolve) => {
        //         Storage.Service.getApiMarketV1AccessTickers().then(res => {
        //             try {
        //                 if (res.success === 'SUCCESS') {
        //                     if (res.data.length === 0) {
        //                         console.log('tickers为空')
        //                     }
        //                     res.data.forEach(item => {
        //                         this.tickersMap[item.symbolName] = item
        //                     })
        //                     this.currentPair = this.currentPair || res.data[0].symbolName
        //                     this.getOrders()
        //                     this.getSymbolLimit(this.currentPair)
        //                     this.currentTicker = this.tickersMap[this.currentPair]
        //                     this.updateDepthItem()
        //                     this.updateUrl()
        //                     this.setState({
        //                         tickersList: Object.values(this.tickersMap),
        //                         currentPair: this.currentPair,
        //                         priceSelect: this.getCurrentPrice(),
        //                         currentTicker: this.currentTicker,
        //                         form: {
        //                             ...this.state.form,
        //                             buyPrice: this.formatToNum(this.currentTicker.lastPrice.toString()),
        //                             sellPrice: this.formatToNum(this.currentTicker.lastPrice.toString()),
        //                         }
        //                     }, () => { this.updateTitle() })
        //                     resolve()
        //                 } else {
        //                     this.handleSpotError(res)
        //                 }
        //             } catch (e) {
        //                 console.log('ticker 初始化失败', e)
        //             }
        //         })
        //     })
        // },
        //
        // getSymbolLimit: (symbol) => {
        //     Storage.Service.getApiMarketV1AccessSymbolLimit({ symbol }).then(res => {
        //         if (res.success === 'SUCCESS') {
        //             this.symbolLimit = res.data
        //         } else {
        //             this.handleSpotError(res)
        //         }
        //     })
        // },
        //
        // //更新深度菜单
        // updateDepthItem: () => {
        //     const depthDecimal = this.getDecimalDigits(this.currentTicker.lastPrice || 1)
        //     const depthMenuTemp = [...config.depthMenu]
        //     if (depthDecimal < 8) {
        //         if (depthDecimal >= 6) {
        //             depthMenuTemp.shift()
        //         } else if (depthDecimal >= 4) {
        //             depthMenuTemp.shift()
        //         } else if (depthDecimal >= 2) {
        //             depthMenuTemp.shift()
        //         }
        //     }
        //     this.depthItem = { ...depthMenuTemp[0] }
        //     this.setState({
        //         currentDepth: this.depthItem
        //     })
        // },
        //
        // //获取所有交易对规则信息
        // getMarketProducts: () => {
        //     return new Promise(resolve => {
        //         Storage.Service.getApiMarketV1AccessProducts().then(res => {
        //             if (res.success === 'SUCCESS') {
        //                 this.tickersMap = {}
        //                 this.productList = res.data
        //                 this.products = {}
        //                 const tokenSet = new Set()
        //                 res.data.forEach(item => {
        //                     this.products[item.symbolName] = item
        //
        //                     const symbol = item.symbolName
        //                     const symbols = symbol.split('_')
        //                     const price = symbols[1]
        //
        //                     tokenSet.add(price.toUpperCase())
        //
        //                     const ticker = {
        //                         change: '0',
        //                         changePercentage: '0%',
        //                         deal: 0,
        //                         highPrice: 0,
        //                         lastPrice: 0,
        //                         lowPrice: 0,
        //                         openPrice: 0,
        //                         symbolName: symbol,
        //                         volume: 0,
        //                     }
        //                     this.tickersMap[symbol] = ticker
        //                 })
        //                 this.setState({
        //                     tokenList: Array.from(tokenSet),
        //                     priceSelect: Array.from(tokenSet)[0],
        //                     products: this.products
        //                 })
        //                 this.getFavorites()
        //             }
        //             resolve()
        //         })
        //     })
        // },

        // canBeMined: (symbol) => {
        //     return this.state.products[symbol] ? this.state.products[symbol].isMining : false
        // },
        //
        // // 获取 k 线历史数据
        // getKlineData: () => {
        //     // 检测是否已经获取到 ticker
        //     if (!this.currentPair) return
        //     this.klineInit = true
        //     const data = {
        //         size: '2000',
        //         symbol: this.currentPair,
        //         type: this.period,
        //     }
        //     // this.klineWindow.showLoading()
        //     Storage.Service.getApiKlineList(data).then(res => {
        //         // this.klineWindow.hideLoading()
        //         if (res.success === 'SUCCESS') {
        //             res.data.forEach(item => {
        //                 item[0] = item[0] * 1000
        //             })
        //             // this.klineWindow.updateData(res.data, true)
        //         } else {
        //             this.handleSpotError(res)
        //         }
        //     })
        // },

        //限价买单
        // doLimitBuy: (total, balance) => {
        //     let { form, loading, tradeKey } = this.state
        //     let { symbolLimit } = this
        //
        //     const isLimit = tradeKey === config._trade_limit
        //
        //     if (total > balance) {
        //         this.setState({ buyError: this.getCurrentPrice() + intl.get('MAIN_126') })
        //         return
        //     }
        //     if (isLimit) {
        //         if (form.buyAmount > symbolLimit.limitOrderMustLessThan) {
        //             this.setState({ buyError: `${intl.get('MAIN_125_1')} ≤ ${symbolLimit.limitOrderMustLessThan} ${this.getCurrentToken()}` })
        //             return
        //         } else if (form.buyAmount < symbolLimit.limitOrderMustGreaterThan) {
        //             this.setState({ buyError: `${intl.get('MAIN_125_1')} ≥ ${symbolLimit.limitOrderMustGreaterThan} ${this.getCurrentToken()}` })
        //             return
        //         }
        //     } else {
        //         if (total > symbolLimit.marketBuyOrderMustLessThan) {
        //             this.setState({ buyError: `${intl.get('MAIN_125')} ≤ ${symbolLimit.marketBuyOrderMustLessThan} ${this.getCurrentPrice()}` })
        //             return
        //         } else if (total < symbolLimit.marketBuyOrderMustGreaterThan) {
        //             this.setState({ buyError: `${intl.get('MAIN_125')} ≥ ${symbolLimit.marketBuyOrderMustGreaterThan} ${this.getCurrentPrice()}` })
        //             return
        //         }
        //     }
        //
        //     const data = {
        //         amount: form.buyAmount,
        //         orderType: isLimit ? config.BUY_LIMIT : config.BUY_MARKET,
        //         price: isLimit ? form.buyPrice : form.buyAmount,
        //         symbol: this.currentPair,
        //     }
        //     this.setState({ loading: { ...loading, buy: true } })
        //     this.doCreateOrder(data).then(res => {
        //         this.setState({ loading: { ...loading, buy: false } })
        //         if (res.success === 'SUCCESS') {
        //             Toast.success('订单已发布')
        //         } else {
        //             this.handleSpotError(res)
        //         }
        //     })
        // },
        //
        // //限价卖单
        // doLimitSell: (total, balance) => {
        //
        //     let { form, loading, tradeKey } = this.state
        //     let { symbolLimit } = this
        //
        //     const isLimit = tradeKey === config._trade_limit
        //
        //     if (total > balance) {
        //         this.setState({ sellError: this.getCurrentToken() + intl.get('MAIN_126') })
        //         return
        //     }
        //     if (isLimit) {
        //         if (form.sellAmount > symbolLimit.limitOrderMustLessThan) {
        //             this.setState({ sellError: `${intl.get('MAIN_125_1')} ≤ ${symbolLimit.limitOrderMustLessThan} ${this.getCurrentToken()}` })
        //             return
        //         } else if (form.sellAmount < symbolLimit.limitOrderMustGreaterThan) {
        //             this.setState({ sellError: `${intl.get('MAIN_125_1')} ≥ ${symbolLimit.limitOrderMustGreaterThan} ${this.getCurrentToken()}` })
        //             return
        //         }
        //     } else {
        //         if (total > symbolLimit.marketSellOrderMustLessThan) {
        //             this.setState({ sellError: `${intl.get('MAIN_125')} ≤ ${symbolLimit.marketSellOrderMustLessThan} ${this.getCurrentPrice()}` })
        //             return
        //         } else if (total < symbolLimit.marketSellOrderMustGreaterThan) {
        //             this.setState({ sellError: `${intl.get('MAIN_125')} ≥ ${symbolLimit.marketSellOrderMustGreaterThan} ${this.getCurrentPrice()}` })
        //             return
        //         }
        //     }
        //
        //     const data = {
        //         amount: form.sellAmount,
        //         orderType: isLimit ? config.SELL_LIMIT : config.SELL_MARKET,
        //         price: isLimit ? form.sellPrice : form.sellAmount,
        //         symbol: this.currentPair,
        //     }
        //     this.setState({ loading: { ...loading, sell: true } })
        //     this.doCreateOrder(data).then(res => {
        //         this.setState({ loading: { ...loading, sell: false } })
        //         if (res.success === 'SUCCESS') {
        //             Toast.success('订单已发布')
        //         } else {
        //             this.handleSpotError(res)
        //         }
        //     })
        // },
        //
        //
        // // 撤销委托单
        // doCancelOrder: async (id) => {
        //     this.setState({ loading: { ...this.state.loading, myOrders: true } })
        //     try {
        //         Storage.Service.getApiOrderV1OrdersCancel({ id }).then(res => {
        //             if (res.success === 'SUCCESS') {
        //                 Toast.success(intl.get('MAIN_128'), 3)  //撤销成功
        //             } else {
        //                 this.handleSpotError(res)
        //             }
        //         })
        //     } catch (err) {
        //         console.log(err)
        //         Toast.fail(intl.get('MAIN_128_1'), 3)
        //     }
        //     this.getMyOrders(true)
        // },
        //
        // //创建订单
        // doCreateOrder: (data) => {
        //     return Storage.Service.postApiOrderV1CreateOrder(data)
        // },
        //
        // onBuyPercentChange: (data) => {
        //     const { value, assets, isLimit, currentPrice, maxSizeDigit } = data
        //     // this.setState({ form: { ...this.state.form, buyPercent: value } })
        //     if (assets[currentPrice] > 0) {
        //         if (isLimit) {
        //             const totalValue = assets[currentPrice]
        //             const buyPrice = this.unformatNumber(this.state.form.buyPrice)
        //             if (buyPrice !== 0) {
        //                 const totalAmount = new BigNumber(totalValue)
        //                     .dividedBy(buyPrice)
        //                     .multipliedBy(value)
        //                     .decimalPlaces(maxSizeDigit, BigNumber.ROUND_DOWN)
        //                     .toNumber()
        //                 this.setState({
        //                     form: {
        //                         ...this.state.form,
        //                         buyAmount: totalAmount,
        //                         buyPercent: value
        //                     }
        //                 })
        //             }
        //         } else {
        //             const totalAmount = new BigNumber(assets[currentPrice])
        //                 .multipliedBy(value)
        //                 .decimalPlaces(maxSizeDigit, BigNumber.ROUND_DOWN)
        //                 .toNumber()
        //             this.setState({
        //                 form: {
        //                     ...this.state.form,
        //                     buyAmount: totalAmount,
        //                     buyPercent: value
        //                 }
        //             })
        //         }
        //     }
        // },
        //
        // onSellPercentChange: (data) => {
        //     const { value, assets, currentToken, maxSizeDigit } = data
        //     if (assets[currentToken] > 0) {
        //         const totalAmount = new BigNumber(assets[currentToken])
        //             .multipliedBy(value)
        //             .decimalPlaces(maxSizeDigit, BigNumber.ROUND_DOWN)
        //             .toNumber()
        //         this.setState({
        //             form: {
        //                 ...this.state.form,
        //                 sellAmount: totalAmount,
        //                 sellPercent: value
        //             }
        //         })
        //     }
        // },
    }
}
