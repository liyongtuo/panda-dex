import React, { Component } from 'react'

export default class TabBarH5 extends Component {
    render() {
        const renderTabBar = (props, item, index) => {
            if (!item.props.tab) return null
            const active = item.key === props.activeKey
            return (
                <div
                    key={item.key}
                    className={`h5-tab`}
                    onClick={() => { props.onChange(item.key) }}
                >
                    <span className={`${active ? 'active' : ''}`}>
                        {item.props.tab}
                    </span>
                </div>
            )
        }

        return (
            <div className="h5-tabbar">
                {
                    this.props.panels.map((item, index) => {
                        return renderTabBar(this.props, item, index)
                    })
                }
            </div>
        )
    }
}
