import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import Audit from '@/components/Audit'
import TaskList from '@/components/TaskList'

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
    }
  ]
})

