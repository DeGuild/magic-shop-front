<template>
  <div class="selection">
    <div class="background"></div>
    <div v-for="imageIndex in 8" :key="imageIndex">
      <div
        class="background frame"
        :style="state.stylesFrame[imageIndex]"
      ></div>
      <div
        class="image"
        :style="state.styles[imageIndex]"
        v-if="imageIndex - 1 + state.pageIdx * 8 < state.images.length"
        v-show="!state.loading"
      >
        <img
          class="image display"
          :style="state.styles[imageIndex]"
          :src="state.images[imageIndex + state.pageIdx * 8 - 1].url"
        />
      </div>
      <div
        class="background frame click"
        :style="state.stylesFrame[imageIndex]"
        v-if="imageIndex - 1 + state.pageIdx * 8 < state.images.length"
        v-on:click="
          state.loading ? null : choosing(imageIndex - 1 + state.pageIdx * 8)
        "
      ></div>
      <div v-if="state.loading">
        <div class="image no-bg" :style="state.styles[imageIndex]">
          <img
            class="image display no-bg"
            :style="state.styles[imageIndex]"
            src="@/assets/Spinner-1s-200px.svg"
          />
        </div>
        <div
          class="background frame"
          :style="state.stylesFrame[imageIndex]"
        ></div>
      </div>
    </div>
    <button
      class="Button consuming cancel"
      v-if="state.consuming"
      v-on:click="state.loading ? null : cancelConsume()"
    >
      Cancel
    </button>
    <button
      class="Button previous"
      v-on:click="state.loading ? null : showPrevious()"
      v-if="state.pageIdx > 0"
    >
      &#60;
    </button>
    <button
      class="Button exam"
      :class="{ disabled: !state.showExam }"
      v-on:click="state.loading ? null : showExam()"
    >
      Exam Only
    </button>
    <button
      class="Button both"
      :class="{ disabled: !state.showBoth }"
      v-on:click="state.loading ? null : showBoth()"
    >
      Both
    </button>
    <button
      class="Button all"
      :class="{ disabled: !state.showAll }"
      v-on:click="state.loading ? null : showAll()"
    >
      All
    </button>
    <button
      class="Button"
      v-on:click="state.loading ? null : showNext()"
      v-if="state.hasNext"
    >
      &#62;
    </button>
    <div class="background overlay" v-if="state.consuming"></div>
  </div>

  <div class="selection item">
    <div class="background item-box">
      <div class="background current-item-frame" />
      <div v-if="state.imageSelected">
        <div>
          <div class="image selected">
            <img
              class="image selected display"
              :src="state.imageSelected.url"
            />
          </div>
          <div class="text">{{ state.imageSelected.name }}</div>
          <div class="text own">TokenId: {{ state.imageSelected.tokenId }}</div>
          <div class="text description">
            {{ state.imageSelected.description }}
          </div>
          <button
            class="Button buy"
            v-if="state.imageSelected.state === 1"
            v-on:click="state.loading ? null : consume()"
            :class="{ disabled: state.buying }"
            :disabled="state.buying"
            v-html="state.consumeButton"
          ></button>
          <button
            v-if="state.imageSelected.state === 2"
            class="Button consumed"
            :disabled="true"
          >
            CONSUMED
          </button>
          <button
            class="Button burned"
            v-if="state.imageSelected.state === 3"
            :disabled="true"
          >
            BURNED
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- For consuming -->
  <div class="selection item" v-if="state.consuming">
    <div class="background item-box">
      <h1 class="text passcode label">Type your passcode</h1>
      <input
        class="text passcode"
        v-model="state.passcode"
        placeholder="secret"
        type="text"
      />
      <h1 class="text passcode instruction">
        *Passcode is given by your instructor
      </h1>

      <button
        class="Button buy"
        :class="{
          disabled: !state.passcode,
        }"
        @click="sendConsume()"
        :disabled="!state.passcode"
      >
        DONE
      </button>
    </div>
  </div>
</template>

<script>

import {
  defineComponent, reactive, computed, onBeforeMount,
} from 'vue';
import { useStore } from 'vuex';

const Web3 = require('web3');

const magicScrollABI = require('../../../../DeGuild-MG-CS-Token-contracts/artifacts/contracts/MagicShop/V2/IMagicScrolls+.sol/IMagicScrollsPlus.json').abi;
require('dotenv').config();

const shopAddress = process.env.VUE_APP_SHOP_ADDRESS;

