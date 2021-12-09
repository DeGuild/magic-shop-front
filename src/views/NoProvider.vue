<template>
  <no-provider></no-provider>
  <missing></missing>
</template>

<script>
import { useStore } from 'vuex';
import { computed, reactive } from 'vue';
import { useHead } from '@vueuse/head';

import NoProvider from '../components/Display/NoProvider.vue';
import Missing from '../components/General/Missing.vue';
// @ is an alias to /src

export default {
  name: 'ConnectWalletSite',
  components: {
    Missing,
    NoProvider,
  },
  setup() {
    const store = useStore();
    const user = computed(() => store.state.User.user);
    const siteData = reactive({
      title: 'No Provider',
      description: 'You have not installed Metamask on your browser.',
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
    return { user };
  },
};
</script>
