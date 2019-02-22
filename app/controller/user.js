'use strict';

const Controller = require('egg').Controller;
const Fs = require('fs');
const Path = require('path');
const util = require('util');
const readF = util.promisify(Fs.readFile);

class UserController extends Controller {
  async login() {
    let userpage;
    let id = this.ctx.params.id;//params-- / ; query-- ?
    try {
      const permmit = await this.service.user.login(id);
      if (!permmit) return this.ctx.render('error.html');
      this.ctx.session.userid = id;//id 是字符
      userpage = await readF(Path.resolve(__dirname, '../web/dist/index.html'));
    } catch (e) {
      console.log(new Error("from UserController/login"));
    }
    this.ctx.response.type = 'html';
    this.ctx.body = userpage;
  }

  async logout() {
    this.ctx.session.userid = '';
    await this.ctx.render('index.html');
  }
}

module.exports = UserController;