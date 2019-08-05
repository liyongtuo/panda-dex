import React, { Component } from 'react'

import { Table as AntTable } from 'antd'

export default class Table extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    shouldComponentUpdate(nextProps, nextState) {
        const propsTemp = {...this.props, locale: ''}
        const nextPropsTemp = {...nextProps, locale: ''}
        return JSON.stringify(propsTemp) !== JSON.stringify(nextPropsTemp)
    }

    render() {
        return (
            <AntTable {...this.props} />
        )
    }
}
