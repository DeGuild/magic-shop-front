<template>
  <div class="selection">
    <div class="background"></div>
    <div v-for="imageIndex in 8" :key="imageIndex">
      <div
        class="background frame"
        :style="state.stylesFrame[imageIndex]"
      ></div>
      <div
        class="half-circle-spinner"
        :style="state.styles[imageIndex]"
        v-if="state.loading"
      >
        <div class="half-circle-spinner circle circle-1"></div>
        <div class="half-circle-spinner circle circle-2"></div>
      </div>
      <div class="image" :style="state.styles[imageIndex]" v-if="state.images[imageIndex - 1]">
          <img
            class="image display click"
            :style="state.styles[imageIndex]"
            :src="state.images[imageIndex - 1].url"
            v-on:click="choosing(imageIndex - 1)"
          />
      </div>
    </div>
    <!-- <button
      class="navButton previous"
      v-on:click="dummy()"
      v-if="state.pageIdx > 0"
    >
      &#60;
    </button> -->
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
    <!-- <button
      class="navButton"
      v-on:click="dummy()"
      v-if="state.pageIdx < state.images.length / 8 - 1"
    >
      &#62;
    </button> -->
  </div>
  <div class="selection item">
    <div class="background item-box">
      <div class="background current-item-frame" />

      <div class="image selected" v-if="state.imageSelected">
        <img class="image selected display" :src="state.imageSelected.url" />
      </div>
      <div class="text">Introduction to Programming</div>
      <div class="text own">Owned: 99999999</div>
      <div class="text description">
        This is a young cute cat. Bring it home so you can achieve eternal
        happiness.
      </div>
      <button class="navButton buy" v-on:click="dummy()">Buy</button>
      <div class="text price">30 DGT</div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */

import { defineComponent, reactive, computed } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'ItemShelf',
  setup() {
    const store = useStore();
    /**
     * Returns the urls of the certificates of this user
     *
     * @param {certificate[]} proxy The certificates of this user
     * @return {string[]} array of the urls.
     */
    function urlExtractor(proxy) {
      const urlArr = [];
      for (let index = 0; index < proxy.length; index += 1) {
        if (proxy[index].length !== 0) urlArr.push(proxy[index][1].imageUrl);
      }
      return urlArr;
    }
    /**
     * Returns the name of the certificates of this user
     *
     * @param {certificate[]} proxy The certificates of this user
     * @return {string[]} array of the names.
     */
    function nameExtractor(proxy) {
      const urlArr = [];
      for (let index = 0; index < proxy.length; index += 1) {
        if (proxy[index].length !== 0) urlArr.push(proxy[index][0]);
      }
      return urlArr;
    }

    /**
     * Returns the address of the certificates of this user
     *
     * @param {certificate[]} proxy The certificates of this user
     * @return {string[]} array of the addresses.
     */
    function addressExtractor(proxy) {
      const urlArr = [];
      for (let index = 0; index < proxy.length; index += 1) {
        if (proxy[index].length !== 0) urlArr.push(proxy[index][2]);
      }
      return urlArr;
    }

    /**
     * Returns the computed image urls to display
     *
     * @return {string[]} array of the image urls.
     */
    function computeImages() {
      const page = [];
      const certs = store.state.User.certificates
        ? urlExtractor(store.state.User.certificates)
        : store.state.User.certificates;
      const startIdx = 0 + store.state.User.certificatePage * 8;
      if (certs) {
        const amount = startIdx + 8 < certs.length ? startIdx + 8 : certs.length;
        for (let index = startIdx; index < amount; index += 1) {
          const element = certs[index];
          page.push(element);
        }
      }
      return page;
    }

    /**
     * Returns the computed image names to display
     *
     * @return {string[]} array of the image names.
     */
    function computeNames() {
      const page = [];
      const certs = store.state.User.certificates
        ? nameExtractor(store.state.User.certificates)
        : store.state.User.certificates;
      const startIdx = 0 + store.state.User.certificatePage * 8;
      if (certs) {
        const amount = startIdx + 8 < certs.length ? startIdx + 8 : certs.length;
        for (let index = startIdx; index < amount; index += 1) {
          const element = certs[index];
          page.push(element);
        }
      }
      return page;
    }

    /**
     * Returns the computed image addresses to display
     *
     * @return {string[]} array of the image addresses.
     */
    function computeAddresses() {
      const page = [];
      const certs = store.state.User.certificates
        ? addressExtractor(store.state.User.certificates)
        : store.state.User.certificates;
      const startIdx = 0 + store.state.User.certificatePage * 8;
      if (certs) {
        const amount = startIdx + 8 < certs.length ? startIdx + 8 : certs.length;
        for (let index = startIdx; index < amount; index += 1) {
          const element = certs[index];
          page.push(element);
        }
      }
      return page;
    }
    // images: computed(() => store.state.User.scrollList),

    const state = reactive({
      showBoth: true,
      showExam: false,
      showAll: false,
      scrollSelected: computed(() => (store.state.User.selectedScroll
        ? store.state.User.selectedScroll : null)),
      loading: computed(() => store.state.User.fetching),
      pageIdx: computed(() => store.state.User.magicScrollPage),
      images: computed(() => (store.state.User.scrollList ? store.state.User.scrollList : [])),
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
      console.log(store.state.User.scrollList);
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
.selection {
  top: 3.5vw;
  left: -2vw;
  position: absolute;
  &.item {
    top: 0vw;
    left: -3vw;
  }
}
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
    width: 35vw;
    height: 40vw;
    left: 7vw;
    top: 21vw;

    background: url('../../assets/itemDescription.png');
    background-size: contain;
    background-repeat: no-repeat;
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
    top: 30vw;
    left: 20.4vw;

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
  width: 20vw;
  height: 6vw;
  left: 13vw;
  top: 4.5vw;

  font-family: Poppins;
  font-weight: bold;
  font-size: 1.302vw;
  line-height: 1.927vw;

  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;

  text-overflow: ellipsis;
  overflow: hidden;
  white-space: normal;

  background: '';
  background-size: cover;
  // background-color: red;

  &.price {
    left: 22vw;
    top: 33.5vw;
    width: 10vw;
    height: 2vw;
    font-size: 1vw;
    display: unset;
    text-align: right;
  }

  &.own {
    position: absolute;
    height: 2vw;
    top: 10vw;
    font-size: 1vw;
  }

  &.description {
    position: absolute;
    width: 30.5vw;
    height: 15vw;
    left: 2.3vw;
    top: 14vw;
    font-size: 1.1vw;
  }
}
.half-circle-spinner {
  box-sizing: border-box;
  width: 5vw;
  height: 5vw;
  top: 1.1vw;
  left: 1.1vw;
  border-radius: 100%;
  position: absolute;

  &.circle {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 100%;
    border: calc(60px / 10) solid transparent;
  }

  &.circle.circle-1 {
    border-top-color: #ff1d5e;
    animation: half-circle-spinner-animation 1s infinite;
  }

  &.circle.circle-2 {
    border-bottom-color: #ff1d5e;
    animation: half-circle-spinner-animation 1s infinite alternate;
  }

  @keyframes half-circle-spinner-animation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
