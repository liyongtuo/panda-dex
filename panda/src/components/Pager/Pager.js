import React, { Component } from 'react';
import { Pagination } from 'antd';
import intl from 'react-intl-universal';

const _prefix = 'matrix-pager'

export default class Pager extends Component {

    itemRender(current, type, originalElement) {
        if (type === 'prev') {
            return <a className={`${_prefix}-button`}>{intl.get('LAST_PAGE')}</a>;
        } if (type === 'next') {
            return <a className={`${_prefix}-button`}>{intl.get('NEXT_PAGE')}</a>;
        }
        return originalElement;
    }

    render() {
        return (
            <div className={`${_prefix} text-right mt-15`}>
                <Pagination
                    {...this.props}
                    // showSizeChanger
                    // showQuickJumper
                    // itemRender={this.itemRender}
                    // size="small"
                />
                <span className="ml-10 mr-5">
                    {intl.get('TOTAL')} {this.props.total / this.props.pageSize} {intl.get('PAGE')}
                </span>
            </div>
        );
    }
}