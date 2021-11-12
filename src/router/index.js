import { createRouter, createWebHistory } from 'vue-router';
import ConnectWallet from '../views/MagicShop.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: ConnectWallet,
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
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
