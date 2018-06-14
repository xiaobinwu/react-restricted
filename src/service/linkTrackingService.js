import Service from './service';

class LinkTrackingService extends Service {

    // 获取应用列表
    getAllApp() {
        return this.get('/app/all');
    }
    // 获取服务列表
    getAllService(params = {}) {
        return this.post('/service/list', params);
    }

    /** *************链路跟踪 start***************** */
    // 获取链路信息列表
    getTraceInfoList(params = {}) {
        return this.post('/trace/tracelist', params);
    }
    // 通过traceid查询链路信息
    getOneTrace(params = {}) {
        return this.get('/trace/one', params);
    }
    /** *************链路跟踪 end***************** */


    /** *************接口调用 start***************** */
    // 获取单个接口调用分析数据
    getInterfaceInfo(params = {}) {
        return this.post('/metrics/list', params);
    }

    /** *************接口调用 end***************** */
}

export default new LinkTrackingService();
