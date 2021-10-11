import { createRouter, createWebHistory } from 'vue-router';
import ConnectWallet from '../views/MagicShop.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: ConnectWallet,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
