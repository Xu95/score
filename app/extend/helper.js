//const ldap = require('ldapjs');
const Fs = require('fs');
const Path = require('path');
const util = require('util');
const readF = util.promisify(Fs.readFile);
//故名思意 异步二进制 写入流
const awaitWriteStream = require('await-stream-ready').write;
//管道读入一个虫洞。
const sendToWormhole = require('stream-wormhole');

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
  formatTime() {
    let date = new Date();
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    let d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    return y + m + d ;
  },
  async erroDeal(e,addr){
    this.ctx.logger.error(new Error(`from ${addr} and the error is ${e}`));
    //const userpage = await readF(Path.resolve(__dirname, '../view/error.html'));
    const userpage = Fs.readFileSync(Path.resolve(__dirname, '../view/error.html'));
    this.ctx.response.type = 'html';
    this.ctx.body = userpage;
  },
  async upload(stream){
    const uplaodBasePath = this.config.globalConst.uploadPath;
    // 生成文件名
    const filename = this.ctx.session.username+'-'+ Number.parseInt(Math.random() * 10000) + Path.extname(stream.filename);
    // 生成文件夹
    const dirName = this.formatTime();
    const allPath = Path.join(this.config.baseDir,uplaodBasePath,dirName);
    if(! Fs.existsSync(allPath)) Fs.mkdirSync(allPath);
    // 写入路径
    const target = Path.join(allPath, filename);
    const writeStream = Fs.createWriteStream(target);
    try {
      // 写入文件
      await awaitWriteStream(stream.pipe(writeStream));
    } catch (err) {
      // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
      await sendToWormhole(stream);
      throw err;
    }
    stream.fields.refer = `${target}`;
    return stream.fields;
  }
};