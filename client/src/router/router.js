import Vue from 'vue'
import VueRouter from "vue-router";
import VueSidebarMenu from "vue-sidebar-menu";
import Home from '../views/Home.vue'
import { authGuard } from "../auth/authGuard";

// sidemenu
Vue.use(VueRouter);
Vue.use(VueSidebarMenu);

export default new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/About.vue')
    },
    {
      path: '/arch/AWS',
      name: 'AWS',
      component: () => import('../views/Arch.vue')
    },
    {
      path: '/event/:id',
      name: 'eventSingle',
      component: () => import('../views/EventSingle.vue'),
      beforeEnter: authGuard
    }
  ]
})