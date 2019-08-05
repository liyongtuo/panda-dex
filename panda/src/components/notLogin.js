import React, { Component } from 'react';
import connect from '../store/connect';

class notLogin extends Component {

    render() {
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    paddingTop: 40,
                    paddingBottom: 40
                }}>
                <img
                    style={{
                        height: '150px'
                    }}
                    src={require('../images/UserIcon.png')}
                    alt="" />
                <a style={{
                    paddingTop: 20
                }} onClick={() => this.props.history.replace('/auth/login')}>去登录</a>
            </div>
        )
    }

}

export default connect(notLogin);