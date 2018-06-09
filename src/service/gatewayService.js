import Service from './service';

const servicePrefix = '/gateway';
const defaultConfig = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    // 网关服务需要Authorization
    auth: {
        username: 'root',
        password: 'root'
    },
};

const deleteHeaders = (handleConfig) => {
    const config = JSON.parse(JSON.stringify(handleConfig));
    delete config.headers;
    delete config.transformRequest;
    return config;
};

class GatewayService extends Service {

    /** *************Gateway在线服务 start***************** */
    // 获取Gateway在线服务列表
    getOnlineList(params = {}) {
        return this.post(`${servicePrefix}/getServiceKeyList`, params, defaultConfig);
    }
    // 获取线程参数
    getHystrixThreadPoolSetter(params = {}) {
        return this.post(`${servicePrefix}/getHystrixThreadPoolSetter`, params, defaultConfig);
    }
    // 保存设置线程参数
    setHystrixThreadPoolSetter(params = {}) {
        const { selectKey } = params;
        delete params.selectKey;
        return this.post(`${servicePrefix}/setHystrixThreadPoolSetter?dubboServiceKey=${selectKey}`, params, deleteHeaders(defaultConfig));
    }
    // 保存Dubbo参数
    setDubboSetter(params = {}) {
        const { selectKey } = params;
        delete params.selectKey;
        return this.post(`${servicePrefix}/setDubboSetter?dubboServiceKey=${selectKey}`, params, deleteHeaders(defaultConfig));
    }
    // 获取Dubbo参数
    getDubboSetter(params = {}) {
        return this.post(`${servicePrefix}/getDubboSetter`, params, defaultConfig);
    }
    // 详情列表
    getLineService(params = {}) {
        return this.post(`${servicePrefix}/onLineService`, params, defaultConfig);
    }
    // 下线
    offLine(params = {}) {
        return this.post(`${servicePrefix}/offline`, params, defaultConfig);
    }
    // 上线
    onLine(params = {}) {
        return this.post(`${servicePrefix}/online`, params, defaultConfig);
    }
    // 降级与恢复
    onFallback(params = {}) {
        return this.post(`${servicePrefix}/fallback`, params, defaultConfig);
    }
    // 清除
    removeService(params = {}) {
        return this.post(`${servicePrefix}/removeService`, params, defaultConfig);
    }
    // 切换限流表单
    switchLimiter(params = {}) {
        return this.post(`${servicePrefix}/switchLimiter`, params, defaultConfig);
    }
    /** *************Gateway在线服务 end***************** */
}

export default new GatewayService();
