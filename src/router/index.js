import { createRouter, createWebHistory } from '@ionic/vue-router';
import Tabs from '../views/Tabs.vue'
import {getCurrentUser } from '../main'



const routes= [
  {
    path: '/',
    redirect: '/tabs/tab1'
  },
  {
    path: '/signin',
    name: 'signIn',
    component: () => import('@/views/SignIn.vue')
  },
  {
    path: '/r/:nickname?',
    name: 'register',
    component: () => import('@/views/SignIn.vue')
  },
  {
    path: '/tabs/',
    component: Tabs,
    meta: {
      requiresAuth:true
    },
    children: [
      {
        path: '',
        redirect: '/tabs/tab1'
      },
      {
        path: 'tab1',
        component: () => import('@/views/Tab1.vue')
      },
      {
        path: 'tab2',
        component: () => import('@/views/Tab2.vue')
      },
      {
        path: 'tab3',
        component: () => import('@/views/Tab3.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
router.beforeEach(async (to, from, next) => {
  const auth = to.meta.requiresAuth

  if (auth && !await getCurrentUser() ) {
    next('/signin');
  } else {
    next();
  }
})
export default router
