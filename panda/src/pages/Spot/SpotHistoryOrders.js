import React, { Component } from 'react';
import {
    Icon,
} from 'antd';
import intl from 'react-intl-universal';
import cs from 'classnames';
import Table from './Table';
import connect from '@/store/connect';
import service from './service';
import util from './util';
import mixins from '@/mixins/mixin';
import config from './config';
import { hot } from 'react-hot-loader';

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
        this.state = {
            assets: {},
            expandedRowKeys: new Set([]),
            expandedRowLoading: new Set([]),
            expandedRowData: {},
            
        }
    }

    render() {

        // 价格显示精度
        const quotePrecision =  6

        // 委托单详情表
        const detailColumns = [
            {
                title: intl.get('MAIN_38'), // 时间
                dataIndex: 'createdAt',
                width: 200,
                render: (text) => {
                    return <span className="color-primary-light">{this.dateFormater(new Date(text), 's/')}</span>
                }
            }, {
                title: intl.get('MAIN_39'), // 成交单价
                dataIndex: 'price',
                render: (text, record) => {
                    return <span className="color-primary-light">{this.toPriceNum(text, quotePrecision)} {this.getPriceBySymbol(record.symbol)}</span>
                }
            }, {
                title: intl.get('MAIN_40'), // 成交数量
                dataIndex: 'amount',
                render: (text, record) => {
                    return <span className="color-primary-light">{this.toAmountNum(text)}</span>
                }
            }, {
                title: intl.get('MAIN_42'),  // 成交金额
                dataIndex: 'total',
                render: (text, record) => {
                    return <span className="color-primary-light">{(record.price * record.amount).toFixed(this.getDecimalDigits(record.price))}</span>
                }
            }, {
                title: intl.get('MAIN_43'), // 手续费
                dataIndex: 'fee',
                render: (text, record) => {
                    // const orderToken = record.symbol.split('_')[0]
                    const orderPrice = record.symbol.split('_')[1]
                    return <span className="color-primary-light">
                        {this.toPriceNum(text, quotePrecision)} {orderPrice}
                    </span>
                }
            }
        ]

        // 委托详情展开
        const expandedRowRender = (record) => {
            return (
                <Table
                    dataSource={this.state.expandedRowData[record.orderNo] ?
                        this.state.expandedRowData[record.orderNo].map(item => {
                            item.orderType = record.type
                            item.symbol = record.symbol
                            return item
                        }) : []
                    }
                    columns={detailColumns}
                    loading={this.state.expandedRowLoading.has(record.orderNo)}
                    className="detail-table"
                    rowKey={'id'}
                    pagination={false}
                    locale={{
                        emptyText: intl.get('MAIN_45') // 暂无交易数据
                    }}
                // size='small'
                />
            )
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

        // 成交记录 columns
        const myHistoryOrdersColumns = [
            {
                title: intl.get('MAIN_38'),  // 时间
                dataIndex: 'createdAt',
                width: '8%',
                align: 'left',
                render: (text) => {
                    return <span className="color-font-primary">{this.dateFormater(new Date(text), 's/')}</span>
                }
            }, {
                title: intl.get('MAIN_46'),    // 交易对
                dataIndex: 'symbol',
                width: '5%',
                align: 'right',
                render: (text) => {
                    const token = text.split('_')[0].toUpperCase()
                    const price = text.split('_')[1].toUpperCase()
                    return <span className="color-font-primary">{token}/{price}</span>
                }
            }, {
                title: intl.get('MAIN_47'),  // 方向
                dataIndex: 'type',
                width: '5%',
                align: 'right',
                render: (text) => {
                    if (text === config.BUY_LIMIT || text === config.BUY_MARKET) {
                        return <span className="color-green">{
                            intl.get('MAIN_92')  // 买入
                        }</span>
                    } else {
                        return <span className="color-red">{
                            intl.get('MAIN_93')  // 卖出
                        }</span>
                    }
                }
            }, {
                title: intl.get('MAIN_48'), // 委托价
                dataIndex: 'price',
                width: '8%',
                align: 'right',
                render: (text, record) => {
                    if (record.type === 'BUY_MARKET' || record.type === 'SELL_MARKET') {
                        return <span className="color-font-primary">{
                            intl.get('MAIN_48_1') // 市价
                        }</span>
                    }
                    return <span className="color-font-primary">{this.toPriceNum(text, quotePrecision)} {this.getPriceBySymbol(record.symbol)}</span>
                }
                // }, {
                //     title: intl.get('MAIN_58'), // 成交均价
                //     width: '10%',
                //     align: 'right',
                //     render: (text, record) => {
                //         return <span className="color-primary-light">{this.toPriceNum(record.avg, quotePrecision)}</span>
                //     }
            }, {
                // title: intl.get('MAIN_40') + '/' + intl.get('MAIN_41'),  // 成交数量/委托数量
                title: intl.get('MAIN_41'),  // 挂单量
                width: '8%',
                align: 'right',
                render: (text, record) => {
                    const amount = record.type === 'BUY_MARKET' ? '--' : this.toAmountNum(record.amount) + ' ' + this.getTokenBySymbol(record.symbol)
                    return <span className="color-font-primary">{amount}</span>
                }
            }, {
                // title: intl.get('MAIN_40') + '/' + intl.get('MAIN_41'),  // 成交数量/委托数量
                title: intl.get('MAIN_40'),  // 成交量
                width: '8%',
                dataIndex: 'filledAmount',
                align: 'right',
                render: (text, record) => {
                    return <span className="color-font-primary">{this.toAmountNum(text)}</span>
                }
            }, {
                title: intl.get('MAIN_42'), // 成交金额
                width: '8%',
                align: 'right',
                render: (text, record) => {
                    return <span className="color-font-primary">{this.toPriceNum(record.avg * record.filledAmount, quotePrecision)}</span>
                }
                // }, {
                //     title: intl.get('MAIN_44'),  // 哈希
                //     width: '10%',
                //     dataIndex: 'txid',
                //     align: 'right',
                //     render: (text) => {
                //         return <span className="color-font-primary">
                //             <a target="_blank" href={config._hash_url + text}>
                //                 {text ? text.substr(0, 15) : ''}...
                //             </a>
                //         </span>
                //     }
            }, {
                title: intl.get('MAIN_44_1'),  // 状态
                width: '7%',
                dataIndex: 'status',
                align: 'right',
                render: (text) => {
                    const colors = {
                        'color-font-second': text.indexOf('CANCELLED') > -1,
                        'color-green': text.indexOf('FILLED') > -1,
                        'color-red': text.indexOf('UN_PAY') > -1,
                    }
                    return (
                        <span className={cs(colors)}>
                            {orderStatus[text]}
                        </span>
                    )
                }
            }, {
                title: intl.get('MAIN_14'),  // 操作
                width: '5%',
                align: 'right',
                render: (text, record) => {
                    return (
                        <span>
                            <span className="click-darkblue " onClick={() => {
                                if (this.state.expandedRowKeys.has(record.orderNo)) {
                                    this.state.expandedRowKeys.delete(record.orderNo)
                                } else {
                                    this.state.expandedRowKeys.add(record.orderNo)
                                    this.state.expandedRowLoading.add(record.orderNo)
                                    this.getOrderDetail(record.orderNo)
                                }
                                this.setState({
                                    expandedRowKeys: this.state.expandedRowKeys,
                                    expandedRowLoading: this.state.expandedRowLoading,
                                })
                            }}>{
                                    intl.get('MAIN_50_1') // 详情
                                }<Icon
                                    style={{
                                        fontSize: '.12rem',
                                        transition: 'all .5s',
                                        marginLeft: '.05rem',
                                        transform: this.state.expandedRowKeys.has(record.orderNo) ? 'rotate(-180deg)' : 'rotate(0)',
                                    }}
                                    type="caret-down"
                                    theme="outlined"
                                /></span>
                        </span>
                    )
                }
            }
        ]

        // 委托列表
        const renderMyOrders = (
            <div>
                <Table
                    dataSource={this.props.dataSource}
                    columns={myHistoryOrdersColumns}
                    loading={this.props.loading}
                    expandedRowRender={expandedRowRender}
                    expandLoading={Array.from(this.state.expandedRowLoading)}
                    expandedRowKeys={Array.from(this.state.expandedRowKeys)}
                    rowKey={'orderNo'}
                    className="orders-table"
                    rowClassName={() => {
                        return 'row-my-orders'
                    }}
                    pagination={false}
                    size="small"
                    locale={{
                        emptyText:
                            <div className="height-300 flex-center">
                                <div>
                                    <img src={require('@/images/empty.png')} />
                                    <div className="color-primary-light ft-size-16 mt-20">
                                        <p>
                                            {intl.get(`USER_ORDERS_TIP_NO_ORDERS_1`)}
                                        </p>
                                        <p>
                                            {intl.get(`USER_ORDERS_TIP_NO_ORDERS_2`)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                    }}
                />
            </div>
        )

        return (
            <div className="matrix-spot">
                <div className="mt-10">
                    <div style={{ flex: 1, minWidth: '6rem' }}>
                        {renderMyOrders}
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(Spot)
