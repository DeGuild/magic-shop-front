<template>
  <connect-wallet />
  <div v-if="user !== null">
    <admin-panel></admin-panel>
  </div>
  <no-wallet v-if="user === null" />
</template>

<script>
import { useStore } from 'vuex';
import { computed } from 'vue';
import ConnectWallet from '../components/Buttons/ConnectWallet.vue';
import NoWallet from '../components/General/NoWallet.vue';
import AdminPanel from '../components/General/AdminPanel.vue';
// @ is an alias to /src

export default {
  name: 'AdminPage',
  components: {
    ConnectWallet,
    NoWallet,
    AdminPanel,
  },
  setup() {
    const store = useStore();
    const user = computed(() => store.state.User.user);
    const wallet = computed(() => store.state.User.approval);
    // console.log(store.state.User.user);
    // console.log(user);
    return { user, wallet };
  },
};
</script>
