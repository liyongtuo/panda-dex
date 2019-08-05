import React, { Component } from 'react'

export default class PureTable extends Component {

    render() {
        const { columns, dataSource } = this.props
        
        return (
            <table>
                <thead>
                    <tr>
                        {columns.map((item, index) => {
                            return <th key={index}>{item.title}</th>
                        })}
                    </tr>
                </thead>
                <tbody>
                    {dataSource.map((item, index) => {
                        return <tr key={index}>{
                            columns.map((column, columnIndex) => {
                                if (!column.render) return <td key={columnIndex}>{item[column.key]}</td>
                                return <td key={columnIndex}>{column.render(column.key ? item[column.key] : item, item)}</td>
                            })
                        }</tr>
                    })}
                </tbody>
            </table>
        )
    }
}
