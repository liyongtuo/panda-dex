import React, { Component } from 'react'
import datafeed from './datafeed';

const _container_id = 'matrix_tradingview'
const _library_path = 'charting_library/'

export default class TradingView extends Component {

    static defaultProps = {
        locale: 'zh',
        theme: 'Dark',
        fullscreen: false,
        autosize: true,
        symbol: '',
        leftToolbar: true,
        contextMenus: true,
    }

    componentDidMount() {
        this.symbol = ''
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.symbol !== this.symbol) {
            this.symbol = nextProps.symbol
            this.init(nextProps.symbol)
        }
    }

    init(symbol) {
        if (!symbol) return
        const options = {
            debug: false,
            symbol: symbol || this.props.symbol,
            datafeed: datafeed,
            interval: '15',
            container_id: _container_id,
            library_path: _library_path,
            locale: this.props.locale,
            disabled_features: [
                "use_localstorage_for_settings",
                "timeframes_toolbar",
                "header_symbol_search",
                "header_undo_redo",
                "header_compare",
                "compare_symbol",
                this.props.leftToolbar ? '' : 'left_toolbar',
                this.props.contextMenus ? '' : 'context_menus',
                "control_bar",
                "main_series_scale_menu",
                "display_market_status",
                "symbol_info",
            ],
            theme: this.props.theme,
            fullscreen: this.props.fullscreen,
            autosize: this.props.autosize,
            toolbar_bg: '#202a36',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            custom_css_url: 'css/overrides.css',
            overrides: {
                "paneProperties.background": "#202a36",
            }
        }
        const widget = window.tvWidget = new window.TradingView.widget(options);
        widget.onChartReady(() => {});
    }

    render() {
        return (
            <div id={_container_id} style={{ width: '100%', height: '100%' }}> </div>
        )
    }
}
