<template>
  <div class="display-area">
    <div v-if="user !== null">
      <div v-if="wallet === true">
        <personal-inventory></personal-inventory>
      </div>
    </div>
  </div>
  <div v-if="wallet !== true && user !== null">
    <approve-modal></approve-modal>
    <approve-wallet></approve-wallet>
  </div>
  <no-wallet v-if="user === null" />
  <shop-bar></shop-bar>
  <connect-wallet />
</template>

<script>
import { useStore } from 'vuex';
import { computed, reactive } from 'vue';
import { useHead } from '@vueuse/head';
import ConnectWallet from '../components/Buttons/ConnectWallet.vue';
import ApproveWallet from '../components/Buttons/ApproveWallet.vue';
import NoWallet from '../components/General/NoWallet.vue';
import ApproveModal from '../components/General/Approve.vue';
import ShopBar from '../components/General/ShopBar.vue';
import PersonalInventory from '../components/Display/PersonalInventory.vue';
// @ is an alias to /src

export default {
  name: 'ConnectWalletSite',
  components: {
    ConnectWallet,
    NoWallet,
    ApproveModal,
    ApproveWallet,
    ShopBar,
    PersonalInventory,
  },
  setup() {
    const store = useStore();
    const user = computed(() => store.state.User.user);
    const wallet = computed(() => store.state.User.approval);
    // console.log(store.state.User.user);
    // console.log(user);
    const siteData = reactive({
      title: "Mona's Magic Shop - Inventory",
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
  top: -15vw;
}
</style>
