'use strict';

const Controller = require('egg').Controller;
const Fs = require('fs');
const Path = require('path');
const util = require('util');
const readF = util.promisify(Fs.readFile);

class TaskController extends Controller {
  async list() {
    const page = this.ctx.params.page || 1;
    const r = await this.service.task.list(page);
    if (r) {
      this.result.data.results = r;
    }
    console.log(this.result.data.results);
  }

  async timeSearch() {

  }

  async detail() {
    const taskId = this.ctx.params.task_id;
    const r = await this.service.task.detail(taskId);
    if (r) {
      this.result.data.results = r;
    }
    console.log(this.result.data.results);
  }

  async increase() {
    const param = this.ctx.request.body;
    const result = await this.service.task.increase(param);
  }

  async edit() {

  }
}
TaskController.prototype.result = {
  data: {
    roles: 1,
    results: []
  }
};

module.exports = TaskController;