import { get, post } from '../method';
import {url} from '../config';

const request = {

    getSomething: (data) => get(`${url}/someUrl`, data),

    postSomething: (data) => post(`${url}/someUrl`, data),

    getAssets: data => get(`${url}/private/assets`, data)

};

export default request;
