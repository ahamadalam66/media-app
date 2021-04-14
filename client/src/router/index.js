import Vue from 'vue'
import VueRouter from 'vue-router'
import MediaPage from '../views/MediaPage.vue'
import UploadPage from '../views/UploadPage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'MediaPage',
    component: MediaPage
  },
  {
    path: '/uploads',
    name: 'UploadPage',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/UploadPage.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
