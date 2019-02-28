'use strict';

const Controller = require('egg').Controller;
const Fs = require('fs');
const Path = require('path');
const util = require('util');
const readF = util.promisify(Fs.readFile);

class UserController extends Controller {
  async login() {
    //console.log(this.ctx.cookies.get('csrfToken'));
    let userpage;
    let params = this.ctx.request.body;//params-- / ; query-- ?
    try {
      const permmit = await this.service.user.login(params);
      if (!permmit) return this.ctx.render('error.html');
      userpage = await readF(Path.resolve(__dirname, '../view/list.html'));
    } catch (e) {
      this.ctx.helper.erroDeal(e, 'UserController/login');
      return
    }
    this.ctx.response.type = 'html';
    this.ctx.body = userpage;
    /*
    console.log("ok");
    this.ctx.body = {
      status: this.config.number.DATA_SUCCESS,
      data: {},
    }*/
  }

  async logout() {
    this.ctx.session.userid = '';
    let userpage;
    try {
      userpage = await readF(Path.resolve(__dirname, '../view/index.html'));
    } catch (e) {
      this.ctx.helper.erroDeal(e, 'UserController/logout');
      return
    }
    this.ctx.response.type = 'html';
    this.ctx.body = userpage;
  }
}

module.exports = UserController;