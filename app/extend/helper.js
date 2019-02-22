const ldap = require('ldapjs');

module.exports = {
  userValue(params) {
    return `{"name":"${params.name}","class":"${params.class}"}`;
  },
  taskValue(params) {
    return `{"name":"${params.name}","userid":"${params.user_id}","time":"${params.time}","score":"${params.score}"}`;
  },
  resultValue(params) {
    return `{"name":"${params.name}","detail":"${params.detail}","refer":"${params.refer}","resultid":"${params.result_id}"}`;
  },
  timeValue(params) {
    return `{"hour":"${params.hour}","typeid":"${params.type_id}","detail":"${params.detail}","timeid":"${params.time_id}"}`;
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
};