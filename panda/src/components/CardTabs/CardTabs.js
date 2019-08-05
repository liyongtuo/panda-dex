import React, { Component } from 'react';
import { Tabs } from 'antd';

const _prefix = 'matrix-cardtab'

export default class CardTabs extends Component {

    render() {

        const renderFirstTabBar = (props, item, index) => {
            const active = item.key === props.activeKey
            const activeIndex = this.props.children.findIndex(value => {
                return value.key === props.activeKey
            })
            index = activeIndex > index ? index : this.props.children.length - index
            return (
                <div
                    className={`${_prefix}-tab ${active ? 'active' : ''} flex-center`}
                    onClick={() => { props.onChange(item.key) }}
                    key={item.key}
                    style={{
                        zIndex: !active ? index : '',
                        boxShadow: !active ? '0 0 .05rem 0 rgba(166,183,227,0.3)' : ''
                    }}
                >
                    {item.props.tab}
                    {
                        active ?
                            <span className={`${_prefix}-tab-append-after`}></span>
                            : <span className={`${_prefix}-tab-append-bottom`}></span>
                    }
                    <span className={`${_prefix}-tab-append-top`}></span>
                </div>
            )
        }
        const renderOtherTabBar = (props, item, index) => {
            const active = item.key === props.activeKey
            const activeIndex = this.props.children.findIndex(value => {
                return value.key === props.activeKey
            })
            index = activeIndex > index ? index : this.props.children.length - index
            return (
                <div
                    className={`${_prefix}-tab ${active ? 'active' : ''} flex-center`}
                    onClick={() => { props.onChange(item.key) }}
                    key={item.key}
                    style={{
                        zIndex: !active ? index : '',
                        boxShadow: !active ? '0 0 .05rem 0 rgba(166,183,227,0.3)' : ''
                    }}
                >
                    {item.props.tab}
                    {
                        active ?
                            <span>
                                <span className={`${_prefix}-tab-append-before`}></span>
                                <span className={`${_prefix}-tab-append-after`}></span>
                            </span>
                            : null
                    }
                    <span className={`${_prefix}-tab-append-top`}></span>
                </div>
            )
        }

        const renderTabBar = (props) => {
            return (
                <div className={`${_prefix}-tabbar flex`}>
                    {this.props.children.map((item, index) => {
                        if (index === 0) {
                            return renderFirstTabBar(props, item, index)
                        } else {
                            return renderOtherTabBar(props, item, index)
                        }
                    })}
                </div>
            )
        }

        return (
            <div className={`${_prefix} ${_prefix}-tabs${this.props.activeKey === this.props.firstKey ? '-first' : ''}`}>
                <Tabs
                    renderTabBar={renderTabBar}
                    animated={false}
                    style={this.props.style}
                    {...this.props}
                >
                    {this.props.children}
                </Tabs>
                {
                    this.props.titleAppend ?
                        <div className={`${_prefix}-append`}>
                            {this.props.titleAppend}
                        </div>
                        :
                        null
                }
            </div>
        );
    }
}