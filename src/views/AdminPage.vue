<template>
  <connect-wallet />
  <div v-if="user !== null">
    <div v-if="wallet === true">
    </div>
    <div v-if="wallet !== true">
      <approve-modal></approve-modal>
      <approve-wallet></approve-wallet>
    </div>
  </div>
  <no-wallet v-if="user === null" />
</template>

<script>
import { useStore } from 'vuex';
import { computed } from 'vue';
import ConnectWallet from '../components/Buttons/ConnectWallet.vue';
import ApproveWallet from '../components/Buttons/ApproveWallet.vue';
import NoWallet from '../components/General/NoWallet.vue';
import ApproveModal from '../components/General/Approve.vue';
// @ is an alias to /src

export default {
  name: 'AdminPage',
  components: {
    ConnectWallet,
    NoWallet,
    ApproveModal,
    ApproveWallet,
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
