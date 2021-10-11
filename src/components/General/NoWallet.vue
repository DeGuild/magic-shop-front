<template>
  <div class="overlay"></div>
  <h1 class="text"><i class="fas fa-info-circle"></i></h1>
  <h2 class="text description">PLEASE CONNECT YOUR WALLET</h2>
</template>

<script>
export default {
  name: 'NoWallet',
};
</script>
<style scoped lang="scss">
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
    width: 36.927vw;
    height: 3.125vw;
    left: 32.552vw;
    top: 32.865vw;
    font-family: Secular One;
    font-style: normal;
    font-weight: normal;
    font-size: 2.5vw;
    line-height: 3.646vw;
    color: #ffffff;
  }
}
</style>
