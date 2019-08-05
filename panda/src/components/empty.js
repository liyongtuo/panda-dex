import React, {Component} from 'react';

export default class Empty extends Component {

    render() {
        return (
            <div
                style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: '#fff',
                paddingTop: 40,
                paddingBottom: 40
            }}>
                <img
                    style={{
                    width: '100px',
                    height: '100px'
                }}
                    src="images/empty.png"
                    alt=""/>
                <p
                    style={{
                    color: '#ccc',
                    fontSize: 12
                }}>暂无数据</p>
            </div>
        )
    }

}