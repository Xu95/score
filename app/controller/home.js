'use strict';

const Controller = require('egg').Controller;
const Fs = require('fs');
const Path = require('path');
const util = require('util');
const readF = util.promisify(Fs.readFile);

class HomeController extends Controller {
  async index() {
    let userpage;
    userpage = await readF(Path.resolve(__dirname, '../view/index.html'));
    //await this.ctx.render('index.html').catch(error => console.log(new Error("form HomeController/index")));
    this.ctx.response.type = 'html';
    this.ctx.body = userpage;
  }
}

module.exports = HomeController;