export default defineComponent({
  name: 'PersonalInventory',
  setup() {
    const store = useStore();
    const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');

    const state = reactive({
      consumeButton: 'ACTIVATE',
      passcode: null,
      consuming: false,
      showBoth: false,
      showExam: false,
      showAll: false,
      nextPage: false,
      buying: false,
      adding: false,
      scrollSelected: computed(() => (store.state.User.selectedScroll
        ? store.state.User.selectedScroll : null)),
      loading: computed(() => store.state.User.fetching),
      pageIdx: 0,
      hasNext: computed(() => store.state.User.scrollToFetch),
      images: computed(() => (store.state.User.scrollList ? store.state.User.scrollList : [])),
      own: 0,
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
      imageSelected: null,
    });

    /**
     * Display consume component
     */
    function consume() {
      state.consuming = true;
    }

    /**
     * Display data of the chosen item on the board
     *
     * @param {int} imageIdx index of image
     */
    async function choosing(imageIdx) {
      state.imageSelected = state.images[imageIdx];

      state.own = state.imageSelected.own;
    }

    /**
     * Fetch magic scrolls based from `pageidx`
     *
     * @param {int} pageidx index of page
     */
    async function fetchAllMagicScrolls(pageidx) {
      const response = await fetch(
        `https://us-central1-deguild-2021.cloudfunctions.net/app/magicScrolls/inventory/${shopAddress}/${store.state.User.user}/${pageidx}`,
        { mode: 'cors' },
      );

      const magicScrolls = await response.json();
      const nextIsPossible = await fetch(
        `https://us-central1-deguild-2021.cloudfunctions.net/app/magicScrolls/inventory/${shopAddress}/${
          store.state.User.user
        }/${pageidx + 1}`,
        { mode: 'cors' },
      );

      if (nextIsPossible.status === 200) {
        store.dispatch('User/setMagicScrollToFetch', true);
      } else {
        store.dispatch('User/setMagicScrollToFetch', false);
      }

      return magicScrolls;
    }

    /**
     * Send a transaction to consume the magic scroll
     *
     * @return {object} transaction info or empty object.
     */
    async function sendConsume() {
      store.dispatch('User/setFetching', true);

      const magicShop = new web3.eth.Contract(magicScrollABI, shopAddress);
      const realAddress = web3.utils.toChecksumAddress(store.state.User.user);

      try {
        const tranasction = await magicShop.methods
          .consume(state.imageSelected.tokenId, state.passcode)
          .send({ from: realAddress });

        store.dispatch('User/setFetching', false);

        return tranasction;
      } catch (error) {
        store.dispatch('User/setFetching', false);

        return {};
      }
    }

    /**
     * it will show the next page when browsing scrolls
     */
    async function showNext() {
      state.pageIdx += 1;
      store.dispatch('User/setFetching', true);
      const scrollsData = await fetchAllMagicScrolls(state.pageIdx);
      store.dispatch('User/setMagicScrolls', scrollsData);
      setTimeout(() => store.dispatch('User/setFetching', false), 100);
    }

    /**
     * it will show the previous page when browsing scrolls
     */
    async function showPrevious() {
      state.pageIdx -= 1;
      store.dispatch('User/setFetching', true);
      store.dispatch('User/setFetching', true);
      const scrollsData = await fetchAllMagicScrolls(state.pageIdx);
      store.dispatch('User/setMagicScrolls', scrollsData);
      setTimeout(() => store.dispatch('User/setFetching', false), 100);
    }

    /**
     * it will cancel scroll consumption
     */
    function cancelConsume() {
      state.consuming = false;
    }

    /**
     * Show all scrolls
     */
    function showAll() {
      state.showAll = true;
      state.showExam = false;
      state.showBoth = false;
      state.pageIdx = 0;

      state.images = computed(() => (store.state.User.scrollList
        ? store.state.User.scrollList : []));
    }

    /**
     * Show lesson included scrolls
     */
    function showBoth() {
      state.showBoth = true;
      state.showExam = false;
      state.showAll = false;
      state.pageIdx = 0;

      state.images = computed(() => (store.state.User.scrollList
        ? store.state.User.scrollList.filter((obj) => obj.hasLesson)
        : []));
    }

    /**
     * Show exam only scrolls
     */
    function showExam() {
      state.showExam = true;
      state.showBoth = false;
      state.showAll = false;
      state.pageIdx = 0;

      state.images = computed(() => (store.state.User.scrollList
        ? store.state.User.scrollList.filter((obj) => !obj.hasLesson)
        : []));
    }

    onBeforeMount(async () => {
      store.dispatch('User/setFetching', true);

      const scrollsData = await fetchAllMagicScrolls(0);
      store.dispatch('User/setMagicScrolls', scrollsData);
      store.dispatch('User/setFetching', false);
    });

    return {
      state,
      choosing,
      consume,
      showAll,
      showBoth,
      showExam,
      cancelConsume,
      sendConsume,
      showNext,
      showPrevious,
    };
  },
});
</script>

