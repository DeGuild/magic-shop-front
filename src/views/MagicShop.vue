<template>
  <background />
  <connect-wallet />
  <div v-if="user !== null">
    <item-shelf/>
  </div>
  <no-wallet v-if="user === null" />
</template>

<script>
import { useStore } from 'vuex';
import { computed } from 'vue';
import ConnectWallet from '../components/Buttons/ConnectWallet.vue';
import Background from '../components/General/Background.vue';
import NoWallet from '../components/General/NoWallet.vue';
import ItemShelf from '../components/Display/ItemShelf.vue';
// @ is an alias to /src

export default {
  name: 'ConnectWalletSite',
  components: {
    ConnectWallet,
    Background,
    NoWallet,
    ItemShelf,
  },
  setup() {
    const store = useStore();
    const user = computed(() => store.state.User.user);
    // console.log(store.state.User.user);
    // console.log(user);
    return { user };
  },
};
</script>
