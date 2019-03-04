exports.num = {
  /*
  状态码
   */
  'NO_USE': 200,//初始状态
  'NO_DATA_SUCCESS': 201,//无数据返回
  'DATA_SUCCESS': 202,//有数据返回
  'NO_DATA_ERROR': 301,//数据不存在
  'PARAM_ERROR': 302,//参数错误
  'AUTH_ERROR': 303,//权限错误
  'EGG_ERROR' : 304,//系统错误
};
exports.globalConst = {
  /*
  分页显示
   */
  'PAGE_NUMBER': 10,

  /*
  任务类型
   */
  tasktype: ['分析', '设计', '开发', '测试', '运维', '支持', '培训',],
  /*
  审计相关
   */
  auditName: '李潼',
  auditId: '1',
  /*
  上传文件路径
   */
  uploadPath: 'app/public/upload/',
};
