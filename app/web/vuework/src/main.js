// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import App from './App'
import router from '../src/router/index'
import ElementUI from 'element-ui'
import VueResource from 'vue-resource'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import qs from 'qs'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(VueResource)
Vue.prototype.$axios=axios
Vue.prototype.qs=qs
Vue.prototype.urlAddr = '/api';
Vue.prototype.auditName = '徐炜华';
//路由验证 用户登录后可以跳转 否则自动跳转至登录界面
router.beforeEach((to,from,next) => {
  var userInfo = sessionStorage.getItem('username')
  if(to.path === '/login'){
    next()
  }
  else if (to.meta.requireAuth && !userInfo) {
    next('/login');
  }
  else{
    next();
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
