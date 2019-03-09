'use strict';

const Service = require('egg').Service;

class AuditService extends Service {
  async score(params) {
    //console.log(params);
    let r1 = await this.app.redis.hget('task', `${params.task_id}`);
    //console.log(r1);
    if (!r1) return false;
    r1 = JSON.parse(r1.replace(/'/g, '"'));
    //console.log(r1);
    const param = {
      task_name: r1.taskname,
      user_id: r1.userid,
      time: r1.time,
      score: params.score,
    };
    let r = await this.app.redis.hset('task', `${params.task_id}`, this.ctx.helper.taskValue(param));
    return r === 0;
  }

  async typeSearch(typeid, page) {
    let start = (page - 1) * this.config.globalConst.PAGE_NUMBER + 1;
    let task_r, result = [], s1 = new Set();
    let r = await this.app.redis.hgetall('time');
    for (let i in r) {
      let a;
      let obj = JSON.parse(r[i].replace(/'/g, '"'));
      if (typeid !== obj.typeid) continue;
      a = i.substr(0, 1);
      if (s1.has(a)) continue;
      s1.add(a);
      //console.log(s1);
      task_r = await this.app.redis.hget('task', `${a}`);
      task_r = JSON.parse(task_r.replace(/'/g, '"'));
      let applicant_name = await this.app.redis.hget('user', `${task_r.userid}`);
      applicant_name = JSON.parse(applicant_name.replace(/'/g, '"')).username;

      let obj1 = {
        task_id: a,
        applicant_name: applicant_name,
        task_name: task_r.taskname,
        time: task_r.time,
        score: task_r.score,
      };
      result.push(obj1);
    }
    //console.log(result);
    if (result.length === 0) return false;
    return result.slice(start - 1, start - 1 + this.config.globalConst.PAGE_NUMBER);
  }
}

module.exports = AuditService;