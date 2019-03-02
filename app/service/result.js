const Service = require('egg').Service;

class ResultService extends Service {
  async detail(taskId, fieldId) {
    const Redis = this.app.redis;
    let result = [];
    let [r1, r2] = await Promise.all([Redis.hget('result', `${taskId}:${fieldId}`), Redis.hget('time', `${taskId}:${fieldId}`)]);
    //console.log(`r1:${r1},r2:${r2}`);
    if (r1 && r2) {
      r1 = JSON.parse(r1.replace(/'/g, '"'));
      r2 = JSON.parse(r2.replace(/'/g, '"'));
      const r = this.ctx.helper.objExtend(r1, r2);
      result.push(r);
      //console.log(result);
      return result;
    }
    return false;
  }

  async delete(taskId, fieldId) {
    const Redis = this.app.redis;
    let aa = await Redis.hget('result', `${taskId}:${fieldId}`);
    aa = JSON.parse(aa.replace(/'/g, '"'));
    console.log(aa);
    if (aa.refer !== 'null') {
      console.log("不为空");
      fs.unlink(aa.refer, function (err) {
        if (err) {
          throw err;
        }
        console.log('文件:' + filepath + '删除成功！');
      })
    }
    throw "11";
    let [r1, r2] = await Promise.all([Redis.hdel('result', `${taskId}:${fieldId}`), Redis.hdel('time', `${taskId}:${fieldId}`)]);
    //console.log(`r1:${r1},r2:${r2}`);
    return r1 && r2;
  }

  async edit(params) {
    const Redis = this.app.redis;
    if (!params.hasOwnProperty('task_id')) {
      let res = await Redis.hgetall('task');
      for (let a in res) {
        let b = JSON.parse(res[a].replace(/'/g, '"'));
        if (b.taskname === params.task_name) params.task_id = a;
      }
    }
    let filed = [], filedid = null, r;
    if (!params.hasOwnProperty('result_id') && !params.hasOwnProperty('time_id')) {
      r = await Redis.hkeys('result');
      for (let a of r) {
        if (a.substring(0, 1) === params.task_id) filed.push(a);
      }
    } else {
      filedid = params.result_id || params.time_id;
    }
    if (filedid === null) filedid = filed.length + 1; //表示新增
    /*
    if (Array.isArray(filed) && filed.length !== 0) {
      //console.log(filed);
      r = await Redis.hmget('result', filed);
      //console.log(r);
      for (let a of r) {
        //console.log(a);
        let b = JSON.parse(a.replace(/'/g, '"'));
        if (b.resultname === params.result_name) filedid = b.resultid;
      }
    }*/
    //console.log(filedid);
    let params2 = {
      result_id: `${filedid}`,
      time_id: `${filedid}`,
    };
    params = this.ctx.helper.objExtend(params, params2);
    console.log(params);
    let [r1, r2] = await Promise.all([Redis.hset('result', `${params.task_id}:${filedid}`, `${this.ctx.helper.resultValue(params)}`), Redis.hset('time', `${params.task_id}:${filedid}`, `${this.ctx.helper.timeValue(params)}`)]);
    //console.log(`r1:${r1} and r2:${r2}`);
    return ((r1 === 0 || r1 === 1) && (r2 === 0 || r2 === 1));
  }
}

module.exports = ResultService;

