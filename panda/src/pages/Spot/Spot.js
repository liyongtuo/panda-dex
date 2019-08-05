import React, { Component } from 'react';
import {
    Card,
    Input,
    Button,
    Favorite
} from '@/components';
import {
    Tabs,
} from 'antd';
// import TradingView from './tradingView';
import intl from 'react-intl-universal';
// import cs from 'classnames';
import Table from './Table';
import connect from '@/store/connect';
import service from './service';
import util from './util';
import mixins from '@/mixins/mixin';
import config from './config';
import { hot } from 'react-hot-loader';
// initialise via static create

const percents = [{
    label: '25%',
    value: 0.25
}, {
    label: '50%',
    value: 0.5
}, {
    label: '75%',
    value: 0.75
}, {
    label: '100%',
    value: 1
}]

// 本地缓存上次选项
const ordersKey = localStorage.getItem(config._orders_key)
const tradeKey = localStorage.getItem(config._trade_key)
const modeKey = localStorage.getItem(config._mode_key)

import { ApiPromise } from '@polkadot/api';

let api = null;

@hot(module)
class Spot extends Component {

    constructor(props) {
        super(props);
        this.prototype = Object.assign(this,
            {
                ...util.bind(this)(),
                ...service.bind(this)(),
                ...mixins.bind(this)(),
            })
        this.products = {}
        // this.currentPair = this.getUrlParams('pair')
        this.currentTicker = {}
        this.state = {
            assets: {},
            menuOpen: false,
            depthOpen: false,
            currentOnly: false,
            detailOpen: false,
            currentDetail: '',
            expandedRowKeys: new Set([]),
            expandedRowLoading: new Set([]),
            expandedRowData: {},
            tickersList: [],
            products: {},
            myOrdersList: [],
            myHistoryOrdersList: [],
            currentOrdersList: [],
            recentDealList: [],
            tokenList: ['BTC', 'ETH', 'USDT'],
            priceSelect: 'BTC',
            favoritePairList: new Set(),
            // currentPair: this.currentPair,
            currentFee: '',
            currentTicker: {},
            ordersKey: ordersKey ? ordersKey : config._my_orders,
            tradeKey: tradeKey ? tradeKey : config._trade_limit,
            modeKey: modeKey ? modeKey : config._mode_kline,
            mainPad: config._pad_kline,
            currentDepth: { ...config.depthMenu[0] },
            loading: {
                buy: false,
                sell: false,
                recentDeals: true,
                currentOrders: true,
                myOrders: true,
                historyOrders: true,
                productList: false,
            },
            form: {
                buyPrice: '',
                buyAmount: '',
                buyPercent: 0,
                sellPrice: '',
                sellAmount: '',
                sellPercent: 0,
            },
            buyError: '',
            sellError: '',
        }
    }

    componentDidMount() {
        this.getApi();
    }

    async getApi() {
        api = await ApiPromise.create();
    }

    componentWillUnmount() {

    }

