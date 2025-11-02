import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/projects/binary-beats',
    name: 'BinaryBeats',
    component: () => import('../projects/BinaryBeats.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
