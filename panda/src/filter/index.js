
import moment from 'moment';

export function formatDate(value, fmt) {
    fmt = fmt || 'YYYY-MM-DD HH:mm:ss'
    return moment(value).format(fmt)
}

export function lastDate(value) {
    var t = null;
    var d = null;
    var h = null;
    var m = null;
    var s = null;

    t = value / 1000;
    d = Math.floor(t / (24 * 3600));
    h = Math.floor((t - 24 * 3600 * d) / 3600);
    m = Math.floor((t - 24 * 3600 * d - h * 3600) / 60);
    s = Math.floor((t - 24 * 3600 * d - h * 3600 - m * 60));
    
    h = h < 10 ? `0${h}` : h;
    m = m < 10 ? `0${m}` : m;
    s = s < 10 ? `0${s}` : s;

    return ` ${d}天 ${h}:${m}:${s} `;
}

export function toRate(value) {
    if (typeof value !== 'number') {
        return (value * 100).toFixed(2) + '%';
    } else {
        let temp = Number(value);
        if (isNaN(temp)) {
            return '-';
        } else {
            return (temp * 100).toFixed(2) + '%';
        }
    }
}

export function toNum(value) {
    if (typeof value === 'number') {
        return isNaN(value) ? 0 : value;
    } else {
        let temp = Number(value)
        return isNaN(temp) ? 0 : temp;
    }
}