const Service = require('egg').Service;

class TaskService extends Service {
  async list(page) {
    let result = [];
    let r = await this.app.redis.hgetall('task');
    if (r.length === 0) return result;
    for (let a  in  r) {
      let aa = JSON.parse(r[a].replace(/'/g, '"'));
      //let par = {task_name:`${aa.taskname}`,user_id:`${aa.userid}`,time:`${aa.time}`,score:`0`};
      //await this.app.redis.hset('task',`${a}`,`${this.ctx.helper.taskValue(par)}`);
      if (page === '1') {
        if (aa.score === '0') {//audit
          let res = await this.app.redis.hget('user', `${aa.userid}`);
          //console.log(res);
          aa.applicant_name = JSON.parse(res.replace(/'/g, '"')).username;
          aa.task_id = a;
          result.push(aa);
        }
      } else {
        let res = await this.app.redis.hget('user', `${aa.userid}`);
        //console.log(res);
        aa.applicant_name = JSON.parse(res.replace(/'/g, '"')).username;
        aa.task_id = a;
        result.push(aa);
      }
    }
    //console.log(result);
    return result;
  }/*
  async list(page) {
    let start = (page - 1) * this.config.globalConst.PAGE_NUMBER + 1;
    let result = [];
    let r = await this.app.redis.hgetall('task');
    if (r.length === 0) return result;
    for (let a  in  r) {
      if (a >= start) {
        let aa = JSON.parse(r[a].replace(/'/g, '"'));
        let res = await this.app.redis.hget('user', `${aa.userid}`);
        console.log(res);
        aa.applicant_name = JSON.parse(res.replace(/'/g, '"')).username;
        result.push(aa);
      }
    }
    //console.log(result);
    return result;
  }*/

  async timeSearch(startTime, endTime) {
    //let start = (page - 1) * this.config.globalConst.PAGE_NUMBER + 1;
    let result = [];
    let r = await this.app.redis.hgetall('task');
    if (r.length === 0) return result;
    for (let a in r) {
      let b = JSON.parse(r[a].replace(/'/g, '"'));
      let res = await this.app.redis.hget('user', `${b.userid}`);
      b.applicant_name = JSON.parse(res.replace(/'/g, '"')).username;
      b.task_id = a;
      if (startTime <= b.time && b.time <= endTime) {
        console.log(b.time);
        result.push(b);
      }
    }
    //console.log(result);
    if (result.length === 0) return false;
    //return result.slice(start - 1, start + this.config.globalConst.PAGE_NUMBER - 1);
    return result;
  }

  async detail(taskId) {
    let result = [];
    const redis = this.app.redis;
    let task1 = await redis.hget('task', `${taskId}`);
    if (!task1) return false;
    task1 = JSON.parse(task1.replace(/'/g, '"'));//task表
    let len = await redis.hkeys('result'), filed = [];
    for (let a of len) {
      let b = a.split(':');
      if (b[0] === taskId) filed.push(a);
    }
    //console.log(filed);
    if (filed.length === 0) return result;
    let [r1, r2] = await Promise.all([redis.hmget('result', filed), redis.hmget('time', filed)]);
    //console.log(`r1:${r1} r2: ${r2}`);
    if (r1.length !== r2.length) throw "form /service/task/detail.result table can not match time table";
    for (let i = 0; i < r1.length; i++) {
      const a = JSON.parse(r1[i].replace(/'/g, '"'));
      const b = JSON.parse(r2[i].replace(/'/g, '"'));
      const typeid = b.typeid;
      const obj = {
        result_name: a.resultname,
        result_id: a.resultid,
        result_detail: a.resultdetail,
        refer: a.refer,
        score: task1.score,
        hour: b.hour,
        type_id: typeid,
        type_name: this.config.globalConst.tasktype[Number(typeid) - 1],
        time_id: b.timeid,
        time_detail: b.timedetail,
      };
      result.push(obj);
    }
    //console.log(result);
    return result;
  }

  async increase(params) {
    const Redis = this.app.redis;
    let r = await Redis.hgetall('user');
    for (let a in r) {
      let b = JSON.parse(r[a].replace(/'/g, '"'));
      if (b.username === params.user_name) params.user_id = a;
    }
    params.time = params.time.substr(0, 10);
    //console.log(params);
    let maxNum = await Redis.hlen('task');
    let result = await Redis.hset('task', `${maxNum + 1}`, `${this.ctx.helper.taskValue(params)}`);
    if (result) return maxNum + 1;
  }

  async edit(params) {
    let result = await this.app.redis.hset('task', `${params.task_id}`, `${this.ctx.helper.taskValue(params)}`);
    return result === 0 || result === 1;
  }
}

module
  .exports = TaskService;

