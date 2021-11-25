import { createRouter, createWebHistory } from 'vue-router';
import store from '../store';

const Home = () => import('../views/MagicShop.vue');
const Inventory = () => import('../views/Inventory.vue');
const AdminPage = () => import('../views/AdminPage.vue');
const CertificatePage = () => import('../views/CertificatePage.vue');

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/inventory',
    name: 'Inventory',
    component: Inventory,
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminPage,
    beforeEnter() {
      if (!store.state.User.owner) {
        store.dispatch('User/reset');
      }
    },
  },
  {
    path: '/manager',
    name: 'manager',
    component: CertificatePage,
    beforeEnter() {
      if (!store.state.User.owner) {
        store.dispatch('User/reset');
      }
    },
  },
  {
    path: '/no-provider',
    name: 'noProvider',
    component: () => import('@/views/NoProvider.vue'),
  },
  {
    path: '/metamask',
    beforeEnter() {
      window.location.href = 'https://metamask.io/download';
    },
  },
  {
    path: '/test',
    name: 'Sandbox',
    component: () => import('@/views/_Sandbox.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
