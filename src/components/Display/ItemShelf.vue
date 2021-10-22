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
      <div
        class="image"
        :style="state.styles[imageIndex]"
        v-if="state.images[imageIndex - 1]"
      >
        <img
          class="image display click"
          :style="state.styles[imageIndex]"
          :src="state.images[imageIndex - 1].url"
          v-on:click="choosing(imageIndex - 1)"
        />
      </div>
    </div>
    <button
      class="navButton addScroll"
      v-on:click="addScroll"
      v-if="owner && !state.addScroll"
    >
      Add Scroll
    </button>
    <button
      class="navButton addScroll cancel"
      v-if="state.addScroll"
      v-on:click="cancelAdd"
    >
      Cancel
    </button>
    <button
      class="navButton previous"
      v-on:click="dummy()"
      v-if="state.pageIdx > 0"
    >
      &#60;
    </button>
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
    <button
      class="navButton"
      v-on:click="dummy()"
      v-if="state.pageIdx < state.images.length / 8 - 1"
    >
      &#62;
    </button>
    <div class="background overlay" v-if="state.addScroll"></div>
  </div>

  <div class="selection item">
    <div class="background item-box">
      <div class="background current-item-frame" />
      <div v-if="state.imageSelected">
        <div v-if="state.imageSelected.purchasable">
          <div class="image selected">
            <img
              class="image selected display"
              :src="state.imageSelected.url"
            />
          </div>
          <div class="text">{{ state.imageSelected.name }}</div>
          <div class="text own">Owned: {{ state.own }}</div>
          <div class="text description">
            {{ state.imageSelected.description }}
          </div>
          <button
            class="navButton buy"
            v-on:click="buy()"
            v-html="state.primary"
          ></button>
          <div class="text price">{{ state.imageSelected.price }} DGT</div>
        </div>
        <div v-if="!state.imageSelected.purchasable">
          <div class="image selected">
            <img
              class="image selected display"
              :src="state.imageSelected.url"
            />
          </div>
          <div class="text">{{ state.imageSelected.name }}</div>
          <div class="text own">Owned: {{ state.own }}</div>
          <div class="text description">
            {{ state.imageSelected.description }}
          </div>
          <div class="navButton inaccessible">INACCESSIBLE</div>
          <button class="navButton info" v-on:click="moreInfo()">
            MORE INFO
          </button>
          <div class="text price">{{ state.imageSelected.price }} DGT</div>
        </div>
      </div>
    </div>
  </div>
  <div class="selection item" v-if="state.addScroll">
    <div class="background item-box">
      <div class="background current-item-frame" />
      <div class="image selected">
        <img class="image selected display" :src="previewUrl" />
      </div>
      <input
        class="text course url"
        v-model="state.addURL"
        placeholder="Picture URL"
      />
      <input
        class="text course name"
        v-model="state.addName"
        placeholder="Course Name"
      />
      <input
        class="text course id"
        v-model="state.addID"
        placeholder="Course ID"
      />
      <input
        class="text course set-price"
        v-model="state.addPrice"
        placeholder="Price"
      />
      <button class="navButton buy" v-on:click="goNext">NEXT</button>
    </div>
  </div>
  <div class="selection item" v-if="state.nextPage">
    <div class="background item-box">
      <input
        class="text course prereq"
        v-model="state.addPrereq"
        placeholder="Course Prerequisite"
      />
      <textarea
        class="text course desc"
        v-model="state.addDesc"
        placeholder="Course Description"
      ></textarea>
      <button class="navButton back" v-on:click="goBack">BACK</button>
      <button class="navButton buy">ADD</button>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */

import { defineComponent, reactive, computed } from 'vue';
import { useStore } from 'vuex';

const Web3 = require('web3');

