import React, { Component } from 'react';

export default class Captcha extends Component {
    constructor(props) {
        super(props);
        this.state = {
            captcha: ''
        }
    }

    componentDidMount = () => {
        this.getCaptcha()
    }

    getCaptcha() {
        Storage.Service.getCommonAccessCaptcha().then(res => {
            if (res.response_code === '00') {
                this.setState({captcha: 'data:image/jpg;base64,' + res.content})
            }
        })
    }

    reload() {
        this.getCaptcha()
    }
    
    render() {
        return (
            <div className="matrix-captcha" onClick={ () => { this.getCaptcha() } }>
                <img src={this.state.captcha} alt=""/>
            </div>
        );
    }
}