'use strict';

const Service = require('egg').Service;

class AuditService extends Service {
  async score() {

  }

  async typeSearch(typeid) {
    let task_r, result = [];
    let r = await this.app.redis.hgetall('time');
    for (let i in r) {
      let obj = JSON.parse(r[i].replace(/'/g, '"'));
      if (typeid !== obj.typeid) continue;

      let [a,] = i;
      task_r = await this.app.redis.hget('task', `${a}`);
      task_r = JSON.parse(task_r.replace(/'/g, '"'));
      let applicant_name = await this.app.redis.hget('user', `${task_r.userid}`);
      applicant_name = JSON.parse(applicant_name.replace(/'/g, '"')).name;

      let obj1 = {
        applicant_name: applicant_name,
        task_id: a,
      };
      obj1 = this.ctx.helper.objExtend(obj1, task_r);
      result.push(obj1);
    }
    return result;
  }
}

module.exports = AuditService;