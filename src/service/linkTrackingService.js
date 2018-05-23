import Service from './service';

class LinkTrackingService extends Service {
    getTraceInfoList (params = {}) {
        return this.post('/trace/tracelist', params);
    }
}

export default new LinkTrackingService();