import Service from './service';

class UserService extends Service {
    login (params = {}) {
        return this.post('/login', params);
    }
    logout () {
        return this.get('/logout');
    }
    getUserInfo () {
        return this.post('/trace/tracelist');
    }
}

export default new UserService();