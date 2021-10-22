<template>
  <div v-if="user">
    {{balance}}
  </div>
</template>

<script>
/* eslint-disable no-await-in-loop */

import { useStore } from 'vuex';
// import { useRoute } from 'vue-router';
import { computed } from 'vue';

/*
 * TODO: We will work on this component later, it will show how much DGT the user have
 */

export default {
  name: 'TokenDisplay',
  setup() {
    const store = useStore();
    // const route = useRoute();

    const balance = computed(() => store.state.User.balance);

    return {
      balance,
    };
  },
};
</script>

<style scoped lang="scss">
.btn {
  /* Small button */

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  position: absolute;
  width: 25vw;
  height: 10vw;
  left: 38.4vw;
  top: 20vw;

  /* standart theme/error */
  background: #ff7a52;
  border-radius: 4px;

  font-family: Secular One;
  font-style: normal;
  font-weight: normal;
  font-size: 3vw;
  display: flex;
  align-items: center;
  letter-spacing: 0.00892857em;
  text-transform: uppercase;

  /* shades/white */
  color: #ffffff;

  /* Inside Auto Layout */
  flex: none;
  order: 0;
  flex-grow: 0;
  margin: 0px 0px;

  &:hover {
    background: #ff6e42;
  }
  &.connected {
    &:hover {
      background: unset;
    }
    cursor: cursor;
  }
}
</style>