    render() {

        let { assets } = this.state

        // 当前交易币
        const currentToken = '---'
        // 当前价格币
        const currentPrice = '---'
        // 最大价格精度
        const maxPriceDigit =  6
        // 最大数量精度
        const maxSizeDigit =  4
        // 是否是限价交易
        const isLimit = true
        // 价格显示精度
        const quotePrecision = 6

        // 买卖盘 columns
        const currentOrdersColumns = [
            {
                title: '',
                dataIndex: 'id',
                width: 70,
                render: (text, record) => {
                    if (text < 0) {
                        return <span className="color-red">{
                            intl.get('MAIN_101') // 卖
                        } {Math.abs(text)}</span>
                    } else if (text === 0) {
                        return <span className={(parseFloat(record.amount) > 0 ? 'color-green' : 'color-red') + ' ft-weight-500 ft-size-14'}>{
                            intl.get('MAIN_78') // 最新价格
                        }</span>
                    } else {
                        return <span className="color-green">{
                            intl.get('MAIN_100') // 买
                        } {Math.abs(text)}</span>
                    }
                }
            }, {
                title: `${intl.get('MAIN_59')}`,   // 价格
                dataIndex: 'price',
                width: 70,
                render: (text, record) => {
                    if (record.id === 0) {
                        return <span
                            className={`${parseFloat(record.amount) > 0 ? 'color-green' : 'color-red'} flex-between ft-weight-500 ft-size-14`}
                        >
                            <span>{this.toPriceNum(text, quotePrecision)}</span>
                        </span>
                    }
                    return <span>{this.toPriceNum(text, quotePrecision)}</span>
                }
            }, {
                title: `${intl.get('MAIN_60')}(${currentToken})`,   // 数量
                dataIndex: 'amount',
                align: 'right',
                width: 70,
                render: (text, record) => {
                    if (record.id === 0) {
                        return ''
                    }
                    return <span className="color-font-primary">{this.toAmountNum(text)}</span>
                }
            }
        ]

        // 当前交易对详情
        const renderTitle = (
            <div className="flex-between ft-weight-500 color-white">
                <section className="ft-size-20 flex-align-center">
                    <span>{currentToken}/{currentPrice}</span>
                </section>
                <section>
                    {/* 最新价格 */}
                    <p>{intl.get('MAIN_78')}</p>
                    {/*<p></p>*/}
                </section>
                <section>
                    {/* 涨跌幅 */}
                    <p>24H {intl.get('MAIN_79')}</p>
                </section>
                <section>
                    {/* 最高价 */}
                    <p>24H {intl.get('MAIN_81')}</p>
                </section>
                <section>
                    {/* 最低价 */}
                    <p>24H {intl.get('MAIN_82')}</p>
                </section>
                <section>
                    {/* 24H成交量量 */}
                    <p>24H {intl.get('MAIN_83')}</p>
                </section>
            </div>
        )

        const renderNewKline = (
            <Card
                border
                style={{ height: '100%' }}
            >
                {renderTitle}
                <div style={{
                    minWidth: '5.8rem',
                    height: '3.2rem',
                    borderRadius: '.1rem',
                    overflow: 'hidden',
                    marginTop: '.05rem',
                }}>
                    {/*<TradingView*/}
                        {/*symbol={this.state.currentPair}*/}
                    {/*/>*/}
                </div>
            </Card>
        )

        const depthDecimal = this.getDecimalDigits(this.state.currentTicker.lastPrice || 1)
        const depthMenuTemp = [...config.depthMenu]
        if (depthDecimal < 8) {
            if (depthDecimal >= 6) {
                depthMenuTemp.shift()
            } else if (depthDecimal >= 4) {
                depthMenuTemp.shift()
            } else if (depthDecimal >= 2) {
                depthMenuTemp.shift()
            }
        }

        // 买卖盘
        const renderDepth = (
            <Card
                border
                style={{ height: '100%' }}
                scroll
            >
                <span className="color-font-second ft-weight-400 ft-size-16">{
                    intl.get('MAIN_87') // 买卖盘
                }</span>
                <Table
                    dataSource={this.state.currentOrdersList}
                    currentTicker={this.state.currentTicker}
                    columns={currentOrdersColumns}
                    loading={this.state.loading.currentOrders}
                    id={'depth'}
                    className="click-table"
                    style={{ marginRight: '.03rem' }}
                    rowClassName={() => {
                        // if (record.id === 0) return 'row-depth-ticker'
                        return 'row-depth'
                    }}
                    pagination={false}
                    // scroll={{ y: 668 }}
                    size="small"
                    onRow={(record) => {
                        if (record.price === '---') return
                        return {
                            onClick: () => {
                                this.setState({
                                    form: {
                                        ...this.state.form,
                                        buyPrice: this.toPriceNum(record.price, quotePrecision),
                                        sellPrice: this.toPriceNum(record.price, quotePrecision),
                                    },
                                    buyError: '',
                                    sellError: '',
                                })
                            }
                        }
                    }}
                    locale={{
                        emptyText: intl.get('MAIN_45') // 暂无交易数据
                    }}
                />
            </Card>
        )

        let currentOrdersSimple = []
        this.state.currentOrdersList.forEach(item => {
            if (item.id < 0) {
                currentOrdersSimple.push({
                    SELL_Price: item.price,
                    SELL_Amount: item.amount,
                })
            }
            if (item.id === 0) {
                currentOrdersSimple.reverse()
            }
            if (item.id > 0) {
                // debugger
                let temp = currentOrdersSimple[item.id - 1]
                if (!temp) {
                    currentOrdersSimple[item.id - 1] = temp = {}
                }
                temp.id = item.id
                temp.BUY_Price = item.price
                temp.BUY_Amount = item.amount
            }
        })

        // 表单输入错误提示
        const renderError = (type) => (
            <div className="color-orange-deep ft-size-12 mt-5">
                {this.state[type + 'Error'] || '　'}
            </div>
        )

        const buyTotal = isLimit ?
            this.formatToNum(this.getTotalAmount(this.state.form.buyPrice, this.state.form.buyAmount, maxPriceDigit))
            :
            this.formatToNum(this.getAmountByTotal(this.state.form.buyAmount, this.currentTicker.lastPrice, maxPriceDigit))


        // 发布买单
        const renderBuyToken = () => (
            <section className="flex1 pr-10 right-line ml-5">
                <div className="flex-between">
                    <span className="color-green">
                        {
                            intl.get('MAIN_92') // 买入
                        } {currentToken}
                    </span>
                    <span className="color-primary-light">
                        {currentPrice} {
                            intl.get('MAIN_90') // 可用
                        } {this.toPriceNum(assets[currentPrice], quotePrecision)}
                    </span>
                </div>
                <div className="mt-10">
                    <Input
                        disabled={this.state.tradeKey !== config._trade_limit}
                        label={intl.get('MAIN_89')} // 交易单价
                        placeholder={intl.get('MAIN_89')} // 交易单价
                        value={isLimit ? this.state.form.buyPrice : intl.get('MAIN_91')} // 以市场最优价买入
                        onChange={(v) => {
                            this.setState({
                                form: {
                                    ...this.state.form,
                                    buyPrice: this.formatToNum(v, maxPriceDigit)
                                },
                                buyError: ''
                            })
                        }}
                        append={<span className="mr-5 color-primary-light">{currentPrice}</span>}
                    />
                    <Input
                        label={isLimit ? intl.get('MAIN_104') : intl.get('MAIN_105')} // 交易数量 交易金额
                        placeholder={isLimit ? intl.get('MAIN_104') : intl.get('MAIN_105')} // 交易数量 交易金额
                        value={this.state.form.buyAmount}
                        // placeholder={isLimit ? '最小交易数量为' + minDealAmount : ''}
                        onChange={(v) => {
                            this.setState({
                                form: {
                                    ...this.state.form,
                                    buyPercent: '',
                                    buyAmount: this.formatToNum(v, maxSizeDigit)
                                },
                                buyError: ''
                            })
                        }}
                        // onBlur={(v) => {
                        //     this.onAmountBlur(this.unformatNumber(v), 'buy')
                        // }}
                        append={<span className="mr-5 color-primary-light">{isLimit ? currentToken : currentPrice}</span>}
                    />
                </div>
                {renderError('buy')}
                <div className="mt-10">
                    <Button
                        loading={this.state.loading.buy}
                        onClick={() => this.doLimitBuy(buyTotal, assets[currentPrice])}
                        style={{ fontSize: '.14rem', padding: '.1rem 0', borderRadius: '.04rem' }}
                        color="green"
                        width="100%"
                    >{
                        intl.get('MAIN_92') // 买入 / 登录
                    }</Button>
                </div>
            </section>
        )

        function doLimitBuy(buyTotal, price, type) {
            const order =  api.tx.pendingorders.order(0, 1, 1000, 1000, 0);

            order.signAndSend(ALICE, ({ events = [], status }) => {
                if (status.isFinalized) {
                    console.log('Success', status.asFinalized.toHex());
                } else {
                    console.log('Status of crateTx: ' + status.type);
                }

                events.forEach(({ phase, event: { data, method, section } }) => {
                    console.log(phase.toString() + ' : ' + section + '.' + method + ' ' + data.toString());
                });
            });

        }

        const sellTotal = this.formatToNum(
            this.getTotalAmount(
                isLimit ? this.state.form.sellPrice : this.currentTicker.lastPrice,
                this.state.form.sellAmount,
                maxPriceDigit
            )
        )

        // 发布卖单
        const renderSellToken = () => (
            <section className="flex1 pl-10 mr-5">
                <div className="flex-between">
                    <span className="color-red">
                        {
                            intl.get('MAIN_93') // 卖出
                        } {currentToken}
                    </span>
                    <span className="color-primary-light">
                        {currentToken} {
                            intl.get('MAIN_90') // 可用
                        } {this.toPriceNum(assets[currentToken], quotePrecision)}
                    </span>
                </div>
                <div className="mt-10">
                    <Input
                        // primary
                        disabled={this.state.tradeKey !== config._trade_limit}
                        label={intl.get('MAIN_89')} // 交易单价
                        placeholder={intl.get('MAIN_89')} // 交易单价
                        value={isLimit ? this.state.form.sellPrice : intl.get('MAIN_94')} // 以市场最优价卖出
                        onChange={(v) => {
                            this.setState({
                                form: {
                                    ...this.state.form,
                                    sellPrice: this.formatToNum(v, maxPriceDigit)
                                },
                                sellPrice: '',
                            })
                        }}
                        append={<span className="mr-5 color-primary-light">{currentPrice}</span>}
                    />
                    <Input
                        placeholder={intl.get('MAIN_104')} // 交易数量
                        label={intl.get('MAIN_104')} // 交易数量
                        value={this.state.form.sellAmount}
                        // placeholder={'最小交易数量为' + minDealAmount}
                        onChange={(v) => {
                            if (v > assets[currentToken]) v = assets[currentToken]
                            this.setState({
                                form: {
                                    ...this.state.form,
                                    sellPercent: '',
                                    sellAmount: this.formatToNum(v, maxSizeDigit)
                                },
                                sellError: '',
                            })
                        }}
                        // onBlur={(v) => {
                        //     this.onAmountBlur(this.unformatNumber(v), 'sell')
                        // }}
                        append={<span className="mr-5 color-primary-light">{currentToken}</span>}
                    />
                </div>
                {renderError('sell')}
                <div className="mt-10">
                        <Button
                            loading={this.state.loading.sell}
                            onClick={() => {
                                this.doLimitSell(this.state.form.sellAmount, assets[currentToken])
                            }}
                            style={{ fontSize: '.14rem', padding: '.1rem 0', borderRadius: '.04rem' }}
                            color="red"
                            width="100%"
                        >{
                                intl.get('MAIN_93') // 卖出
                            }</Button>
                </div>
            </section>
        )

        const renderTabBar = (props, DefaultTabBar) => {
            return (
                <div className={`user-tabs color-primary-light`}>
                    <DefaultTabBar {...props} />
                </div>
            )
        };

        // 发布订单
        const renderPublishOrders = (
            <Card
                style={{ height: '100%' }}
                border
                noPadding
            >
                <Tabs
                    defaultActiveKey={config._trade_limit}
                    activeKey={this.state.tradeKey}
                    renderTabBar={renderTabBar}
                    animated={false}
                    titleAppend={
                        <span className="color-title-light">{
                            intl.get('MAIN_43')  // 手续费
                        } {this.state.currentFee * 100} % </span>
                    }
                    onChange={key => {
                        localStorage.setItem(config._trade_key, key)
                        this.setState({
                            tradeKey: key,
                            buyError: '',
                            sellError: '',
                            form: {
                                ...this.state.form,
                                buyAmount: '',
                                buyPercent: '',
                                sellAmount: '',
                                sellPercent: '',
                            }
                        })
                    }}
                >
                    {/* 现价交易 */}
                    <div style={{ height: '100%' }} className="flex">
                        {renderBuyToken()}
                        {renderSellToken()}
                    </div>
                </Tabs>
            </Card>
        )

        return (
            <div className="matrix-spot">
                <div className="flex mt-10">
                    <div style={{ flex: 2 }} className="m-x-10">
                        <div style={{ height: '4rem' }}>
                            {renderNewKline}
                        </div>
                        <div className="mt-10" style={{ height: '4rem'}}>
                            {renderPublishOrders}
                        </div>
                    </div>
                    <div style={{ flex: .8, height: '8.1rem', minWidth: '2.5rem' }}>
                        {renderDepth}
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(Spot)
