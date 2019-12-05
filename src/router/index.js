import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    name: 'home',
    path: '/',
    component: () => import('@/views/Home.vue')
  },
  {
    name: 'view',
    path: '/:urlKey/view',
    component: () =>
      import(/* webpackChunkName: "analytics" */ '@/views/Analytics.vue'),
    props: true
  },
  {
    path: '*',
    component: () =>
      import(/* webpackChunkName: "notfound" */ '@/views/NotFound.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
