const Service = require('egg').Service;

class TaskService extends Service {
  async list(page) {
    let start = (page - 1) * this.config.globalConst.PAGE_NUMBER + 1;
    let r = await this.app.redis.hgetall('task');
    let result = [];
    for (let a  in  r) {
      if (a >= start) {
        result.push(JSON.parse(r[a].replace(/'/g, '"')));
      }
    }
    //console.log(result);
    return result;
  }

  async detail(taskId) {
    let i = 1, result = [];
    const redis = this.app.redis;
    /*
    let params = {
      name:"牛逼的成果第三发",
      detail:"这真是一个牛逼的东西",
      refer:"木有",
      result_id:"3"
    };
    await this.app.redis.hset('result','1:3',`${this.ctx.helper.resultValue(params)}`);*/
    let task1 = await redis.hget('task', `${taskId}`);
    task1 = JSON.parse(task1.replace(/'/g, '"'));
    let [result1, time1] = await Promise.all([redis.hget('result', `${taskId}:${i}`), redis.hget('time', `${taskId}:${i++}`)]);
    while (result1 && time1) {
      result1 = JSON.parse(result1.replace(/'/g, '"'));
      time1 = JSON.parse(time1.replace(/'/g, '"'));

      let obj = {
        score: task1.score,
        type_name: this.config.globalConst[time1.typeid],
      };
      obj = this.ctx.helper.objExtend(obj, result1);
      obj = this.ctx.helper.objExtend(obj, time1);

      result.push(obj);
      [result1, time1] = await Promise.all([redis.hget('result', `${taskId}:${i}`), redis.hget('time', `${taskId}:${i++}`)]);
    }
    //console.log(result);
    return result;
  }

  async increase(params) {
    let result = await this.app.redis.hset('task', `${params.id}`, `${this.ctx.helper.taskValue(params)}`);
    if (result) return true;
  }
}

module.exports = TaskService;

