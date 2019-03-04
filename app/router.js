'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const {router, controller} = app;
  router.get('/', controller.home.index);
//user
  router.post('/user/login/', controller.user.login);
  router.get('/user/logout', controller.user.logout);
//task
  router.get('/task/list/:page', controller.task.list);
  router.get('/task/timeSearch/:start_time?/:end_time?', controller.task.timeSearch);
  router.get('/task/detail/:task_id', controller.task.detail);
  router.post('/task/increase', controller.task.increase);
  router.post('/task/edit', controller.task.edit);
//result
  router.get('/result/detail/:task_id/:result_id', controller.result.detail);
  router.post('/result/edit', controller.result.edit);
  router.get('/result/delete/:task_id/:result_id', controller.result.delete);
//audit
  router.post('/audit/score', controller.audit.score);
  router.get('/audit/typeSearch/:type_id/:page', controller.audit.typeSearch);
};
