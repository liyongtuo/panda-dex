import React from 'react'
import ReactDOM from 'react-dom'
import Notification from './Notification'

function renderNotification(instance, container) {
    return new Promise((resolve, reject) => {
        try {
            ReactDOM.render(instance, container, function() {
                resolve(this)
            })
        } catch (e) {
            reject(e)
        }
    })
}

async function createNotification() {
    const div = document.createElement('div')
    document.body.appendChild(div)
    const notification = await renderNotification(<Notification />, div)
    return {
        addNotice(notice) {
            return notification.addNotice(notice)
        },
        hide() {
            notification.hide()
        },
        destroy() {
            ReactDOM.unmountComponentAtNode(div)
            document.body.removeChild(div)
        }
    }
}

let notification
const notice = async (type, content, duration = 2, onClose, mask = true) => {
    if (!notification) notification = await createNotification()
    return notification.addNotice({ type, content, duration, onClose, mask })
}

export default {
    fail(content, duration, onClose, mask) {
        return notice('fail', content, duration, onClose, mask)
    },
    warning(content, duration, onClose, mask) {
        return notice('warning', content, duration, onClose, mask)
    },
    success(content, duration, onClose, mask) {
        return notice('success', content, duration, onClose, mask)
    },
    offline(content, duration, onClose, mask) {
        return notice('offline', content, duration, onClose, mask)
    },
    lock(content, duration, onClose, mask) {
        return notice('lock', content, duration, onClose, mask)
    },
    loading(content, duration = 0, onClose, mask) {
        return notice('loading', content, duration, onClose, mask)
    },
    hide() {
        notification.hide()
    }
}