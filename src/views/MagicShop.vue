<template>
  <div class="display-area">
    <div v-if="user !== null">
      <background />

      <div v-if="wallet === true">
        <item-shelf />
      </div>
    </div>
  </div>
  <no-wallet v-if="user === null" />
  <div v-if="wallet !== true && user !== null">
    <approve-modal></approve-modal>
    <approve-wallet></approve-wallet>
  </div>
  <shop-bar></shop-bar>
  <connect-wallet />
</template>

<script>
import { useStore } from 'vuex';
import { computed, reactive } from 'vue';
import { useHead } from '@vueuse/head';
import ConnectWallet from '../components/Buttons/ConnectWallet.vue';
import ApproveWallet from '../components/Buttons/ApproveWallet.vue';
import Background from '../components/General/Background.vue';
import NoWallet from '../components/General/NoWallet.vue';
import ApproveModal from '../components/General/Approve.vue';
import ItemShelf from '../components/Display/ItemShelf.vue';
import ShopBar from '../components/General/ShopBar.vue';
// @ is an alias to /src

export default {
  name: 'ConnectWalletSite',
  components: {
    ConnectWallet,
    Background,
    NoWallet,
    ItemShelf,
    ApproveModal,
    ApproveWallet,
    ShopBar,
  },
  setup() {
    const store = useStore();
    const user = computed(() => store.state.User.user);
    const wallet = computed(() => store.state.User.approval);

    const siteData = reactive({
      title: "Mona's Magic Shop - Shop",
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
<style lang="scss" scoped>
.display-area {
  position: absolute;
  left: 0vw;
  top: 4.4vw;
}
</style>