const shopAddress = '0x1B362371f11cAA26B1A993f7Ffd711c0B9966f70';
// const dgcAddress = '0x4312D992940D0b110525f553160c9984b77D1EF4';
// const dgcABI = require('../../../../DeGuild-MG-CS-Token-contracts/artifacts/contracts/Tokens/DeGuildCoinERC20.sol/DeGuildCoinERC20.json').abi;
const magicScrollABI = require('../../../../DeGuild-MG-CS-Token-contracts/artifacts/contracts/MagicShop/IMagicScrolls.sol/IMagicScrolls.json').abi;
const skillCertificateABI = require('../../../../DeGuild-MG-CS-Token-contracts/artifacts/contracts/SkillCertificates/ISkillCertificate.sol/ISkillCertificate.json').abi;
const noUrl = require('@/assets/no-url.jpg');

export default defineComponent({
  name: 'ItemShelf',
  setup() {
    const store = useStore();
    const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');
    const owner = computed(() => store.state.User.owner);

    const state = reactive({
      primary: 'BUY',
      addScroll: false,
      showBoth: true,
      showExam: false,
      showAll: false,
      nextPage: false,
      addURL: null,
      addName: null,
      addID: null,
      addPrice: null,
      addPrereq: null,
      addDesc: null,
      scrollSelected: computed(() => (store.state.User.selectedScroll ? store.state.User.selectedScroll : null)),
      loading: computed(() => store.state.User.fetching),
      pageIdx: 0,
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
    });

    function validURL(str) {
      const pattern = new RegExp('^(https?:\\/\\/)?' // protocol
    + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' // domain name
    + '((\\d{1,3}\\.){3}\\d{1,3}))' // OR ip (v4) address
    + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' // port and path
    + '(\\?[;&a-z\\d%_.~+=-]*)?' // query string
    + '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
      return !!pattern.test(str);
    }

    const previewUrl = computed(() => (validURL(state.addURL)
      ? state.addURL
      : noUrl));

    function dummy() {
      console.log('Calling the dummy function');
      console.log(store.state.User.scrollList);
    }

    /**
     * Returns name of the address.
     *
     * @param {address} address The address of any contract using the interface given
     * @return {string} name of the contract.
     */
    async function getName(address) {
      const certificateManager = new web3.eth.Contract(
        skillCertificateABI,
        address,
      );
      const caller = await certificateManager.methods.name().call();
      return caller;
    }

    /**
     * Returns name of the address.
     *
     * @param {address} address The address of any contract using the interface given
     * @return {string} name of the contract.
     */
    async function getTokenType(address) {
      const certificateManager = new web3.eth.Contract(
        skillCertificateABI,
        address,
      );
      const caller = await certificateManager.methods.typeAccepted().call();
      return caller;
    }

    /**
     * Returns whether user is the owner of this shop
     *
     * @param {address} address ethereum address
     * @return {bool} ownership.
     */
    async function getBalanceOf(imageSelected) {
      const magicShop = new web3.eth.Contract(magicScrollABI, shopAddress);
      const realAddress = web3.utils.toChecksumAddress(store.state.User.user);

      try {
        const caller = await magicShop.methods
          .balanceOfOne(realAddress, imageSelected.tokenId)
          .call();
        // console.log(caller);
        return caller;
      } catch (error) {
        // console.error('Not purchasable');
        return {};
      }
    }

    /**
     * Returns name of the address.
     *
     * @param {address} address The address of any contract using the interface given
     * @return {string} name of the contract.
     */
    async function isShopOwnPrerequisite(address) {
      const certificateManager = new web3.eth.Contract(
        skillCertificateABI,
        address,
      );
      const caller = await certificateManager.methods.shop().call();
      return caller === shopAddress;
    }

    /**
     * Returns whether user is the owner of this shop
     *
     * @param {address} address ethereum address
     * @return {bool} ownership.
     */
    async function choosing(imageIdx) {
      state.imageSelected = state.images[imageIdx];
      // console.log(state.imageSelected);
      store.dispatch(
        'User/setDialog',
        'Counting your owned scrolls for this one...',
      );
      state.own = '...';
      state.own = await getBalanceOf(state.imageSelected);

      if (state.imageSelected.purchasable) {
        store.dispatch('User/setDialog', 'Would you like to buy more?');
      } else {
        const prerequisite = await getName(state.imageSelected.prerequisite);
        store.dispatch(
          'User/setDialog',
          `You need to earn ${prerequisite} certificate first!`,
        );
      }
    }

    /**
     * Returns whether user is the owner of this shop
     *
     * @param {address} address ethereum address
     * @return {bool} ownership.
     */
    async function moreInfo() {
      const { prerequisite } = state.imageSelected;
      const confirm = await isShopOwnPrerequisite(prerequisite);
      const type = await getTokenType(prerequisite);
      // console.log(confirm, type, prerequisite);
      if (confirm) {
        await choosing(type);
        store.dispatch(
          'User/setDialog',
          `Please earn the certificate of this scroll, ${state.images[type].name}.`,
        );
      } else {
        store.dispatch(
          'User/setDialog',
          `You are not verified by ${prerequisite}`,
        );
      }
    }

    /**
     * Returns whether user is the owner of this shop
     *
     * @param {address} address ethereum address
     * @return {bool} ownership.
     */
    async function buy() {
      state.primary = "<i class='fas fa-spinner fa-spin'></i>";
      store.dispatch(
        'User/setDialog',
        'We are processing your transaction! It will take a while.',
      );

      const magicShop = new web3.eth.Contract(magicScrollABI, shopAddress);
      const realAddress = web3.utils.toChecksumAddress(store.state.User.user);
      const { tokenId } = state.imageSelected;
      try {
        const caller = await magicShop.methods
          .buyScroll(tokenId)
          .send({ from: realAddress });
        state.primary = 'Buy';
        await choosing(tokenId);
        store.dispatch(
          'User/setDialog',
          'Transaction completed! Thank you for doing business with us~',
        );

        return caller;
      } catch (error) {
        return false;
      }
    }

    function showAll() {
      state.showAll = true;
      state.showExam = false;
      state.showBoth = false;
      state.images = computed(() => (store.state.User.scrollList ? store.state.User.scrollList : []));
      store.dispatch('User/setDialog', 'All scrolls are shown.');
    }
    function showBoth() {
      state.showBoth = true;
      state.showExam = false;
      state.showAll = false;
      state.images = computed(() => (store.state.User.scrollList
        ? store.state.User.scrollList.filter((obj) => obj.hasLesson)
        : []));
      store.dispatch(
        'User/setDialog',
        'These scrolls will teach you skills and let you earn certificate.',
      );
    }
    function showExam() {
      state.showExam = true;
      state.showBoth = false;
      state.showAll = false;
      state.images = computed(() => (store.state.User.scrollList
        ? store.state.User.scrollList.filter((obj) => !obj.hasLesson)
        : []));
      store.dispatch(
        'User/setDialog',
        'These scrolls let you earn certificate, but you do not get to learn the lessons',
      );
    }
    function addScroll() {
      state.addScroll = true;
      state.imageSelected = null;
    }
    function cancelAdd() {
      state.addURL = null;
      state.addName = null;
      state.addID = null;
      state.addPrice = null;
      state.addPrereq = null;
      state.addDesc = null;
      state.addScroll = false;
      state.nextPage = false;
    }
    function goNext() {
      state.nextPage = true;
    }
    function goBack() {
      state.nextPage = false;
    }

    return {
      state,
      dummy,
      choosing,
      showAll,
      showBoth,
      showExam,
      moreInfo,
      buy,
      addScroll,
      cancelAdd,
      goNext,
      goBack,
      owner,
      previewUrl,
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
  &.overlay {
    height: 30vw;
    background: rgba(0, 0, 0, 0.5);
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

  &.addScroll {
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
    height: 15vw;
    left: 2.3vw;
    top: 14vw;
    font-size: 1.1vw;
  }

  &.course {
    height: 4vw;
    width: 28vw;
    left: 4vw;
    color: rgba(26, 26, 26, 0.6);

    &.url {
      text-align: center;
      left: 12.5vw;
      top: 6vw;
      width: 19.5vw;
    }

    &.name {
      top: 15vw;
    }

    &.id {
      top: 22vw;
    }

    &.set-price {
      height: 3vw;
      width: 11vw;
      top: 30vw;
    }

    &.prereq {
      top: 6vw;
      height: 4vw;
    }

    &.desc {
      text-align: start;
      top: 13vw;
      height: 12vw;
    }
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
