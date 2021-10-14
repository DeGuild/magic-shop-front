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
    <div class="background current-item-frame" />
    <div class="image selected">
      <img class="image selected display" :src="state.imageSelected" />
    </div>
    <div class="text">Introduction to Programming</div>
    <div class="text description">
      This is a young cute cat. Bring it home so you can achieve eternal
      happiness.
    </div>
    <button class="navButton buy" v-on:click="dummy()">Buy</button>
    <div class="text price">30 DGT</div>
  </div>
  <button class="navButton previous" v-on:click="dummy()">&#60;</button>
  <button
    class="navButton exam"
    :class="{ disabled: !state.showExam }"
    v-on:click="showExam"
  >
    Exam Only
  </button>
  <button
    class="navButton both"
    :class="{ disabled: !state.showBoth }"
    v-on:click="showBoth"
  >
    Both
  </button>
  <button
    class="navButton all"
    :class="{ disabled: !state.showAll }"
    v-on:click="showAll"
  >
    All
  </button>
  <button class="navButton" v-on:click="dummy()">&#62;</button>
</template>

<script>
import { defineComponent, reactive } from 'vue';

export default defineComponent({
  name: 'ItemShelf',
  setup() {
    const state = reactive({
      showBoth: true,
      showExam: false,
      showAll: false,
      pageIdx: 0,
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
    function showAll() {
      state.showAll = true;
      state.showExam = false;
      state.showBoth = false;
    }
    function showBoth() {
      state.showBoth = true;
      state.showExam = false;
      state.showAll = false;
    }
    function showExam() {
      state.showExam = true;
      state.showBoth = false;
      state.showAll = false;
    }
    return {
      state,
      dummy,
      choosing,
      showAll,
      showBoth,
      showExam,
    };
  },
});
</script>

<style scoped lang="scss">
.image {
  width: 7.5vw;
  height: 7.5vw;
  position: absolute;

  &.display {
    position: static;
  }

  &.click {
    cursor: pointer;
    &:hover {
      opacity: 0.9;
    }
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
  &.item-box {
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
  left: 90.292vw;

  top: 49.635vw;
  position: absolute;

  background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.25) 0%,
      rgba(255, 255, 255, 0) 100%
    ),
    #9002ff;
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
    left: 47.292vw;
  }

  &.exam {
    width: 10.171vw;
    left: 54.292vw;
    background: linear-gradient(
        180deg,
        rgba(0, 0, 0, 0.25) 0%,
        rgba(255, 255, 255, 0) 100%
      ),
      #ffae02;
    &.disabled {
      background: linear-gradient(
          180deg,
          rgba(0, 0, 0, 0.25) 0%,
          rgba(255, 255, 255, 0) 100%
        ),
        #a7a7a7;
    }
  }

  &.both {
    width: 10.171vw;
    left: 66.292vw;
    &.disabled {
      background: linear-gradient(
          180deg,
          rgba(0, 0, 0, 0.25) 0%,
          rgba(255, 255, 255, 0) 100%
        ),
        #a7a7a7;
    }
  }

  &.all {
    width: 10.171vw;
    left: 78.292vw;
    background: linear-gradient(
        180deg,
        rgba(0, 0, 0, 0.25) 0%,
        rgba(255, 255, 255, 0) 100%
      ),
      #58e7f0;
    &.disabled {
      background: linear-gradient(
          180deg,
          rgba(0, 0, 0, 0.25) 0%,
          rgba(255, 255, 255, 0) 100%
        ),
        #a7a7a7;
    }
  }

  &.buy {
    width: 11.615vw;
    top: 25vw;
    left: 15.4vw;

    background: linear-gradient(
        180deg,
        rgba(0, 0, 0, 0.25) 0%,
        rgba(255, 255, 255, 0) 100%
      ),
      #ffae02;
    background-blend-mode: soft-light, normal;
    border-radius: 2vw;
    &.disabled {
      background: linear-gradient(
          180deg,
          rgba(0, 0, 0, 0.25) 0%,
          rgba(255, 255, 255, 0) 100%
        ),
        #a7a7a7;
    }
  }
}

.text {
  position: absolute;
  width: 10vw;
  height: 5.938vw;
  left: 15vw;
  top: 5.1vw;

  font-family: Poppins;
  font-weight: bold;
  font-size: 1.302vw;
  line-height: 1.927vw;

  display: flex;
  align-items: center;
  text-align: center;
  color: #ffffff;

  text-overflow: ellipsis;
  overflow: hidden;
  white-space: normal;

  background: '';
  background-size: cover;

  &.price {
    left: 16.8vw;
    top: 28vw;
    font-size: 1vw;
    display: unset;
    text-align: right;
  }

  &.description {
    position: absolute;
    width: 23.865vw;
    height: 18.542vw;
    left: 2.3vw;
    top: 7vw;
    font-size: 1.1vw;
  }
}
</style>
