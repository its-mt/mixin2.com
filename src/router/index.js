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
  },
  {
    path: '/projects/loop-piano',
    name: 'LoopPiano',
    component: () => import('../projects/LoopPiano.vue')
  },
  {
    path: '/projects/woodland-scene',
    name: 'WoodlandScene',
    component: () => import('../projects/WoodlandScene.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
