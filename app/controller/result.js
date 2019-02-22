'use strict';

const Controller = require('egg').Controller;
const Fs = require('fs');
const Path = require('path');
const util = require('util');
const readF = util.promisify(Fs.readFile);

class ResultController extends Controller {
  async detail() {
    const taskId = this.ctx.params.task_id;
    const resultId = this.ctx.params.result_id;
    const result = await this.service.result.detail(taskId,resultId);
  }

  async delete() {
    const taskId = this.ctx.params.task_id;
    const resultId = this.ctx.params.result_id;
    const result = await this.service.result.delete(taskId,resultId);
  }

  async edit() {
    const param = this.ctx.request.body;
    const result = await this.service.result.edit(param);
  }
}

module.exports = ResultController;