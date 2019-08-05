import React, { Component } from 'react'

import { Table, Popover, Icon } from "antd";

class MyTable extends Component {

    constructor(props) {
        super(props);

        this.state = {
            active: {}
        };
    }

    // 渲染过滤表头
    renderFilter(datas) {
        let { title, filter, key, multiple } = datas;

        let items = filter.map((item, index) => (
            <a
                onClick={() => {
                    if (!multiple) {
                        this.setState({ [key]: false })
                    }
                }}
                key={String(index)}
                data-id={`${key}-${index}`}
                className={this.state.active[key] && this.state.active[key].indexOf(`${index}`) > -1 ? 'active' : ''}>
                {item}
            </a>
        ));

        const div = (
            <div className={`filters ${multiple ? 'multiple' : ''}`} onClick={(e) => this.doTableFilter(e)}>{items}</div>
        );

        return (
            <Popover visible={this.state[key]} placement="bottom" content={div} trigger="hover" onVisibleChange={v => this.setState({ [key]: v })}>
                <a onClick={() => this.setState({ [key]: true })}>{this.getActive(key) || title}<Icon type="caret-down" style={{ fontSize: '.10rem',position: 'relative', top:'-.02rem', left: '.02rem', transition: 'all .5s', transform: this.state[key] ? 'rotate(-180deg)' : 'rotate(0)', }} /></a>
            </Popover>
        )
    }

    // 获取已选过滤方法的名字
    getActive(key) {

        let str = this.state.active[key] || '';
        let columns = [...this.props.columns];

        for (let i = 0; i < columns.length; i++) {
            if (key === columns[i].key) {
                if (str) {
                    if (columns[i].filter[str] === '全部') {
                        return '';
                    } else if (str.indexOf('&') > -1) {
                        return ' ' + columns[i].filter[str.split('&')[0]] + '..';
                    } else {
                        return ' ' + columns[i].filter[str];
                    }
                } else {
                    return '';
                }
            }
        }

    }

    // 执行过滤方法
    doTableFilter(e) {

        let id = e.target.dataset.id || '';
        let active = { ...this.state.active };
        let columns = [...this.props.columns];

        let key = id.split('-')[0];
        let value = id.split('-')[1];

        if (active[key]) {
            for (let i = 0; i < columns.length; i++) {
                if (key === columns[i].key) {
                    let temp = active[key].split('&');
                    if (columns[i].multiple) {
                        if (temp.indexOf(value) > -1) {
                            temp.splice(temp.indexOf(value), 1);
                        } else {
                            temp.push(value);
                        }
                    } else {
                        temp = temp.indexOf(value) > -1 ? [] : [value];
                    }
                    active[key] = temp.join('&');
                    this.setState({ active }, () => this.cbk());
                    return;
                }
            }
        }

        this.setState({ active: { ...active, [key]: value } }, () => this.cbk());

    }

    // 执行父组件回调方法
    cbk() {

        if (this.props.doFilter) {
            let obj = {};
            let columns = [...this.props.columns];
            for (let k in this.state.active) {
                try {
                    for (let i = 0; i < columns.length; i++) {
                        if (k === columns[i].key) {
                            if (columns[i].multiple) {
                                let temp = this.state.active[k].split('&');
                                let res = [];
                                for (let j of temp) {
                                    res.push(columns[i].filterValue[j]);
                                }
                                obj[k] = res.join('&');
                                break;
                            } else {
                                obj[k] = columns[i].filterValue[this.state.active[k]];
                                break;
                            }
                        }
                    }
                } catch (e) {
                    obj[k] = this.state.active[k];
                }
            }
            this.props.doFilter(obj);
        }

    }

    // 深复制
    deepClone(obj) {

        let objClone = Array.isArray(obj) ? [] : {};
        if (obj && typeof obj === "object") {
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (obj[key] && typeof obj[key] === "object") {
                        objClone[key] = this.deepClone(obj[key]);
                    } else {
                        objClone[key] = obj[key];
                    }
                }
            }
        }
        return objClone;

    }

    render() {

        // 渲染表头
        let columns = [];
        this.props.columns.map((item) => {
            let temp = this.deepClone(item);
            if (temp.filter) {
                temp.title = this.renderFilter(temp);
                // 前端过滤 过滤方法
                // this.filterMethod[temp.key] = Array.from({...temp.filterMethod, length: temp.filter.length}, (item) => {
                //     if (item) {
                //         return item;
                //     }
                //     return () => true;
                // });
            }
            columns.push(temp);
        });

        // 前端过滤 渲染数据
        // let dataSource = [...this.props.dataSource];
        // this.state.active.map((item) => {
        //     dataSource = [...dataSource].filter((record) => this.filterMethod[item.split('-')[0]][item.split('-')[1]](record))
        // });

        return (
            <Table {...this.props} columns={columns} />
        )

    }
}

export default MyTable