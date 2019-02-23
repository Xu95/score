'use strict';

const Controller = require('egg').Controller;
const Fs = require('fs');
const Path = require('path');
const util = require('util');
const readF = util.promisify(Fs.readFile);

class UserController extends Controller {
  async login() {
    let userpage;
    let params = this.ctx.request.body;//params-- / ; query-- ?
    try {
      const permmit = await this.service.user.login(params);
      if (!permmit) return this.ctx.render('error.html');
      userpage = await readF(Path.resolve(__dirname, '../view/index.html'));
    } catch (e) {
      this.ctx.helper.erroDeal();
    }
    this.ctx.response.type = 'html';
    this.ctx.body = userpage;
  }

  async logout() {
    this.ctx.session.userid = '';
    try {
      await this.ctx.render('index.html');
    } catch (e) {
      this.ctx.helper.erroDeal();
    }
  }
}

module.exports = UserController;