<template>
  <ul>
    <li>
      <a :class="state.adminClass" @click="this.$router.push('/admin')"
        >Certificate Transfer</a
      >
    </li>
    <li>
      <a :class="state.cmClass" @click="this.$router.push('/manager')"
        >Certificate Manager</a
      >
    </li>
    <li><a @click="this.$router.push('/')">Back to shop</a></li>
  </ul>
</template>

<script>
// import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

import { defineComponent, reactive, computed } from 'vue';

export default defineComponent({
  name: 'NavBar',
  setup() {
    // const store = useStore();
    const route = useRoute();
    const state = reactive({
      name: null,
      adminClass: computed(() => (route.name === 'admin' ? 'active' : null)),
      cmClass: computed(() => (route.name === 'manager' ? 'active' : null)),
    });

    return {
      state,
    };
  },
});
</script>

<style scoped lang="scss">
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #333;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
}

li {
  float: left;
  & > a {
    display: block;
    color: white;
    text-align: center;
    font-family: Secular One;
    font-style: normal;
    font-weight: normal;
    font-size: 1vw;
    padding: 1.5vw 1.5vw;
    text-decoration: none;
  }
  &:hover:not(.active) {
    background-color: #111;
  }
}

.active {
  background-color: #04aa6d;
}

.overlay {
  /* Rectangle 9939 */

  position: absolute;
  width: 53.802vw;
  height: 25.313vw;
  left: 23.125vw;
  top: 16.458vw;

  background: rgba(0, 0, 0, 0.5);
}
.text {
  color: #ff0000;
  position: absolute;
  left: 45.729vw;
  top: 13.021vw;
  font-size: 10.417vw;

  &.description {
    position: absolute;
    width: 45.927vw;
    height: 3.125vw;
    left: 27.552vw;
    top: 32.865vw;
    font-family: Secular One;
    font-style: normal;
    font-weight: normal;
    font-size: 2.5vw;
    line-height: 3.646vw;
    color: #ffffff;
    // background-color: red;
  }
}
</style>
