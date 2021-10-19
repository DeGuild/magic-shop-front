<template>
  <div class="shopfront"></div>
  <div class="dialog">
    <div class="dialog-text" v-bind:class="{ smaller: state.dialogStyle }">
      {{ state.dialog }}
    </div>
  </div>
  <div class="npc"></div>
</template>

<script>
import { useStore } from 'vuex';
import { defineComponent, reactive, computed } from 'vue';

export default defineComponent({
  name: 'Dialog',
  setup() {
    const store = useStore();
    const state = reactive({
      dialog: computed(() => store.state.User.dialog),
      dialogStyle: computed(() => store.state.User.dialog.length > 45),
    });

    return {
      state,
    };
  },
});
</script>
<style scoped lang="scss">
.shopfront{
  position: absolute;
  width: 99.215vw;
  height: 19vw;
  top: 0vw;
  left: 0vw;

  background: url('../../assets/magic-shop-bg.png');
  background-size: cover;
}
.dialog {
  position: absolute;
  width: 68vw;
  height: 13.1vw;
  left: 27.24vw;
  top: 4vw;

  background: url('../../assets/dialogue.png');
  background-size: cover;
}
.dialog-text {
  /* Share your certificate and show your skill! */
  position: absolute;
  width: 60vw;
  height: 3vw;
  left: 5vw;
  top: 5.5vw;
  font-family: Secular One;
  font-style: normal;
  font-weight: normal;
  font-size: 2.25vw;
  line-height: 3vw;
  color: #ffffff;
  background: '';
  background-size: cover;
  overflow: hidden;
  text-overflow: ellipsis;
  &.smaller {
    font-size: 1.4vw;
  }
}
.npc {
  position: absolute;
  width: 32vw;
  height: 16.5vw;
  left: 0vw;
  top: 2.45vw;

  background: url('../../assets/npc.png');
  background-size: cover;
}
</style>
