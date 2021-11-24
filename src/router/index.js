import { createRouter, createWebHistory } from 'vue-router';
import ConnectWallet from '../views/MagicShop.vue';
import AdminPage from '../views/AdminPage.vue';
import CertificatePage from '../views/CertificatePage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: ConnectWallet,
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminPage,
  },
  {
    path: '/manager',
    name: 'manager',
    component: CertificatePage,
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
