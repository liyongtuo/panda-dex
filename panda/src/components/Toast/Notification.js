import React, { Component } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import Notice from './Notice'

export default class Notification extends Component {
    constructor() {
        super()
        this.transitionTime = 300
        this.state = { notices: [] }
        this.removeNotice = this.removeNotice.bind(this)
        this.removed = false
    }

    getNoticeKey() {
        const { notices } = this.state
        return `notice-${new Date().getTime()}-${notices.length}`
    }

    componentWillUnmount() {
        this.removed = true
    }

    addNotice(notice) {
        const { notices } = this.state
        notice.key = this.getNoticeKey()
        if (notices.every(item => item.key !== notice.key)) {
            notices.push(notice)
            this.setState({ notices })
            if (notice.duration > 0) {
                setTimeout(() => {
                    this.removeNotice(notice.key)
                }, notice.duration * 1000)
            }
        }
        return () => { this.removeNotice(notice.key) }
    }

    removeNotice(key) {
        const { notices } = this.state
        if (this.removed) {
            return
        }
        this.setState({
            notices: notices.filter((notice) => {
                if (notice.key === key) {
                    if (notice.onClose) setTimeout(notice.onClose, this.transitionTime)
                    return false
                }
                return true
            })
        })
    }

    hide() {
        this.setState({
            notices: []
        })
    }

    render() {
        const { notices } = this.state
        return (
            <div>
                <TransitionGroup className="toast-notification">
                    {
                        notices.map(notice => (
                            <CSSTransition
                                key={notice.key}
                                classNames="toast-notice-wrapper"
                                timeout={this.transitionTime}
                            >
                                <div>
                                    {notice.mask ? <div className="overlay"></div> : null}
                                    <Notice {...notice} />
                                </div>
                            </CSSTransition>
                        ))
                    }
                </TransitionGroup>
            </div>
        )
    }
}