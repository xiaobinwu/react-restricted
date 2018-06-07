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

class GatewayService extends Service {

    /** *************Gateway在线服务 start***************** */
    // 获取链路信息列表
    getOnlineList(params = {}) {
        return this.post(`${servicePrefix}/getServiceKeyList`, params, defaultConfig);
    }

    /** *************Gateway在线服务 end***************** */
}

export default new GatewayService();
