<template>
  <div class="dialog">
    <div class="dialog-text">Welcome to Mona's Shop~</div>
  </div>
  <div class="npc"></div>
</template>

<script>
export default {
  name: 'Background',
};
</script>
<style scoped lang="scss">
.dialog {
  position: absolute;
  width: 68vw;
  height: 13.1vw;
  left: 27.24vw;
  top: 5.417vw;

  background: url('../../assets/dialogue.png');
  background-size: cover;
}
.dialog-text {
  /* Share your certificate and show your skill! */
  position: absolute;
  width: 60vw;
  height: 13.1vw;
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
}
.npc {
  position: absolute;
  width: 22vw;
  height: 22vw;
  left: 5vw;
  top: 0vw;

  background: url('../../assets/npc.png');
  background-size: cover;
}
</style>
