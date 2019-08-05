import historyProvider from './historyProvider';
import realtimeProvider from './realtimeProvider';

const supportedResolutions = ['1', '5', '15', '30', '60', '120', 'D', 'W']

const config = {
    supported_resolutions: supportedResolutions
}

export default {
    onReady: cb => {
        setTimeout(() => {
            cb(config)
        }, 0);
    },
    resolveSymbol: (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
        const split_data = symbolName.split('_')
        const symbol_stub = {
            name: split_data[0] + '/' + split_data[1],
            ticker: symbolName,
            description: '',
            type: 'crypto',
            session: '24x7',
            exchange: 'Matrix',
            timezone: 'Etc/UTC',
            ticker: symbolName,
            minmov: 1,
            pricescale: 100000000,
            has_intraday: true,
            // intraday_multipliers: ['1', '60'],
            supported_resolution: supportedResolutions,
            volume_precision: 8,
            data_status: 'streaming',
        }
        setTimeout(() => {
            onSymbolResolvedCallback(symbol_stub)
        }, 0);
    },
    getBars: function (symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) {
        historyProvider.getBars(symbolInfo, resolution, from, to, firstDataRequest)
            .then(bars => {
                if (bars.length) {
                    onHistoryCallback(bars, { noData: false })
                } else {
                    onHistoryCallback(bars, { noData: true })
                }
            }).catch(err => {
                console.log({ err })
                onErrorCallback(err)
            })
    },
    subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) => {
        realtimeProvider.subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback)
    },
    unsubscribeBars: subscriberUID => {
        realtimeProvider.unsubscribeBars(subscriberUID)
    }
}