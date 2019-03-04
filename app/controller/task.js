'use strict';

const Controller = require('egg').Controller;

class TaskController extends Controller {
  async list() {
    if (this.ctx.session.username === this.config.globalConst.auditName) this.result.data.roles = 1;
    const page = this.ctx.params.page || '0';
    let r;
    try {
      r = await this.service.task.list(page);
    } catch (e) {
      this.ctx.helper.erroDeal(e, 'TaskController/list');
      return
    }
    if (r.length === 0 && Array.isArray(r)) {
      this.result.status = this.config.number.NO_DATA_ERROR;
      this.result.data = {};
    } else {
      this.result.status = this.config.number.DATA_SUCCESS;
      this.result.data.results = r;
    }
    //console.log(this.result.data.results);
    this.ctx.body = this.result;
  }

  async timeSearch() {
    if (this.ctx.session.username === this.config.globalConst.auditName) this.result.data.roles = 1;
    const {start_time, end_time} = this.ctx.params;
    let r;
    try {
      //console.log(`stime : ${start_time} etime :${end_time}`);
      r = await this.service.task.timeSearch(start_time, end_time);
    } catch (e) {
      this.ctx.helper.erroDeal(e, 'TaskController/timeSearch');
      return
    }
    if (r) {
      this.result.status = this.config.number.DATA_SUCCESS;
      this.result.data.results = r;
    } else {
      this.result.status = this.config.number.NO_DATA_ERROR;
      this.result.data = {};
    }
    //console.log(this.result.data.results);
    this.ctx.body = this.result;
  }

  async detail() {
    if (this.ctx.session.username === this.config.globalConst.auditName) this.result.data.roles = 1;
    const taskId = this.ctx.params.task_id;
    //console.log(taskId);
    let r;
    try {
      r = await this.service.task.detail(taskId);
    } catch (e) {
      this.ctx.helper.erroDeal(e, 'TaskController/detail');
      return
    }
    if (r) {
      this.result.status = this.config.number.DATA_SUCCESS;
      this.result.data.results = r;
    } else {
      this.result.status = this.config.number.PARAM_ERROR;
      this.result.data = {};
    }
    //console.log(this.result.data.results);
    this.ctx.body = this.result;
  }

  async increase() {
    if (this.ctx.session.username === this.config.globalConst.auditName) this.result.data.roles = 1;
    const param = this.ctx.request.body;
    let r;
    try {
      r = await this.service.task.increase(param);
    } catch (e) {
      this.ctx.helper.erroDeal(e, 'TaskController/increase');
      return
    }
    if (r) {
      this.result.status = this.config.number.DATA_SUCCESS;
      this.result.data = {taskid: r};
    } else {
      this.result.status = this.config.number.PARAM_ERROR;
      this.result.data = {};
    }
    //console.log(this.result.data);
    this.ctx.body = this.result;
  }

  async edit() {
    if (this.ctx.session.username === this.config.globalConst.auditName) this.result.data.roles = 1;
    let param = this.ctx.request.body;
    const userid = this.ctx.session.userid;
    const score = '0';
    param = this.ctx.helper.objExtend(param, {user_id: userid, score: score});
    //console.log(param);
    let r;
    try {
      r = await this.service.task.edit(param);
    } catch (e) {
      this.ctx.helper.erroDeal(e, 'TaskController/edit');
      return
    }
    if (r) {
      this.result.status = this.config.number.NO_DATA_SUCCESS;
      this.result.data = {};
    } else {
      this.result.status = this.config.number.PARAM_ERROR;
      this.result.data = {};
    }
    this.ctx.body = this.result;
  }
}

TaskController.prototype.result = {
  status: 200,
  data: {
    roles: 0,//普通权限
    results: []
  }
};

module.exports = TaskController;