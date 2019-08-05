import { get } from '../method'

import { url } from '../config';

const prefix = `${url}/trade/api/news`;

export default {

	// 获取新闻列表
	getNews: () => get(`${prefix}/list`)
}