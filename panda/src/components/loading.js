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
                    height: '60px'
                }}
                    src="images/loading.gif"
                    alt=""/>
            </div>
        )
    }

}