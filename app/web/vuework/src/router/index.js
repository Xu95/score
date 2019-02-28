import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import Audit from '@/components/Audit'
import TaskList from '@/components/TaskList'
import error from '@/components/error'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/audit',
      name: 'Audit',
      component: Audit,
      meta:{ 
        requireAuth: true
      }
    },
    {
      path: '/tasklist',
      name: 'TaskList',
      component: TaskList,
      meta:{ 
        requireAuth: true
      }
    },
    {
      path: '/error',
      name: 'error',
      component: error,
    }
  ]
})

