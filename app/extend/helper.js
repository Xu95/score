//const ldap = require('ldapjs');
const Fs = require('fs');
const Path = require('path');
const util = require('util');
const readF = util.promisify(Fs.readFile);
//故名思意 异步二进制 写入流
const awaitWriteStream = require('await-stream-ready').write;
//管道读入一个虫洞。
const sendToWormhole = require('stream-wormhole');
const multiparty = require('multiparty');

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
    return y + m + d;
  },
  async erroDeal(e, addr) {
    let res = {
      status: this.config.number.EGG_ERROR,
      data: {},
    };
    this.ctx.logger.error(new Error(`from ${addr} and the error is ${e}`));
    //const userpage = await readF(Path.resolve(__dirname, '../view/error.html'));
    const userpage = Fs.readFileSync(Path.resolve(__dirname, '../view/error.html'));
    //this.ctx.response.type = 'html';
    res.data = userpage.toString();
    //console.log(res);
    this.ctx.body = res;
  },
  async upload() {
    console.log('this is upload');
    let stream = await this.ctx.getFileStreamWithoutFileNotFoundError();
    //console.log(stream);
    if (!stream.filename) {
      param = stream.fields;
      param.refer = 'null';
      return param;
    }
    const uplaodBasePath = this.config.globalConst.uploadPath;
    // 生成文件名
    const filename = this.ctx.session.username + '-' + Number.parseInt(Math.random() * 10000) + Path.extname(stream.filename);
    // 生成文件夹
    const dirName = this.formatTime();
    const allPath = Path.join(this.config.baseDir, uplaodBasePath, dirName);
    if (!Fs.existsSync(allPath)) Fs.mkdirSync(allPath);
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
    stream.fields.refer = `${target}`.replace(/\\/g,'\\\\\\\\');
    return stream.fields;
  },
  //多文件上传
  async upload2() {
    const parts = this.ctx.multipart({
      autoFields: false
    });
    //console.log(parts.field);
    const fileds = {refer1: 'null'};
    let stream;
    let res = {}, i = 1;
    while ((stream = await parts()) != null) {
      if (!stream.fieldname && !stream.filename) {
        console.log(stream);
        for (let a = 0; a < stream.length; a += 2) {
          if (stream[a] !== false) {
            res[stream[a]] = stream[a + 1];
          }
          //console.log(a);
        }
        continue;
      }
      console.log(i);
      if (!stream.filename) continue;
      console.log(i);
      const uplaodBasePath = this.config.globalConst.uploadPath;
      // 生成文件名
      const filename = this.ctx.session.username + '-' + Number.parseInt(Math.random() * 10000) + Path.extname(stream.filename);
      // 生成文件夹
      const dirName = this.formatTime();
      const allPath = Path.join(this.config.baseDir, uplaodBasePath, dirName);
      if (!Fs.existsSync(allPath)) Fs.mkdirSync(allPath);
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
      fileds['refer' + i] = `${target}`;
      i++;
    }
    for (let a in res) {
      fileds[a] = res[a];
    }
    return fileds;
  },
  async upload3() {
    const uplaodBasePath = this.config.globalConst.uploadPath;
    // 生成文件名
    //const filename = this.ctx.session.username + '-' + Number.parseInt(Math.random() * 10000) + Path.extname(stream.filename);
    // 生成文件夹
    const dirName = this.formatTime();
    const allPath = Path.join(this.config.baseDir, uplaodBasePath, dirName);
    if (!Fs.existsSync(allPath)) Fs.mkdirSync(allPath);
    // 写入路径
    //const target = Path.join(allPath, filename);
    console.log(this.config.multipart);
    const {ctx} = this;
    console.log(ctx.request.body);
    console.log('got %d files', ctx.request.files.length);
    for (const file of ctx.request.files) {
      console.log('field: ' + file.fieldname);
      console.log('filename: ' + file.filename);
      console.log('encoding: ' + file.encoding);
      console.log('mime: ' + file.mime);
      console.log('tmp filepath: ' + file.filepath);
    }
  }
};