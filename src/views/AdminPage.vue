<template>
  <navigation-bar></navigation-bar>

  <connect-wallet />
  <div v-if="user !== null">
    <admin-panel v-if="true"></admin-panel>
  </div>
  <no-wallet v-if="user === null" />
</template>

<script>
import { useStore } from 'vuex';
import { computed, reactive } from 'vue';
import { useHead } from '@vueuse/head';

import ConnectWallet from '../components/Buttons/ConnectWallet.vue';
import NoWallet from '../components/General/NoWallet.vue';
import AdminPanel from '../components/General/AdminPanel.vue';
import NavigationBar from '../components/General/NavigationBar.vue';
// @ is an alias to /src

export default {
  name: 'AdminPage',
  components: {
    ConnectWallet,
    NoWallet,
    AdminPanel,
    NavigationBar,
  },
  setup() {
    const store = useStore();
    const user = computed(() => store.state.User.user);
    const wallet = computed(() => store.state.User.approval);

    const siteData = reactive({
      title: 'Mona\'s Magic Shop - Admin',
      description: 'Courses for everyone',
    });
    useHead({
      title: computed(() => siteData.title),
      meta: [
        {
          name: 'description',
          content: computed(() => siteData.description),
        },
      ],
    });
    return { user, wallet };
  },
};
</script>
