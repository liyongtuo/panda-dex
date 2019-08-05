import emitter from '../../../util/events';
import config from '../config';

const intervalMap = config.intervalMap
const subMap = {}
export default {
    subscribeBars: (symbolInfo, resolution, updateCb, uid, resetCache) => {
        console.log(symbolInfo, resolution, updateCb, uid, resetCache)
        subMap[uid] = resolution
        emitter.emit('addKline', intervalMap[resolution])
        emitter.addListener('onKline', (msg) => {
            msg.forEach(item => {
                const data = {
                    time: item[0],
                    open: item[1],
                    hight: item[2],
                    low: item[3],
                    close: item[4],
                    volume: item[5],
                }
                updateCb(data)
            })
        })
    },
    unsubscribeBars: (uid) => {
        console.log(uid)
        emitter.emit('removeKline', intervalMap[subMap[uid]])
    }
}