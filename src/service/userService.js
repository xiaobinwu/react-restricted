import Service from './service';

class UserService extends Service {
    // 登录
    login (params = {}) {
        return this.post('/login', params);
    }
    // 登出
    logout () {
        return this.get('/logout');
    }
    // 获取用户信息
    getUserInfo () {
        return true;
    }
}

export default new UserService();