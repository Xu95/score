'use strict';

const Controller = require('egg').Controller;

class ResultController extends Controller {
  async detail() {
    const taskId = this.ctx.params.task_id;
    const resultId = this.ctx.params.result_id;
    let r;
    try {
      r = await this.service.result.detail(taskId, resultId);
    } catch (e) {
      this.ctx.helper.erroDeal();
    }
    if (r) {
      this.result.status = this.config.number.DATA_SUCCESS;
      this.result.data = r;
    }else{
      this.result.status = this.config.number.PARAM_ERROR;
      this.result.data = {};
    }
    console.log(this.result.data);
    this.ctx.body = this.result;
  }

  async delete() {
    const taskId = this.ctx.params.task_id;
    const resultId = this.ctx.params.result_id;
    try {
      await this.service.result.delete(taskId, resultId);
    } catch (e) {
      this.ctx.helper.erroDeal();
    }
    this.result.status = this.config.number.NO_DATA_SUCCESS;
    this.result.data = {};
    console.log(this.result.data);
    this.ctx.body = this.result;
  }

  async edit() {
    const param = this.ctx.request.body;
    let r;
    try {
      r = await this.service.result.edit(param);
    } catch (e) {
      this.ctx.helper.erroDeal();
    }
    if (r) {
      this.result.status = this.config.number.NO_DATA_SUCCESS;
      this.result.data = {};
    }else{
      this.result.status = this.config.number.PARAM_ERROR;
      this.result.data = {};
    }
    console.log(this.result.data);
    this.ctx.body = this.result;
  }
}

ResultController.prototype.result = {
  status: 200,
  data: {},
};

module.exports = ResultController;