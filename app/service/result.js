const Service = require('egg').Service;

class ResultService extends Service {
  async detail(taskId, resultId) {
    let result = [];
    let r = await this.app.redis.hget('result', `${taskId}:${resultId}`);
    result.push(JSON.parse(r));
    console.log(result);
    return result;
  }

  async delete(taskId, resultId) {
    let result = await this.app.redis.hdel('result', `${taskId}:${resultId}`);
    if (result) return true;
  }

  async edit(params) {
    let result = await this.app.redis.hset('result', `${params.task_id}:${params.result_d}`,`${this.ctx.helper.resultValue(params)}`);
    if(result) return true;
  }
}

module.exports = ResultService;

