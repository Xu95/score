'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  async login(id) {
    const result = {
      status: null,
      data: {}
    };
    let r;
    try {
      r = await this.app.redis.hget('user', id);
    } catch (e) {
      console.log(new Error(e));
    }
    if (r) {
      r = JSON.parse(r.replace(/'/g, '"'));
      result.status = this.config.number.LOGIN_SUCCESS;
      result.data = r;
      console.log(result);
      return result;
    } else {
      return false;
    }
  }

  async logout(id) {
  }

}

module.exports = UserService;