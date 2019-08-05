import React, { Component } from 'react';
import cs from 'classnames';
import {
    Icon as MatrixIcon,
    Input,
    Button,
    Favorite,
    Modal,
    TabBarH5,
} from '@/components';
import { Spin, Tabs } from 'antd';
import Table from './Table';
import TradingView from './tradingView';
import connect from '@/store/connect';
import service from './service';
import util from './util';
import mixins from '@/mixins/mixin';
import config from './config';
import intl from 'react-intl-universal';
import { hot } from 'react-hot-loader'
import HeaderH5 from '@/pages/Main/H5/Header';

const _prefix = 'matrix-spot-h5'

const TabPane = Tabs.TabPane;

const isEnglish = intl.getInitOptions().currentLocale === 'en-US';

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

@hot(module)
class SpotH5 extends Component {

    constructor(props) {
        super(props);
        this.prototype = Object.assign(this,
            {
                ...util.bind(this)(),
                ...service.bind(this)(),
                ...mixins.bind(this)(),
            })
        this.sellOrders = new Map()
        this.buyOrders = new Map()
        this.depthItem = { ...config.depthMenu[0] }
        this.tickersMap = {}
        this.products = {}
        this.currenciesMap = {}
        this.productList = []
        this.currentPair = this.getUrlParams('pair')
        this.currentTicker = {}
        this.state = {
            assets: {},
            menuOpen: false,
            depthOpen: false,
            currentOnly: false,
            detailOpen: false,
            klineSrc: '/kline/index.html',
            currentDetail: '',
            expandedRowKeys: new Set([]),
            expandedRowLoading: new Set([]),
            expandedRowData: {},
            products: [],
            tickersList: [],
            myOrdersList: [],
            myHistoryOrdersList: [],
            currentOrdersList: [],
            recentDealList: [],
            tokenList: ['BTC', 'ETH', 'VENA'],
            priceSelect: 'BTC',
            favoritePairList: new Set(),
            currentPair: this.currentPair,
            currentTicker: {},
            ordersKey: ordersKey ? ordersKey : config._my_orders,
            tradeKey: tradeKey ? tradeKey : config._trade_limit,
            tradeType: config._trade_buy,
            modeKey: modeKey ? modeKey : config._mode_kline,
            mainPad: config._pad_kline,
            loading: {
                buy: false,
                sell: false,
                recentDeals: true,
                currentOrders: true,
                myOrders: true,
                HistoryOrders: true,
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
            showDetail: false,
            orderDetail: [],
            detailLoading: false,
        }
    }

    componentDidMount() {
        try {
            this.onH5Load()
            this.getAccountInfo()
        } catch (e) {
            console.log('初始化失败', e)
        }
    }

    componentWillUnmount() {
        this.ordersInterval && clearInterval(this.ordersInterval)
        this.pingInterval && clearInterval(this.pingInterval)
        this.tickerInterval && clearInterval(this.tickerInterval)
        this.balanceInterval && clearInterval(this.balanceInterval)
        this.ws && this.ws.close()
    }

    render() {

        let { state } = this

        let { form, assets } = this.state

        let { login } = this.props.dataX

        // 当前交易币
        const currentToken = this.getCurrentToken(this.state.currentPair)
        // 当前价格币
        const currentPrice = this.getCurrentPrice(this.state.currentPair)
        // 当前交易对规则
        const currentProduct = this.state.products[this.state.currentPair]
        // 最大价格精度
        const maxPriceDigit = currentProduct ? currentProduct.maxPriceDigit || 6 : 6
        // 最大数量精度
        const maxSizeDigit = currentProduct ? currentProduct.maxAmountDigit || 4 : 4
        // 是否是限价交易
        const isLimit = this.state.tradeKey === config._trade_limit
        // 价格显示精度
        const quotePrecision = currentProduct ? currentProduct.quotePrecision || 6 : 6

        // 自选交易对
        const favoriteList = []
        if (Array.from(this.state.favoritePairList).length > 0) {
            this.state.favoritePairList.forEach(item => {
                if (item.split('_')[1] === this.state.priceSelect.toLowerCase()) {
                    favoriteList.push(item.split('_')[0])
                }
            })
        }

        const tickerInfo = () => {
            const priceColor = state.currentTicker.change >= 0 ? "color-green" : "color-red"
            return (
                <div className="pt-5 pb-5 padding-x-10 color-bg-white bottom-line">
                    <div className="ft-size-17 ft-weight-bold color-white flex-between flex-align-center">
                        <span>
                            <span className="clickable" onClick={() => { this.setState({ menuOpen: true }) }}>
                                {currentToken}/{currentPrice} <MatrixIcon type="down" size=".13rem" color="white" />
                            </span>
                        </span>
                        <span className={cs(priceColor, 'ft-size-20')}>
                            <span className={cs(priceColor, 'ft-size-15 ft-weight-400 mr-20')}>{state.currentTicker.changePercentage || '--'}</span>
                            {state.currentTicker.lastPrice}
                        </span>
                    </div>
                </div>
            )
        }

        // 交易对菜单 columns
        const columns = [
            {
                title: intl.get('MAIN_46'),      // 币种
                dataIndex: 'symbolName',
                width: 140,
                render: (text, record) => {
                    const name = text.split('_')[0].toUpperCase() + '/' + text.split('_')[1].toUpperCase()
                    const isFavorite = this.state.priceSelect === config._favorites || this.state.favoritePairList.has(text)
                    return (
                        <span>
                            <Favorite
                                favorite={isFavorite}
                                className="mr-5 ft-size-16"
                                onFavorite={() => { this.addFavorite(text) }}
                                onUnFavorite={() => { this.removeFavorite(record) }}
                            />
                            {name}
                        </span>
                    )
                }
            }, {
                title: intl.get('MAIN_64'),        // 最新价
                dataIndex: 'lastPrice',
                width: 100,
                sorter: (a, b) => a.lastPrice - b.lastPrice,
                render: (text, record) => {
                    const color = parseFloat(record.change) >= 0 ? 'color-green' : 'color-red'
                    return <span className={color}>{text}</span>
                },
            }, {
                title: intl.get('MAIN_65'),      // 涨跌
                dataIndex: 'change',
                align: 'right',
                width: 80,
                sorter: (a, b) => parseFloat(a.change) - parseFloat(b.change),
                render: (text, record) => {
                    const color = parseFloat(text) >= 0 ? 'color-green' : 'color-red'
                    return <span className={color}>{this.formatPercent(text, record.changePercentage)}</span>
                }
            }
        ]

        const renderTickerMenu = () => {
            const headerPadding = { padding: '.1rem' }
            return (
                <div>
                    <div className={cs(_prefix + '-menu-cover',
                        {
                            'show': this.state.menuOpen,
                        })} onClick={() => { this.setState({ menuOpen: false }) }}></div>
                    <div className={cs(_prefix + '-menu color-bg-white', {
                        'show': this.state.menuOpen
                    })}>
                        <div className="flex color-white ft-size-17 ft-weight-bold">
                            <section className="flex1" style={headerPadding}>
                                <span onClick={() => { this.setState({ menuOpen: false }) }} className="clickable ft-size-20" >
                                    <MatrixIcon type='left' width=".18rem" color="white" height=".18rem" />
                                </span>
                            </section>
                            <section className="flex1 text-center" style={headerPadding}>{
                                intl.get('MAIN_66') // 市场
                            }</section>
                            <section className="flex1 text-right" style={headerPadding}>
                                {/* <MatrixIcon type="search" width=".16rem" height=".16rem" /> */}
                            </section>
                        </div>
                        <div className="flex ticker-menu bottom-line pl-20">
                            <a
                                className={this.state.priceSelect === config._favorites ? 'click-darkblue' : 'click-lightblue'}
                                onClick={() => {
                                    this.setState({ priceSelect: config._favorites })
                                }}
                            >
                                {
                                    intl.get('MAIN_67') // 自选
                                }
                            </a>
                            {this.state.tokenList.map((item, index) => {
                                if (this.state.priceSelect === item) {
                                    return <a key={index} className="click-darkblue">{item}</a>
                                } else {
                                    return <a key={index} onClick={() => {
                                        this.setState({ priceSelect: item })
                                    }} className="click-lightblue">{item}</a>
                                }
                            })}
                        </div>
                        <div>
                            <Table
                                dataSource={this.state.tickersList.filter(v => {
                                    if (this.state.priceSelect === config._favorites) {
                                        return this.state.favoritePairList.has(v.symbolName)
                                    }
                                    return v.symbolName.split('_')[1] === this.state.priceSelect.toLowerCase()
                                }).filter(v => {
                                    if (!form.search) return true
                                    return v.symbolName.toLowerCase().indexOf(form.search.toLowerCase()) > -1
                                })}
                                style={{ marginRight: '.03rem' }}
                                columns={columns}
                                className={cs('click-table ticker-table-menu h5-table padding-x-10', { 'english': isEnglish })}
                                rowClassName={(record) => {
                                    if (record.symbolName === this.state.currentPair)
                                        return 'matrix-row-selected row-ticker-menu'
                                    return 'row-ticker-menu'
                                }}
                                currentPair={this.state.currentPair}
                                favoriteList={Array.from(this.state.favoritePairList)}
                                rowKey={'symbolName'}
                                size="small"
                                scroll={{ y: 280 }}
                                pagination={false}
                                onRow={(record) => {
                                    return {
                                        onClick: (e) => {
                                            if (e.target.nodeName === 'TD' || e.target.nodeName === 'SPAN') {
                                                this.onCurrentPairChange(record.symbolName)
                                                this.setState({ menuOpen: false })
                                            }
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            )
        }

        let currentOrdersSimple = []
        this.state.currentOrdersList.forEach((item, index) => {
            if (item.id < 0) {
                currentOrdersSimple.push({
                    SELL_Price: item.price,
                    SELL_Amount: item.amount,
                    key: index
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
                temp.key = index
                temp.BUY_Price = item.price
                temp.BUY_Amount = item.amount
            }
        })

        // 买卖盘简版 columns
        const depthColumnsSimple = [
            {
                title: `${intl.get('MAIN_60')}`,   // 数量
                dataIndex: 'BUY_Amount',
                align: 'left',
                width: 60,
                render: (text, record) => {
                    if (record.id === 0) {
                        return ''
                    }
                    return <span className="color-primary-light">{this.toAmountNum(text)}</span>
                }
            }, {
                title: `${intl.get('MAIN_102')}`,   // 买价
                dataIndex: 'BUY_Price',
                align: 'right',
                width: 60,
                render: (text) => {
                    return <span
                        onClick={() => {
                            if (text === '---') return
                            this.setState({
                                form: {
                                    ...this.state.form,
                                    buyPrice: this.toPriceNum(text, quotePrecision),
                                    sellPrice: this.toPriceNum(text, quotePrecision),
                                }
                            })
                        }}
                        className={'color-green'}>{this.toPriceNum(text, quotePrecision)}</span>
                }
            }, {
                title: '',
                dataIndex: 'id',
                width: 20,
                align: 'center',
                render: (text) => {
                    return <span className="color-bg-color">|</span>
                }
            }, {
                title: `${intl.get('MAIN_103')}`, // 卖价
                dataIndex: 'SELL_Price',
                align: 'left',
                width: 60,
                render: (text) => {
                    return <span
                        onClick={() => {
                            if (text === '---') return
                            this.setState({
                                form: {
                                    ...this.state.form,
                                    buyPrice: this.toPriceNum(text, quotePrecision),
                                    sellPrice: this.toPriceNum(text, quotePrecision),
                                }
                            })
                        }}
                        className={'color-red'}>{this.toPriceNum(text, quotePrecision)}</span>
                }
            }, {
                title: `${intl.get('MAIN_60')}`,   // 数量
                dataIndex: 'SELL_Amount',
                align: 'right',
                width: 60,
                render: (text, record) => {
                    if (record.id === 0) {
                        return ''
                    }
                    return <span className="color-primary-light">{this.toAmountNum(text)}</span>
                }
            }
        ]

        const renderDepth = () => {
            return (
                <div className="color-bg-white">
                    <Table
                        dataSource={currentOrdersSimple.filter((item, index) => {
                            return index < 5
                        })}
                        columns={depthColumnsSimple}
                        loading={this.state.loading.currentOrders}
                        id={'depth'}
                        className="click-table h5-table"
                        rowClassName={() => {
                            return 'row-depth'
                        }}
                        pagination={false}
                        // scroll={{ y: 668 }}
                        size="small"
                    />
                </div>
            )
        }

        // 表单输入错误提示
        const renderError = (type) => (
            <div className="color-orange-deep ft-size-10 mt-2">
                {this.state[type + 'Error'] || '　'}
            </div>
        )

        // const renderMark = (num) => {
        //     return {
        //         style: {
        //             color: '#6E80A1'
        //         },
        //         label: num
        //     }
        // }
        const buyTotal = isLimit ?
            this.formatToNum(this.getTotalAmount(this.state.form.buyPrice, this.state.form.buyAmount, maxPriceDigit))
            :
            this.formatToNum(this.getAmountByTotal(this.state.form.buyAmount, this.currentTicker.lastPrice, maxPriceDigit))

        // 发布买单
        const renderBuyToken = () => (
            <section className="flex1 pr-10 pl-10">
                <div>
                    <span className="color-green">
                        {
                            intl.get('MAIN_92') // 买入
                        } {currentToken}
                    </span>
                </div>
                <div className="color-primary-light ft-size-12 flex-between">
                    <span>
                        {currentPrice} {
                            intl.get('MAIN_90') // 可用
                        }
                    </span>
                    <span>
                        {this.toAmountNum(assets[currentPrice], quotePrecision)}
                    </span>
                </div>
                <div>
                    <Input
                        disabled={this.state.tradeKey !== config._trade_limit}
                        type={'number'}
                        label={intl.get('MAIN_89')} // 交易单价
                        placeholder={!isLimit ? intl.get('MAIN_91') : intl.get('MAIN_89')} // 交易单价
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
                        type={'number'}
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
                <div className="flex-between">
                    {percents.map((item, index) => {
                        return (
                            <span
                                key={index}
                                className={cs('buy-percent', { 'active': item.value === this.state.form.buyPercent })}
                                onClick={() => { this.onBuyPercentChange({ value: item.value, assets, isLimit, currentPrice, maxSizeDigit }) }}>
                                {item.label}
                            </span>
                        )
                    })}
                </div>
                {renderError('buy')}
                <div className="color-font-second mt-5 ft-size-13">
                    {
                        isLimit ? intl.get('MAIN_106') : intl.get('MAIN_104_1') // 交易额 预计交易
                    }
                    <span className="color-font-primary ml-5">
                        {buyTotal} {isLimit ? currentPrice : currentToken}
                    </span>
                </div>
                <div className="mt-10">
                    {login ?
                        <Button
                            loading={this.state.loading.buy}
                            onClick={() => this.doLimitBuy()}
                            style={{ fontSize: '.14rem', padding: '.08rem 0', borderRadius: '.04rem' }}
                            color="green"
                            width="100%"
                            disabled={!this.state.form.buyPrice || !this.state.form.buyAmount}
                        >{
                                intl.get('MAIN_92') // 买入 
                            }</Button>
                        :
                        <Button
                            onClick={() => {
                                this.showLoginModal()
                            }}
                            style={{ fontSize: '.14rem', padding: '.08rem 0', borderRadius: '.04rem' }}
                            color="green"
                            width="100%"
                        >{
                                intl.get('MAIN_131') // 登录
                            }</Button>
                    }
                </div>
            </section>
        )

        const sellTotal = this.formatToNum(
            this.getTotalAmount(
                isLimit ? this.state.form.sellPrice : this.currentTicker.lastPrice,
                this.state.form.sellAmount,
                maxPriceDigit
            )
        )

        // 发布卖单
        const renderSellToken = () => (
            <section className="flex1 pl-10 pr-10">
                <div className="flex-between">
                    <span className="color-red">
                        {
                            intl.get('MAIN_93') // 卖出
                        } {currentToken}
                    </span>
                </div>
                <div className="color-primary-light ft-size-12 flex-between">
                    <span>
                        {currentToken} {
                            intl.get('MAIN_90') // 可用
                        }
                    </span>
                    <span>
                        {this.toAmountNum(assets[currentToken], quotePrecision)}
                    </span>
                </div>
                <div>
                    <Input
                        type={'number'}
                        disabled={this.state.tradeKey !== config._trade_limit}
                        label={intl.get('MAIN_89')} // 交易单价
                        placeholder={!isLimit ? intl.get('MAIN_91') : intl.get('MAIN_89')} // 交易单价
                        value={isLimit ? this.state.form.sellPrice : intl.get('MAIN_94')} // 以市场最优价卖出
                        onChange={(v) => {
                            this.setState({
                                form: {
                                    ...this.state.form,
                                    sellPrice: this.formatToNum(v, maxPriceDigit)
                                },
                                sellError: '',
                            })
                        }}
                        append={<span className="mr-5 color-primary-light">{currentPrice}</span>}
                    />
                    <Input
                        type={'number'}
                        placeholder={intl.get('MAIN_104')} // 交易数量
                        label={intl.get('MAIN_104')} // 交易数量
                        value={this.state.form.sellAmount}
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
                <div className="flex-between">
                    {percents.map((item, index) => {
                        return (
                            <span
                                key={index}
                                className={cs('buy-percent', { 'active': item.value === this.state.form.sellPercent })}
                                onClick={() => { this.onSellPercentChange({ value: item.value, assets, currentToken, maxSizeDigit }) }}>
                                {item.label}
                            </span>
                        )
                    })}
                </div>
                {renderError('sell')}
                <div className="color-font-second mt-5 ft-size-13">
                    {
                        isLimit ? intl.get('MAIN_106') : intl.get('MAIN_104_1') // 交易额
                    }
                    <span className="color-font-primary ml-5">
                        <span>
                            {sellTotal} {currentPrice}
                        </span>
                    </span>
                </div>
                <div className="mt-10">
                    {login ?
                        <Button
                            loading={this.state.loading.sell}
                            onClick={() => {
                                this.doLimitSell()
                            }}
                            style={{ fontSize: '.14rem', padding: '.08rem 0', borderRadius: '.04rem' }}
                            color="red"
                            width="100%"
                            disabled={!this.state.form.sellPrice || !this.state.form.sellAmount}
                        >{
                                intl.get('MAIN_93') // 卖出
                            }</Button>
                        :
                        <Button
                            onClick={() => {
                                this.showLoginModal()
                            }}
                            style={{ fontSize: '.14rem', padding: '.08rem 0', borderRadius: '.04rem' }}
                            color="red"
                            width="100%"
                        >{
                                intl.get('MAIN_131') // 登录
                            }</Button>
                    }
                </div>
            </section>
        )

        // 发布订单
        const renderPublishOrders = () => {
            return (
                <div className="mt-5 color-bg-white">
                    <Tabs
                        defaultActiveKey={config._trade_limit}
                        activeKey={this.state.tradeKey}
                        animated={false}
                        renderTabBar={(props) => (
                            <div className="h5-tabs color-font-fourth">
                                <TabBarH5 {...props} />
                            </div>)
                        }
                        onChange={key => {
                            localStorage.setItem(config._trade_type, key)
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
                        <TabPane tab={intl.get('MAIN_95')} key={config._trade_limit}>
                            <div style={{ height: '100%' }} className="flex mt-10">
                                {renderBuyToken()}
                                {renderSellToken()}
                            </div>
                        </TabPane>
                        {/* 市价交易 */}
                        <TabPane tab={intl.get('MAIN_96')} key={config._trade_market}>
                            <div style={{ height: '100%' }} className="flex mt-10">
                                {renderBuyToken()}
                                {renderSellToken()}
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
            )
        }

        // 最近成交 columns
        const recentDealColumns = [
            {
                title: intl.get('MAIN_38'),     // 时间
                dataIndex: 'time',
                width: 140,
                render: (text) => {
                    return <span className="color-font-primary">{this.dateFormater(new Date(parseInt(text, 10)), 'dh-')}</span>
                }
            }, {
                title: `${intl.get('MAIN_59')}(${currentPrice})`,     // 价格
                dataIndex: 'price',
                width: 100,
                render: (text, record) => {
                    return <span
                        className={record.type === 'BUY' ? 'color-green' : 'color-red'}>{this.toPriceNum(text, quotePrecision)}</span>
                }
            }, {
                title: `${intl.get('MAIN_60')}(${currentToken})`,     // 数量
                dataIndex: 'amount',
                align: 'right',
                width: 100,
                render: (text) => {
                    return <span className="color-font-primary">{this.toAmountNum(text)}</span>
                }
            }
        ]

        // 最近成交
        const renderRecentOrders = () => {
            return (
                <div className="mt-5 pb-10 pt-10 color-bg-white">
                    <div className="ft-size-15 color-font-second pb-10 bottom-line padding-x-10">{
                        intl.get('MAIN_77') // 最近成交
                    }</div>
                    <Table
                        dataSource={this.state.recentDealList.filter((item, index) => {
                            return index < 10
                        })}
                        columns={recentDealColumns}
                        loading={this.state.loading.recentDeals}
                        className="h5-table"
                        rowClassName={() => {
                            return 'row-rencent-orders'
                        }}
                        pagination={false}
                        size="small"
                    />
                </div>
            )
        }

        const renderOrderCard = (order, type) => {
            const isLimit = order.type === 'BUY_LIMIT' || order.type === 'SELL_LIMIT'
            const orderToken = order.symbol.split('_')[0]
            const orderPrice = order.symbol.split('_')[1]
            const renderType = (text) => {
                if (text === config.BUY_LIMIT || text === config.BUY_MARKET) {
                    return <span className="color-green">{
                        intl.get('MAIN_92') // 买入
                    }</span>
                } else {
                    return <span className="color-red">{
                        intl.get('MAIN_93') // 卖出
                    }</span>
                }
            }
            const renderPrice = (text) => {
                if (!isLimit) {
                    return <span>{
                        intl.get('MAIN_48_1') // 市价
                    }</span>
                }
                return <span>{this.toPriceNum(text, quotePrecision)}</span>
            }
            const renderAmount = (order) => {
                if (!isLimit) {
                    return <span>{'---'}</span>
                }
                return <span>{this.toAmountNum(order.amount)}</span>
            }
            const orderStatus = {
                'PAY_SUCCESS': intl.get('MAIN_51'),  //转账成功
                'UN_PAY': intl.get('MAIN_52'), //未支付
                'FULLY_FILLED': intl.get('MAIN_53'), //全部成交
                'PARTIAL_FILLED': intl.get('MAIN_54'),   //部分成交
                'PARTIAL_CANCELLED': intl.get('MAIN_55'),    //部分取消
                'FULLY_CANCELLED': intl.get('MAIN_56'),  //全部取消
                'SUBMITTED': intl.get('MAIN_57'),  //未成交
            }
            const colors = {
                'color-font-fourth': order.status.indexOf('SUBMITTED') > -1,
                'color-font-third': order.status.indexOf('CANCELLED') > -1,
                'color-green': order.status.indexOf('FILLED') > -1,
                'color-red': order.status.indexOf('UN_PAY') > -1,
            }
            const renderStatus = () => {
                if (type === config._my_orders) {
                    return order.canceling ?
                        <span className="color-font-fourth">{
                            intl.get('MAIN_49') // 撤销中
                        }</span>
                        :
                        <a className="outline-btn-rect" onClick={() => { this.doCancelOrder(order.id) }}>{
                            intl.get('MAIN_50') // 撤销
                        }</a>
                }
                else {
                    return null
                    // return <span className={cs(colors)}>{orderStatus[order.status]}</span>
                }
            }
            return (
                <div className="pt-20 bottom-line pb-15" onClick={(e) => {
                    if (e.target.nodeName !== 'A') {
                        this.getDetailH5(order.orderNo)
                        this.setState({
                            showDetail: true,
                            orderDetail: []
                        })
                    }
                }}>
                    <div className="ft-size-14 flex-between">
                        <p className="color-font-second ft-weight-400">
                            {renderType(order.type)}
                            <span className="ml-15">
                                {orderToken}/{orderPrice},
                            </span>
                            <span className="ml-15">
                                {/* 市价/限价 */}
                                {isLimit ? intl.get('MAIN_48_2') : intl.get('MAIN_48_3')}
                            </span>
                        </p>
                        <p>
                            <span className={cs(colors)}>{orderStatus[order.status]}</span>
                        </p>
                    </div>
                    <div className="flex order-card">
                        <div className="flex1 text-left color-font-second">
                            <section>
                                <label>{
                                    intl.get('MAIN_38') // 时间
                                }</label>
                                <p>
                                    {this.dateFormater(new Date(order.createdAt), 'd.m')}
                                </p>
                            </section>
                            <section>
                                <label>{
                                    intl.get('MAIN_40')  // 成交量
                                }</label>
                                <p>{this.toAmountNum(order.filledAmount)}</p>
                            </section>
                        </div>
                        <div className="flex1 text-center color-font-second">
                            <section>
                                <label>{
                                    intl.get('MAIN_48') // 单价
                                }/{orderPrice}</label>
                                <p>{renderPrice(order.price, order)}</p>
                            </section>
                            <section>
                                <label>{
                                    intl.get('MAIN_42') // 成交金额
                                }</label>
                                <p>{this.toPriceNum(order.price * order.filledAmount, quotePrecision)}</p>
                            </section>
                        </div>
                        <div className="flex1 text-right color-font-second">
                            <section>
                                <label>{
                                    intl.get('MAIN_41') // 挂单量
                                }/{orderToken}</label>
                                <p>{renderAmount(order)}</p>
                            </section>
                            <section>
                                <p className="pt-10">
                                    {renderStatus(order)}
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            )
        }

        const renderDetailCard = (order) => {
            return (
                <div className="flex order-card padding-x-10 bottom-line">
                    <div className="flex1 text-left color-font-grey">
                        <section>
                            {/* <label>{
                                intl.get('MAIN_44') // 哈希
                            }</label>
                            <p>
                                <a target="_blank" href={config._hash_url + (order.txid || '')}>
                                    {order.txid ? order.txid.substr(0, 12) : ''}...
                                </a>
                            </p> */}
                        </section>
                        <section>
                            <label>{
                                intl.get('MAIN_40')  // 成交量
                            }</label>
                            <p>{this.toAmountNum(order.amount)}</p>
                        </section>
                    </div>
                    <div className="flex1 text-center">
                        <section>
                            <label>{
                                intl.get('MAIN_38') // 时间
                            }</label>
                            <p>{this.dateFormater(new Date(order.createdAt))}</p>
                        </section>
                        <section>
                            <label>{
                                intl.get('MAIN_42') // 成交金额
                            }</label>
                            <p>{this.toPriceNum(order.price * order.amount, quotePrecision)}</p>
                        </section>
                    </div>
                    <div className="flex1 text-right">
                        <section>
                            <label>{
                                intl.get('MAIN_58') // 成交均价
                            }</label>
                            <p>{this.toPriceNum(order.price, quotePrecision)}</p>
                        </section>
                        <section>
                            <label>{
                                intl.get('MAIN_43') // 手续费
                            }</label>
                            <p>{this.toPriceNum(order.fee, quotePrecision)}</p>
                        </section>
                    </div>
                </div>
            )
        }

        const detailModal = () => {
            return (
                <Modal
                    blank
                    mask={true}
                    closable={true}
                    visible={this.state.showDetail}
                    onCancel={() => { this.setState({ showDetail: false }) }}
                    afterClose={() => { this.setState({ orderDetail: [] }) }}
                >
                    <div>
                        <div className="color-font-primary bottom-line pt-20 text-center ft-size-18">
                            {/* 订单详情 */}
                            {intl.get('MAIN_155')}
                        </div>
                        <Spin
                            spinning={this.state.detailLoading}
                        >
                            <div className="pt-10 pb-20" style={{ maxHeight: '3.5rem', overflow: 'scroll', WebkitOverflowScrolling: 'touch' }}>
                                {this.state.orderDetail.length === 0 ?
                                    <div className="mt-20 color-font-second">
                                        暂无订单详情
                                    </div>
                                    : this.state.orderDetail.map((item, index) => {
                                        return (
                                            <div key={index}>
                                                {renderDetailCard(item)}
                                            </div>
                                        )
                                    })}
                            </div>
                        </Spin>
                    </div>
                </Modal>
            )
        }

        // 委托列表
        const renderMyOrders = () => {
            return (
                <div className="color-bg-white mt-5">
                    <Tabs
                        defaultActiveKey={config._my_orders}
                        activeKey={this.state.ordersKey}
                        animated={false}
                        renderTabBar={(props) => (
                            <div className="h5-tabs color-font-fourth">
                                <TabBarH5 {...props} />
                            </div>)
                        }
                        onChange={key => {
                            if (key === config._my_orders) {
                                this.getMyOrders(true)
                            } else {
                                this.getMyHistoryOrders(true)
                            }
                            localStorage.setItem(config._orders_key, key)
                            this.setState({ ordersKey: key })
                        }}
                    >
                        {/* 委托列表 */}
                        <TabPane tab={intl.get('MAIN_98')} key={config._my_orders}>
                            <Spin spinning={this.state.loading.myOrders}>
                                {state.myOrdersList.length === 0 ?
                                    <div className="mt-40 mb-40 ft-size-16 text-center color-font-second"> {intl.get('MAIN_45')} </div>
                                    :
                                    <div style={{ height: '3.5rem', overflow: 'scroll', WebkitOverflowScrolling: 'touch', padding: '0 .1rem' }}>
                                        {state.myOrdersList.map((item, index) => {
                                            return (
                                                <div key={index}>
                                                    {renderOrderCard(item, config._my_orders)}
                                                </div>
                                            )
                                        })}
                                    </div>
                                }
                            </Spin>
                        </TabPane>
                        {/* 成交记录 */}
                        <TabPane tab={intl.get('MAIN_99')} key={config._finish_orders}>
                            <Spin spinning={this.state.loading.historyOrders}>
                                {state.myHistoryOrdersList.length === 0 ?
                                    <div className="mt-40 mb-40 ft-size-16 text-center color-font-second"> {intl.get('MAIN_45')} </div>
                                    :
                                    <div style={{ height: '3.5rem', overflow: 'scroll', WebkitOverflowScrolling: 'touch', padding: '0 .1rem' }}>
                                        {state.myHistoryOrdersList.map((item, index) => {
                                            return (
                                                <div key={index}>
                                                    {renderOrderCard(item, config._finish_orders)}
                                                </div>
                                            )
                                        })}
                                    </div>
                                }
                            </Spin>
                        </TabPane>
                    </Tabs>
                </div>
            )
        }

        const renderTradingView = (
            <div
                style={{
                    height: '2.5rem'
                }}
            >
                <TradingView
                    symbol={this.state.currentPair}
                    leftToolbar={false}
                    contextMenus={false}
                />
            </div>
        )

        return (
            <div>
                <HeaderH5 title={'币币交易'} />
                <div className={cs(_prefix)}>
                    {detailModal()}
                    {renderTickerMenu()}
                    {tickerInfo()}
                    {renderTradingView}
                    {renderDepth()}
                    {renderPublishOrders()}
                    {renderRecentOrders()}
                    {renderMyOrders()}
                </div>
            </div>
        );
    }
}

export default connect(SpotH5)
