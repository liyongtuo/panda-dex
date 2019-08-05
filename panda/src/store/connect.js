import * as actions from './actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
// import Util from '../util'
import server from '../service';

const _events = '_events';

const mapStateToProps = (state) => {
    return state;
};

const mapDispatchToProps = (dispatch) => {
    const getAssets = () => {
        // server.getWalletAssets().then(res => {
        //     Util.handleResponse(res, () => {
        //         dispatch(actions.setAssetsType(res.content));
        //
        //         setAssets()
        //     }, true)
        // })
    };

    const setAssets = () => {
        // server.getWalletMyAssets().then(res => {
        //     Util.handleResponse(res, () => {
        //         dispatch(actions.setAssets(res.content, 'asset'))
        //     }, true)
        // });

        // server.getOtcListSellBuy().then(res => {
        //     Util.handleResponse(res, () => {
        //         dispatch(actions.setAssets(res.content))
        //     }, true)
        // });

        // server.getMarketAssetsPrice().then(res => {
        //     Util.handleResponse(res, () => {
        //         dispatch(actions.setAssets(res.content, 'price'))
        //     }, true)
        // });
    };

    const baseInfo = () => {
        server.getSettingUserBaseInfo().then(res => {
            if (res.response_code === '00') {
                if (res.content) {
                    dispatch(actions.setBaseInfo(res.content))
                }
            }
        });
        server.getSettingKycInfo().then(res => {
            if (res.response_code === '00') {
                if (res.content) {
                    dispatch(actions.setKycInfo(res.content))
                }
            }
        });
        server.getSettingSafetyInfo().then(res => {
            if (res.response_code === '00') {
                if (res.content) {
                    dispatch(actions.setSafetyInfo(res.content))
                }
            }
        })
    };

    return {
        // 注入请求服务
        ...server,
        // 设置用户信息
        setInfo: () => {
            return new Promise((resolve) => {
                server.getAuthLoginInfo().then(res => {
                    if (res.response_code === '00') {
                        if (res.content) {
                            dispatch(actions.setLogin(true))
                            dispatch(actions.setInfo(res.content))
                        }
                        dispatch(actions.setLogin(true))
                        dispatch(actions.setInfo(res.content))
                        baseInfo();
                        getAssets();
                        resolve(true)
                    } else {
                        dispatch(actions.setLogin(false))
                        resolve(false)
                    }
                }).catch(err => {
                    resolve(false)
                })
            })
        },

        getMessage: (api_key) => {
            if (!api_key) {
                return
            }
            server.getMessageNoticeCount(api_key).then(res => {
                if (res.response_code === '00') {
                    dispatch(actions.setMessageCount(res.content))
                }
            })
            server.getMessageSystem(api_key).then(res => {
                if (res.response_code === '00') {
                    dispatch(actions.setMessageSys([...res.content]))
                }
            })
            server.getMessageP2P(api_key).then(res => {
                if (res.response_code === '00') {
                    dispatch(actions.setMessageP2p([...res.content]))
                }
            })
        },

        setIsMobile: (data) => {
            dispatch(actions.setIsMobile(data))
        },

        setLogin: (data) => {
            dispatch(actions.setLogin(data))
        },

        setDetail: (data) => {
            dispatch(actions.setDetail(data))
        },

        setChart: (data) => {
            dispatch(actions.setChart(data))
        },

        setLatest: (data) => {
            dispatch(actions.setLatest(data))
        },

        setOrders: (data) => {
            dispatch(actions.setOrders(data))
        },

        setBaseInfo: (data) => {
            dispatch(actions.setBaseInfo(data))
        },

        setKycInfo: (data) => {
            dispatch(actions.setKycInfo(data))
        },

        setSafetyInfo: (data) => {
            dispatch(actions.setSafetyInfo(data))
        },

        setLogout: (props) => {
            // server.getAuthLogout().then(res => {
            //     if (res.response_code === 'AUTH_NOT_LOGIN') {
            //         dispatch(actions.setLogin(false));
            //         props.history.push('/auth/login')
            //         return
            //     }
            //     Util.handleResponse(res, () => {
            //         dispatch(actions.setLogin(false));
            //         props.history.push('/auth/login')
            //     })
            // });
        },

        setAssets: setAssets,

        setPrice: () => {
            // server.getMarketAssetsPrice().then(res => {
            //     Util.handleResponse(res, () => {
            //         dispatch(actions.setAssets(res.content, 'price'))
            //     }, true)
            // });
        },

        setClickEvent: (id, params) => {
            const data = {
                click_id: id,
                device: 'web',
                device_id: '',
                params: params || {},
                create_time: new Date().getTime()
            }
            const events = JSON.parse(localStorage.getItem(_events)) || []
            events.push(data)
            localStorage.setItem(_events, JSON.stringify(events))
            if (events.length > 10) {
                localStorage.setItem(_events, JSON.stringify(events))
            } else {
                server.postCommonAccessClickEvent(events).then(res => {
                    if (res.response_code === '00') {
                        localStorage.setItem(_events, '[]')
                    }
                })
            }
        },

        setUserLang: () => {
            var obj = {
                'zh-CN': 0,
                'en-US': 2
            };
            const data = {
                language: obj[localStorage.getItem('lang')]
            };
            // const data = {
            // 	language: localStorage.getItem('lang')
            // }
            return server.postSettingModifyLang(data)
        },

        getAssets: getAssets
    }
};

export default (c, withoutRouter) => {
    if (withoutRouter) {
        return connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(c);
    } else {
        return withRouter(connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(c));
    }
}
