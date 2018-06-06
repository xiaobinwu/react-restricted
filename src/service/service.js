import axios from 'axios';
import qs from 'qs';
import { message } from 'antd';
import store from 'rRedux/store';

const { CancelToken } = axios;

class Service {
    constructor() {
        this.$http = axios.create({
            responsetype: 'json',
            timeout: 10 * 1000,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        // 请求拦截器
        this.$http.interceptors.request.use((config) => {
            // 配置过滤字段空字符串
            config.data = this.dealConfigData(config.data);
            // dev server代理proxy
            config.url = process.env.NODE_ENV === 'development' ? `/api-dev${config.url}` : config.url;
            // 取消多个请求
            if (config.isCancel) {
                if (this.__axiosPromiseArr[config.url]) {  // eslint-disable-line
                    this.__axiosPromiseArr[config.url]('操作取消');  // eslint-disable-line
                    this.__axiosPromiseArr[config.url] = this.cancel;  // eslint-disable-line
                } else {
                    this.__axiosPromiseArr[config.url] = this.cancel;  // eslint-disable-line
                }
            }
            return config;
        }, error => Promise.reject(error));
        // 响应拦截器
        this.$http.interceptors.response.use(({ data, config }) => {
            if (data.code !== '0' && config.errorPop) {
                message.error(data.message, 1.5);
            }
            return data;
        }, (error) => {
            if (error.response) {
                const {
                    status,
                    data
                } = error.response;

                switch (status) {
                case 401:
                    // 修改状态，跳转至登陆页
                    store.dispatch({
                        type: 'SET_LOGGED_USER',
                        logged: false,
                        username: ''
                    });
                    break;
                default:
                    message.error(data.message, 1.5);
                }

            }
            return { code: -1001 };
        });

        this.cancel = null;
        this.__axiosPromiseArr = {}; // eslint-disable-line
        // 默认参数
        this.defaultConfig = {
            isCancel: true,
            errorPop: true
        };
    }

    dealConfigData(obj) {
        const param = {};
        if (obj === null || obj === undefined || obj === '') return param;
        for (const key in obj) {
            if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
                param[key] = obj[key];
            }
        }
        return param;
    }

    isNotEmptyObject(obj) {
        return obj && Object.keys(obj).length > 0;
    }

    getConfig(config = {}) {
        // application/x-www-form-urlencoded需要使用qs
        if (this.isNotEmptyObject(config.headers) &&
            config.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
            config.transformRequest = [(data, headers) => qs.stringify(data)];
        }
        config = Object.assign({}, this.defaultConfig, config);
        return {
            // 取消令牌
            cancelToken: new CancelToken((c) => {
                this.cancel = c;
            }),
            ...config
        };
    }

    get(url, params = {}, config = {}) {
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
