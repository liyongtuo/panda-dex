import intl from 'react-intl-universal';

var obj = {
	'zh-CN': 0,
	'en-US': 2
}

const handleErr = (err) => {
	if (err.message === 'Failed to fetch') {
		return { response_msg: intl.get('ERROR_NETWORK') }
	} else {
		return { response_msg: intl.get('ERROR_SERVER_IS_NOT_AVALIABLE') }
	}
}

const doGetFetch = url => {
	return new Promise((resolve, reject) => {
		fetch(url, {
			method: "GET",
			credentials: "include",
			headers: {
				"language": obj[localStorage.getItem('lang')],
				"Accept-Language": intl.getInitOptions().currentLocale,
			},
		})
			.then(response => response.json())
			.then(res => resolve(res))
			.catch(err => reject(err));
	});
};

const doGetWithToken = url => {
	const token = localStorage.getItem('token');

	return new Promise((resolve, reject) => {
		fetch(url, {
			method: "GET",
			credentials: "include",
			headers: {
				"x-access-token": token,
				"language": obj[localStorage.getItem('lang')],
				"Accept-Language": intl.getInitOptions().currentLocale,
			},
		})
			.then(response => response.json())
			.then(res => resolve(res))
			.catch(err => reject(err));
	});
};

const doPostFetch = (url, jsondata) => {
	return new Promise((resolve, reject) => {
		fetch(url, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				"language": obj[localStorage.getItem('lang')],
				"Accept-Language": intl.getInitOptions().currentLocale,
			},
			credentials: "include",
			body: JSON.stringify(jsondata)
		})
			.then(response => response.json())
			.then(res => resolve(res))
			.catch(err => reject(err));
	});
};

const doPostWithToken = (url, jsondata) => {
	const token = localStorage.getItem('token');

	return new Promise((resolve, reject) => {
		fetch(url, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				"x-access-token": token,
				"language": obj[localStorage.getItem('lang')],
				"Accept-Language": intl.getInitOptions().currentLocale,
			},
			credentials: "include",
			body: JSON.stringify(jsondata)
		})
			.then(response => response.json())
			.then(res => resolve(res))
			.catch(err => reject(err));
	});
};

const doFormFetch = (url, jsondata) => {
	let paramsArray = '';

	if (jsondata) {
		Object
			.keys(jsondata)
			.forEach(key => paramsArray += (key + "=" + jsondata[key] + "&"));
	}

	return new Promise((resolve, reject) => {
		fetch(url, {
			method: "POST",
			credentials: "include",
			headers: {
				"language": obj[localStorage.getItem('lang')],
				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
				"Accept-Language": intl.getInitOptions().currentLocale,
			},
			body: paramsArray
		})
			.then(response => response.json())
			.then(res => resolve(res))
			.catch(err => reject(err));
	});
};

export const get = async (url, params) => {
	if (params) {
		let paramsArray = [];
		Object
			.keys(params)
			.forEach(key => paramsArray.push(key + "=" + params[key]));
		if (url.search(/\?/) === -1) {
			url += "?" + paramsArray.join("&");
		} else {
			url += "&" + paramsArray.join("&");
		}
	}
	try {
		return await doGetFetch(url);
	} catch (e) {
		return handleErr(e)
	}
};

export const getWithToken = async (url, params) => {
	if (params) {
		let paramsArray = [];
		Object
			.keys(params)
			.forEach(key => paramsArray.push(key + "=" + params[key]));
		if (url.search(/\?/) === -1) {
			url += "?" + paramsArray.join("&");
		} else {
			url += "&" + paramsArray.join("&");
		}
	}
	try {
		return await doGetWithToken(url);
	} catch (e) {
		return handleErr(e)
	}
};

export const post = async (url, params) => {
	if (params && localStorage.getItem('token')) {
		params.authtoken = localStorage.getItem('token');
	}
	try {
		return await doPostFetch(url, params);
	} catch (e) {
		return handleErr(e)
	}
};

export const postWithToken = async (url, params) => {
	if (params && localStorage.getItem('token')) {
		params.authtoken = localStorage.getItem('token');
	}
	try {
		return await doPostWithToken(url, params);
	} catch (e) {
		return handleErr(e)
	}
};

export const form = async (url, params) => {
	try {
		return await doFormFetch(url, params);
	} catch (e) {
		return handleErr(e)
	}
};