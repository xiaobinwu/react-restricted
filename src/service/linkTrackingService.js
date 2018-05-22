import Service from './service';

class LinkTrackingService extends Service {
    getTraceInfoList (params = {}) {
        return this.post('/trace/traceInfoList', params);
    }
}

export default new LinkTrackingService();