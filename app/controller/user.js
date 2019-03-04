'use strict';

const Controller = require('egg').Controller;
const Fs = require('fs');
const Path = require('path');
const util = require('util');
const readF = util.promisify(Fs.readFile);

class UserController extends Controller {
  async login() {
    //console.log(this.ctx.cookies.get('csrfToken'));
    let result;
    let params = this.ctx.request.body;//params-- / ; query-- ?
    try {
      const permmit = await this.service.user.login(params);
      console.log(permmit);
      if (!permmit) {
        result = {
          status: this.config.number.PARAM_ERROR,
          data: {},
        }
      } else {
        result = {
          status: this.config.number.NO_DATA_SUCCESS,
          data: {},
        }
      }
      //userpage = await readF(Path.resolve(__dirname, '../view/list.html'));
    } catch (e) {
      this.ctx.helper.erroDeal(e, 'UserController/login');
      return
    }
    this.ctx.body = result;
  }

  async logout() {
    this.ctx.session.userid = '';
    this.ctx.session.userid = '';
    this.ctx.session.username = '';
    this.ctx.session.class = '';
    this.ctx.session.spell = '';
    this.ctx.body = {
      status: this.config.number.NO_DATA_SUCCESS,
      data: {},
    };
  }
}

module.exports = UserController;