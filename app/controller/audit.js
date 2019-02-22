'use strict';

const Controller = require('egg').Controller;
const Fs = require('fs');
const Path = require('path');
const util = require('util');
const readF = util.promisify(Fs.readFile);

class AuditController extends Controller {
  async score() {

  }

  async typeSearch() {
    const typeid = this.ctx.params.type_id;
    const r =await this.service.audit.typeSearch(typeid);
    console.log(r);
  }
}

module.exports = AuditController;