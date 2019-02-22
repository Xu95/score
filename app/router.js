'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const {router, controller} = app;
  router.get('/', controller.home.index);
//user
  router.get('/user/login/:id', controller.user.login);
  router.post('/user/logout/:id', controller.user.logout);
//task
  router.get('/task/list/:page', controller.task.list);
  router.get('/task/timeSearch/:time/:page', controller.task.timeSearch);
  router.get('/task/detail/:task_id', controller.task.detail);
  router.post('/task/increase', controller.task.increase);
  router.post('/task/edit', controller.task.edit);
//resul
  router.get('/result/detail/:task_id/:result_id', controller.result.detail);
  router.post('/result/edit', controller.result.edit);
  router.get('/result/delete/:task_id/:result_id', controller.result.delete);
//audit
  router.post('/audit/score', controller.audit.score);
  router.get('/audit/typeSearch/:type_id', controller.audit.typeSearch);
};
