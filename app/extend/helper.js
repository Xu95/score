//const ldap = require('ldapjs');
const Fs = require('fs');
const Path = require('path');
const util = require('util');
const readF = util.promisify(Fs.readFile);

module.exports = {
  userValue(params) {
    return `{"username":"${params.user_name}","class":"${params.class}"}`;
  },
  taskValue(params) {
    return `{"taskname":"${params.task_name}","userid":"${params.user_id}","time":"${params.time}","score":"${params.score}"}`;
  },
  resultValue(params) {
    return `{"resultname":"${params.result_name}","resultdetail":"${params.result_detail}","refer":"${params.refer}","resultid":"${params.result_id}"}`;
  },
  timeValue(params) {
    return `{"hour":"${params.hour}","typeid":"${params.type_id}","timedetail":"${params.time_detail}","timeid":"${params.time_id}"}`;
  },
  objExtend(a, b) {
    for (let p in b) {
      if (b.hasOwnProperty(p) && (!a.hasOwnProperty(p)))
        a[p] = b[p];
    }
    return a;
  },
  ldapsearch(client, opts) {
    return new Promise((resolve, reject) => {
      client.search('ou=people,dc=gao,dc=com', opts, function (err, res) {
        resolve(res);
      })
    })
  },
  ldapbind(client, dnstring, password) {
    return new Promise((resolve, reject) => {
      client.bind(dnstring, password, function (err) {
        resolve(err);
      })
    })
  },
  async erroDeal(){
    console.log(new Error(`from TaskController/timeSearch and the erro is ${e}`));
    let userpage = await readF(Path.resolve(__dirname, '../view/error.html'));
    this.ctx.response.type = 'html';
    this.ctx.body = userpage;
  },
};