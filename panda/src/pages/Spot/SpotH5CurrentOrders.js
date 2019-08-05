import React, { Component } from 'react';
import cs from 'classnames';
import {
    Modal,
} from '@/components';
import { Spin, Tabs } from 'antd';
import connect from '@/store/connect';
import service from './service';
import util from './util';
import mixins from '@/mixins/mixin';
import config from './config';
import intl from 'react-intl-universal';
import { hot } from 'react-hot-loader'

const _prefix = 'matrix-spot-h5'

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
        this.state = {
            showDetail: false,
            orderDetail: [],
            detailLoading: false,
        }
    }

    render() {

        let { state, props } = this
        // 价格显示精度
        const quotePrecision = 6

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
                        {/* <p className="ml-10 color-font-second">
                            {this.dateFormater(new Date(order.createdAt))}
                        </p> */}
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
                    <div className="flex1 text-left color-font-second">
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
                    <div className="flex1 text-center color-font-second">
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
                    <div className="flex1 text-right color-font-second">
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
                    // blank
                    mask={true}
                    closable={true}
                    visible={this.state.showDetail}
                    onCancel={() => { this.setState({ showDetail: false }) }}
                    afterClose={() => { this.setState({ orderDetail: [] }) }}
                >
                    <div>
                        <div className="color-font-second bottom-line pt-20 text-center ft-size-18">
                            {/* 订单详情 */}
                            {intl.get('MAIN_155')}
                        </div>
                        <Spin
                            spinning={this.state.detailLoading}
                        >
                            <div className="pt-10 pb-20" style={{ maxHeight: '3.5rem', overflow: 'scroll', WebkitOverflowScrolling: 'touch' }}>
                                {this.state.orderDetail.map((item, index) => {
                                    console.log(item)
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
                <div className="">
                    {/* 委托列表 */}
                    <Spin spinning={props.loading}>
                        {props.dataSource.length === 0 ?
                            <div className="mt-40 mb-40 ft-size-16 text-center color-font-second"> {intl.get('MAIN_45')} </div>
                            :
                            <div style={{ height: '3.5rem', overflow: 'scroll', WebkitOverflowScrolling: 'touch', padding: '0 .1rem' }}>
                                {props.dataSource.map((item, index) => {
                                    return (
                                        <div key={index}>
                                            {renderOrderCard(item, config._my_orders)}
                                        </div>
                                    )
                                })}
                            </div>
                        }
                    </Spin>
                </div>
            )
        }


        return (
            <div>
                <div className={cs(_prefix)}>
                    {detailModal()}
                    {renderMyOrders()}
                </div>
            </div>
        );
    }
}

export default connect(SpotH5)
