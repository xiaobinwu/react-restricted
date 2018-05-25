import Service from './service';

class LinkTrackingService extends Service {

    /***************链路跟踪 start******************/
    // 获取链路信息列表
    getTraceInfoList (params = {}) {
        return this.post('/trace/tracelist', params);
    }
    // 获取应用列表
    getAllApp() {
        return this.get('/app/all');
    }
    // 获取服务列表
    getAllService() {
        return this.get('/service/list');
    }

    /***************链路跟踪 end******************/
}

export default new LinkTrackingService();