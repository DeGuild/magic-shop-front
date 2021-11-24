<template>
  <navigation-bar></navigation-bar>
  <connect-wallet />
  <div v-if="user !== null">
    <certificate-manager></certificate-manager>
  </div>
  <no-wallet v-if="user === null" />
</template>

<script>
import { useStore } from 'vuex';
import { computed } from 'vue';
import ConnectWallet from '../components/Buttons/ConnectWallet.vue';
import NoWallet from '../components/General/NoWallet.vue';
import CertificateManager from '../components/General/CertificateManager.vue';
import NavigationBar from '../components/General/NavigationBar.vue';
// @ is an alias to /src

export default {
  name: 'AdminPage',
  components: {
    ConnectWallet,
    NoWallet,
    CertificateManager,
    NavigationBar,
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
