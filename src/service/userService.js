import Service from './service';

class UserService extends Service {
    constructor () {
        super();
    }
    login (params = {}) {
        return this.post('/login', params);
    }
    logout () {

    }
}

export default new UserService();