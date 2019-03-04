'use strict';
const CON = require("./config.const");
const os = require("os");
module.exports = appInfo => {
  const config = exports = {};
  config.number = CON.num;
  config.globalConst = CON.globalConst;
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1548379812984_2299';

  // add your config here
  config.middleware = [];
  config.view={
    mapping:{
      '.html': 'ejs',
    }
  };
  config.redis = {
    client: {
      port: 6379,          // Redis port
      host: '127.0.0.1',   // Redis host
      password: 'local',
      db: 0,
    },
  };
  config.security = {
    csrf: {
      enable: false,
    }
  };
  config.multipart = {
    // will append to whilelist
    fileExtensions: [
      '.txt',
      '.doc',
      '.docx',
    ],
  };
  return config;
};
