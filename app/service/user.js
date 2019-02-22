'use strict';

const Service = require('egg').Service;
const ldap = require('ldapjs');

class UserService extends Service {
  async login(params) {
    const result = {
      status: null,
      data: {}
    };
    let permmit;
    try {
      permmit = await this.userauth(params.username, params.password);
      //r = await this.app.redis.hget('user', id);
      console.log(permmit);
    } catch (e) {
      console.log(new Error(e));
    }
    if (permmit === 1) {
      //r = JSON.parse(r.replace(/'/g, '"'));
      result.status = this.config.number.LOGIN_SUCCESS;
      result.data = {username:params.username};
      console.log(result);
      return result;
    } else {
      return false;
    }
  }

  async logout(id) {
  }

  async userauth(username, password, next) {
    console.log(username);
    console.log(password);

    const client = ldap.createClient({
      url: 'ldap:172.20.12.2:389'
    });
    const opts = {
      filter: '(uid=' + username + ')',
      scope: 'sub',
      timeLimit: 500
    };
    let flag = 0, result = 2;

    await this.ctx.helper.ldapbind(client, 'cn=admin,dc=gao,dc=com', 'abc.123');
    const ldapres = await this.ctx.helper.ldapsearch(client, opts);
    ldapres.on('searchEntry', (entry) => {
      flag = 1;
    });
    const authresult = await new Promise((resolve, reject) => {
      ldapres.on('end', async (entry) => {
        if (flag === 1) {
          const bindres = await this.ctx.helper.ldapbind(client, 'uid=' + username + ',ou=people,dc=gao,dc=com', password);
          if (bindres) {
            result = 0;//未找到
          } else {
            result = 1;//找到
          }
        } else {
          result = 2;//search error
        }
        client.unbind();
        resolve(result);
      });
    });
    return authresult;
  }
}

module.exports = UserService;