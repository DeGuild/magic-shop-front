<template>
  <div class="background"></div>
  <div v-for="imageIndex in 8" :key="imageIndex">
    <div class="background frame" :style="state.stylesFrame[imageIndex]"></div>

    <div class="image" :style="state.styles[imageIndex]">
      <img
        class="image display click"
        :style="state.styles[imageIndex]"
        :src="state.images[imageIndex]"
        v-if="state.images[imageIndex]"
        v-on:click="choosing(imageIndex)"
      />
    </div>
  </div>
  <div class="background item-box">
    <div class="background current-item-frame"/>
    <div class="image selected">
      <img class="image selected display" :src="state.imageSelected" />
    </div>
    <div class="text"> Cute Cat Lv.1 </div>
    <div class="text description"> This is a young cute cat.
      Bring it home so you can achieve eternal happiness. </div>
      <button class="navButton buy" v-on:click="dummy()"> Buy </button>
  </div>
  <button class="navButton previous" v-on:click="dummy()">&#62;</button>
  <button class="navButton exam" v-on:click="dummy()"> Exam Only </button>
  <button class="navButton both" v-on:click="dummy()"> Both </button>
  <button class="navButton all" v-on:click="dummy()"> All </button>
  <button class="navButton" v-on:click="dummy()">&#60;</button>
</template>

<script>
import { defineComponent, reactive } from 'vue';

export default defineComponent({
  name: 'ItemShelf',
  setup() {
    const state = reactive({
      imageSelected: 'https://placekitten.com/803/800',
      images: [
        'https://placekitten.com/801/800',
        'https://placekitten.com/802/800',
        'https://placekitten.com/803/800',
        'https://placekitten.com/801/800',
        'https://placekitten.com/802/800',
        'https://placekitten.com/803/800',
        'https://placekitten.com/801/800',
        'https://placekitten.com/802/800',
        'https://placekitten.com/803/800',
        'https://placekitten.com/803/800',
        'https://placekitten.com/801/800',
        'https://placekitten.com/802/800',
        'https://placekitten.com/803/800',
        'https://placekitten.com/801/800',
        'https://placekitten.com/802/800',
        'https://placekitten.com/803/800',
        'https://placekitten.com/801/800',
        'https://placekitten.com/802/800',
        'https://placekitten.com/803/800',
        'https://placekitten.com/803/800',
      ],
      styles: [
        {},
        {
          left: '50vw',
          top: '26.406vw',
        },
        {
          left: '61.979vw',
          top: '26.406vw',
        },
        {
          left: '73.958vw',
          top: '26.406vw',
        },
        {
          left: '85.938vw',
          top: '26.406vw',
        },
        {
          left: '50vw',
          top: '38.021vw',
        },
        {
          left: '61.979vw',
          top: '38.021vw',
        },
        {
          left: '73.958vw',
          top: '38.021vw',
        },
        {
          left: '85.938vw',
          top: '38.021vw',
        },
      ],
      stylesFrame: [
        {},
        {
          left: '49.4vw',
          top: '25.9vw',
        },
        {
          left: '61.379vw',
          top: '25.9vw',
        },
        {
          left: '73.358vw',
          top: '25.9vw',
        },
        {
          left: '85.337vw',
          top: '25.9vw',
        },
        {
          left: '49.4vw',
          top: '37.515vw',
        },
        {
          left: '61.379vw',
          top: '37.515vw',
        },
        {
          left: '73.358vw',
          top: '37.515vw',
        },
        {
          left: '85.337vw',
          top: '37.515vw',
        },
      ],
    });
    function dummy() {
      console.log('Calling the dummy function');
    }
    function choosing(imageIdx) {
      state.imageSelected = state.images[imageIdx];
    }
    return {
      state,
      dummy,
      choosing,
    };
  },
});
</script>

<style scoped lang="scss">
.image {
  width: 7.5vw;
  height: 7.5vw;
  position: absolute;
  background: #c4c4c4;

  &.display {
    position: static;
  }

  &.click {
    cursor: pointer;
  }

  &.selected {
    width: 7.1vw;
    height: 7.1vw;
    left: 4.2vw;
    top: 4.5vw;
  }
}
.background {
  width: 52.031vw;
  height: 24.167vw;
  position: absolute;
  background: #585858;
  left: 45.625vw;
  top: 24.115vw;
  &.frame {
    width: 8.542vw;
    height: 8.542vw;
    background: url('../../assets/itemFrame.png');
    background-size: cover;
  }
  &.item-box{
        position: absolute;
      width: 29.063vw;
      height: 32.016vw;
      left: 7vw;
      top: 22.8vw;

      background: url('../../assets/itemDescription.png');
      background-size: cover;
  }
  &.current-item-frame {
      position: absolute;
      width: 7.563vw;
      height: 7.948vw;
      left: 4vw;
      top: 4vw;

      background: url('../../assets/currentItemFrame.png');
      background-size: cover;
  }
}
.navButton {
  display: flex;
  cursor: pointer;

  width: 5.171vw;
  height: 2.727vw;
  left: 47.292vw;
  top: 49.635vw;
  position: absolute;

  background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.25) 0%,
      rgba(255, 255, 255, 0) 100%
    ),
    #9002FF;
  background-blend-mode: soft-light, normal;
  border-radius: 1.25vw;

  font-family: Poppins;
  font-style: normal;
  font-weight: 900;
  font-size: 1.302vw;
  line-height: 1.927vw;

  align-items: center;
  text-align: center;
  justify-content: center;

  letter-spacing: -0.015em;
  color: #ffffff;

  text-shadow: 0px 2px 4px rgba(91, 26, 26, 0.14),
    0px 3px 4px rgba(123, 12, 12, 0.12), 0px 1px 5px rgba(136, 13, 13, 0.2);

  &.previous {
    left: 90.292vw;
  }

  &.exam {
    width: 10.171vw;
    left: 54.292vw;
  }

  &.both {
    width: 10.171vw;
    left: 66.292vw;
  }

  &.all {
    width: 10.171vw;
    left: 78.292vw;
  }

  &.buy {
    width: 11.615vw;
    background: #FFAE02;
    top: 25vw;
    left: 14vw;
  }
}

.text {
  position: absolute;
  width: 20.417vw;
  height: 5.938vw;
  left: 15vw;
  top: 5.5vw;
  font-family: Secular One;
  font-style: normal;
  font-weight: 900;
  font-size: 25px;
  line-height: 37px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #FFFFFF;
  background: '';
  background-size: cover;
  &.description {
    position:absolute;
    width: 23.865vw;
    height: 18.542vw;
    left: 2.3vw;
    top: 10vw;
    font-size: 20px;
  }
}
</style>
