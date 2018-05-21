import axios from 'axios';

const CancelToken = axios.CancelToken;

class Service {
    constructor () {
        // 请求拦截器
        axios.interceptors.request.use(config => {
            console.log(111, config);
            if (this.promiseArr[config.url]) {
                this.promiseArr[config.url]('操作取消');
                this.promiseArr[config.url] = this.cancel;
            } else {
                this.promiseArr[config.url] = this.cancel;
            }
            return config;
        }, (error) => {
            return Promise.reject(error);
        });
        // 响应拦截器
        axios.interceptors.response.use(data => {
            return data;
        }, (error) => {
            return Promise.reject(error);
        });

        this.$http = axios.create({
            timeout: 20 * 1000
        });

        this.cancel = null;
        this.promiseArr = {};
    }


    get (url, params = {}) {
        url = process.env.NODE_ENV === 'development' ? `/api-dev${url}` : url;
        return this.$http.request({
            method: 'get',
            url,
            params,
            cancelToken: new CancelToken(c => {
                this.cancel = c
            })
        });
    }

    post(url, data = undefined, params = {}) {
        url = process.env.NODE_ENV === 'development' ? `/api-dev${url}` : url;
        return this.$http.request({
            method: 'post',
            url,
            data,
            cancelToken: new CancelToken(c => {
                this.cancel = c
            })
        });
    }
        
}

export default Service;
