import config from '../config';

const intervalMap = config.intervalMap

export default {
    getBars: (symbolInfo, resolution, from, to, first) => {
        console.log(resolution, from, to)
        const data = {
            "symbol": symbolInfo.ticker,
            "startT": from,
            "endT": to,
            "interval": intervalMap[resolution],
        }
        return Storage.Service.postApiKlineV1AccessSymbolList(data).then(res => {
            if (res.success === 'SUCCESS') {
                const dataSet = new Set()
                const bars = []
                res.data.forEach(item => {
                    if (!dataSet.has(item[0])) {
                        dataSet.add(item[0])
                        bars.push({
                            time: item[0] * 1000,
                            open: item[1],
                            high: item[2],
                            low: item[3],
                            close: item[4],
                            volume: item[5],
                        })
                    }
                })
                console.log(bars)
                return bars.reverse()
            } else {
                return []
            }
        })
    }
}