<template>
  <div class="dialog">
    <div class="dialog-text" v-bind:class="{ smaller: state.dialogStyle }">
      Sorry, please install Metamask.
    </div>
  </div>
  <button class="btn" v-on:click="this.$router.push('/metamask')">
    VISIT SITE
  </button>
</template>

<script>
import { useStore } from 'vuex';

import { defineComponent, reactive, computed } from 'vue';

export default defineComponent({
  name: 'Missing',
  setup() {
    const store = useStore();
    const state = reactive({
      name: null,
      dialogStyle: computed(() => store.state.User.dialog.length > 45),
    });

    return {
      state,
    };
  },
});
</script>
<style lang="scss" scoped>
.dialog {
  position: absolute;
  width: 67.552vw;
  height: 13.1vw;
  left: 16.198vw;
  top: 2vw;

  background: url('../../assets/dialogue.png');
  background-size: cover;
}
.dialog-text {
  position: absolute;
  width: 60vw;
  height: 3vw;
  left: 5vw;
  top: 5.5vw;
  font-family: Secular One;
  font-style: normal;
  font-weight: normal;
  font-size: 2.5vw;
  line-height: 3vw;
  color: #ffffff;
  background: '';
  background-size: cover;
  overflow: hidden;
  text-overflow: ellipsis;
  &.smaller {
    font-size: 1.55vw;
  }
}

.btn {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  position: absolute;
  width: 10vw;
  height: 3vw;
  left: 45.052vw;
  top: 43.458vw;

  background: #db2c00;
  border-radius: 4px;

  font-family: Secular One;
  font-style: normal;
  font-weight: normal;
  font-size: 1vw;
  display: flex;
  align-items: center;
  letter-spacing: 0.00892857em;
  text-transform: uppercase;

  color: #ffffff;

  flex: none;
  order: 0;
  flex-grow: 0;
  margin: 0px 0px;

  &:hover {
    background: #86250d;
  }
  &.connected {
    &:hover {
      background: #ff5252;
    }
    cursor: cursor;
  }
}
</style>