<style scoped lang="scss">
input[type='file'] {
  display: none;
}
.fas {
  color: rgb(92, 92, 92);
  margin-right: 1vw;
}
.upload-pos {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  left: 5vw;
  top: 5vw;
  position: relative;
}
.upload-preview {
  display: inline-block;
  font-family: Poppins;
  font-style: normal;
  font-weight: 900;
  font-size: 1vw;
  white-space: nowrap;
  top: 0.4vw;
  position: relative;
  color: white;
  width: 15vw;
  height: 1.5vw;
  overflow: hidden;
  text-overflow: ellipsis;
}
.custom-file-upload {
  position: relative;
  width: 20vw;
  height: 2vw;
  margin-top: 1vw;
  padding-bottom: 1vw;
  padding-left: 1vw;
  // background: red;

  // display: flex;
  // align-items: center;
  // justify-content: center;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 1vw;
  color: #000000;
  cursor: pointer;

  &.button {
    padding-bottom: 0vw;
    padding: 0.5vw 0.5vw 0.5vw 0.5vw;

    background: rgba(224, 224, 224, 0.6);
    overflow: hidden;
  }
}
.selection {
  top: 3.5vw;
  left: -2vw;
  position: absolute;
  &.item {
    top: 0vw;
    left: -3vw;
  }
  &.owner {
    top: 0vw;
  }
}
.image {
  width: 7.5vw;
  height: 7.5vw;
  position: absolute;
  background: url('../../assets/Spinner-1s-200px.svg') no-repeat center;
  &.no-bg {
    background: unset;
  }
  &.display {
    position: static;
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
  &.click {
    cursor: pointer;
    &:hover {
      opacity: 0.9;
    }
  }
  &.frame {
    width: 8.542vw;
    height: 8.542vw;
    background: url('../../assets/itemFrame_new.png');
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
  &.overlay {
    height: 30vw;
    background: rgba(0, 0, 0, 0.5);
  }
}
.Button {
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

  &.hasPrereq {
    width: 19vw;
    top: 4vw;
    left: 4vw;

    background: linear-gradient(
        180deg,
        rgba(0, 0, 0, 0.25) 0%,
        rgba(255, 255, 255, 0) 100%
      ),
      #3c6e3f;
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

  &.consuming {
    width: 15.938vw;
    top: 18.125vw;
    left: 80vw;
    background: #9002ff;

    &.cancel {
      left: 45.625vw;
      background: #c39b44;
    }
  }

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
    &.add {
      width: 8vw;
      left: 14vw;
      top: 9vw;
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
    &.add {
      width: 8vw;
      left: 23vw;
      top: 9vw;
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
      cursor: wait;
    }
  }

  &.consumed {
    width: 11.615vw;
    top: 30vw;
    left: 20.4vw;
    cursor: unset;

    background: linear-gradient(
        180deg,
        rgba(0, 0, 0, 0.25) 0%,
        rgba(255, 255, 255, 0) 100%
      ),
      #0267ff;
    background-blend-mode: soft-light, normal;
    border-radius: 2vw;
    &.disabled {
      background: linear-gradient(
          180deg,
          rgba(0, 0, 0, 0.25) 0%,
          rgba(255, 255, 255, 0) 100%
        ),
        #a7a7a7;
      cursor: wait;
    }
  }

  &.burned {
    width: 11.615vw;
    top: 30vw;
    left: 20.4vw;
    cursor: unset;

    background: linear-gradient(
        180deg,
        rgba(0, 0, 0, 0.25) 0%,
        rgba(255, 255, 255, 0) 100%
      ),
      #000000;
    background-blend-mode: soft-light, normal;
    border-radius: 2vw;
    &.disabled {
      background: linear-gradient(
          180deg,
          rgba(0, 0, 0, 0.25) 0%,
          rgba(255, 255, 255, 0) 100%
        ),
        #a7a7a7;
      cursor: wait;
    }
  }

  &.inaccessible {
    width: 11.615vw;
    top: 30vw;
    left: 20.4vw;

    background: linear-gradient(
        180deg,
        rgba(0, 0, 0, 0.25) 0%,
        rgba(255, 255, 255, 0) 100%
      ),
      #ff0202;
    background-blend-mode: soft-light, normal;
    cursor: default;
    border-radius: 2vw;
  }

  &.info {
    width: 11.615vw;
    top: 30vw;
    left: 3.5vw;

    background: linear-gradient(
        180deg,
        rgba(0, 0, 0, 0.25) 0%,
        rgba(255, 255, 255, 0) 100%
      ),
      #2f103e;
    background-blend-mode: soft-light, normal;
    border-radius: 2vw;
  }

  &.back {
    width: 11.615vw;
    top: 30vw;
    left: 4vw;
    background: #1b83e2;
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
    left: 2vw;
    top: 33.5vw;
    width: 30vw;
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
    height: 13vw;
    left: 2.3vw;
    top: 13vw;
    font-size: 1.2vw;
    overflow: auto;
    // text-overflow: ellipsis;
    padding-top: 1vw;
    padding-bottom: 1vw;
    background: rgba(0, 12, 44, 0.39);
    display: inline-block;
    text-align: left;
  }

  &.passcode {
    top: 8vw;
    height: 4vw;
    width: 28vw;
    left: 4vw;
    color: rgba(26, 26, 26, 0.6);
    &.label {
      top: 3.5vw;
      left: -3vw;
      color: rgb(255, 255, 255);
    }
    &.instruction {
      font-size: 1vw;

      top: 12vw;
      left: -0.5vw;
      color: rgb(255, 255, 255);
    }
  }

  &.course {
    height: 4vw;
    width: 28vw;
    left: 4vw;
    color: rgba(26, 26, 26, 0.6);

    &.name {
      top: 15vw;
    }
  }
}
</style>
