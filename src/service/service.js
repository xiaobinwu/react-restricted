import axios from 'axios';
import qs from 'query-string';

const CancelToken = axios.CancelToken;

class Service {
    constructor () {
        this.$http = axios.create({
            responsetype: 'json',
            timeout: 10 * 1000,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        // 请求拦截器
        this.$http.interceptors.request.use(config => {
            config.url = process.env.NODE_ENV === 'development' ? `/api-dev${config.url}` : config.url;
            if (config.isCancel) {
                if (this.__axiosPromiseArr[config.url]) {
                    this.__axiosPromiseArr[config.url]('操作取消');
                    this.__axiosPromiseArr[config.url] = this.cancel;
                } else {
                    this.__axiosPromiseArr[config.url] = this.cancel;
                }
            }
            return config;
        }, (error) => {
            return Promise.reject(error);
        });
        // 响应拦截器
        this.$http.interceptors.response.use(data => {
            return data;
        }, (error) => {
            console.log(error);
            return Promise.reject(error);
        });

        this.cancel = null;
        this.__axiosPromiseArr = {};
        this.defaultConfig = {
            isCancel: true
        }
    }

    isNotEmptyObject (obj) {
        return obj && Object.keys(obj).length > 0;
    }

    getConfig (config = {}) {
        if (this.isNotEmptyObject(config.headers) && 
            config.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
                config.transformRequest = [(data, headers) => {
                    return qs.stringify(data);
                }]
        }
        config = Object.assign({}, this.defaultConfig, config);
        return {
            cancelToken: new CancelToken(c => {
                this.cancel = c
            }),
            ...config
        }
    }

    get (url, params = {}, config = {}) {
        return this.$http.request({
            method: 'get',
            url,
            params,
            ...this.getConfig(config)
        });
    }

    post(url, params = {}, config = {}) {
        return this.$http.request({
            method: 'post',
            url,
            data: params,
            ...this.getConfig(config)
        });
    }
        
}

export default Service;
