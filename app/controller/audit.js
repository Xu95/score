'use strict';

const Controller = require('egg').Controller;


class AuditController extends Controller {
  async score() {
    if (this.ctx.session.username !== this.config.globalConst.auditName) {
      this.result.status = this.config.number.AUTH_ERROR;
      this.result.data = {};
      this.ctx.body = this.result;
      return;
    }
    this.result.data.roles = 1;
    const params = this.ctx.request.body;
    let r;
    try {
      r = await this.service.audit.score(params);
    } catch (e) {
      this.ctx.helper.erroDeal(e, 'AuditController/score');
      return
    }
    if (r) {
      this.result.status = this.config.number.NO_DATA_SUCCESS;
      this.result.data = {};
    } else {
      this.result.status = this.config.number.PARAM_ERROR;
      this.result.data = {};
    }
    //console.log(this.result.data);
    this.ctx.body = this.result;
  }

  async typeSearch() {
    if (this.ctx.session.username !== this.config.auditName) {
      this.result.status = this.config.number.AUTH_ERROR;
      this.result.data = {};
      this.ctx.body = this.result;
      return;
    }
    this.result.data.roles = 1;
    const typeId = this.ctx.params.typeId;
    const page = this.ctx.params.page || 1;
    let r;
    try {
      r = await this.service.audit.typeSearch(typeId, page);
    } catch (e) {
      this.ctx.helper.erroDeal(e, 'AuditController/typeSearch');
      return
    }
    if (r) {
      this.result.status = this.config.number.DATA_SUCCESS;
      this.result.data = {role: '1', results: r};
    } else {
      this.result.status = this.config.number.NO_DATA_ERROR;
      this.result.data = {role: '1', results: []};
    }
    console.log(this.result.data);
    this.ctx.body = this.result;
  }
}

AuditController.prototype.result = {
  status: 200,
  data: {
    roles: 0,//普通权限
    results: []
  }
};
module.exports = AuditController;