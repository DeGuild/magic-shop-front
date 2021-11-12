<template>
  <div class="selection" v-bind:class="{ owner: !owner }">
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
        v-on:click="choosing(imageIndex - 1 + state.pageIdx * 8)"
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
      class="Button addScroll"
      v-on:click="addScrollToggle"
      v-if="owner && !state.addScroll"
    >
      Add Scroll
    </button>
    <button
      class="Button addScroll cancel"
      v-if="state.addScroll"
      v-on:click="cancelAdd"
    >
      Cancel
    </button>
    <button
      class="Button previous"
      v-on:click="showPrevious()"
      v-if="state.pageIdx > 0"
    >
      &#60;
    </button>
    <button
      class="Button exam"
      :class="{ disabled: !state.showExam }"
      v-on:click="showExam"
    >
      Exam Only
    </button>
    <button
      class="Button both"
      :class="{ disabled: !state.showBoth }"
      v-on:click="showBoth"
    >
      Both
    </button>
    <button
      class="Button all"
      :class="{ disabled: !state.showAll }"
      v-on:click="showAll"
    >
      All
    </button>
    <button
      class="Button"
      v-on:click="showNext()"
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
            class="Button buy"
            v-on:click="buy()"
            :class="{ disabled: state.buying }"
            :disabled="state.buying"
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
          <div class="Button inaccessible">INACCESSIBLE</div>
          <button class="Button info" v-on:click="moreInfo()">MORE INFO</button>
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
      <button
        class="Button exam add"
        :class="{ disabled: state.addHasLesson }"
        v-on:click="selectExam()"
      >
        Exam Only
      </button>
      <button
        class="Button both add"
        :class="{ disabled: !state.addHasLesson }"
        v-on:click="selectBoth()"
      >
        Both
      </button>

      <button class="Button buy" v-on:click="goNext">NEXT</button>
    </div>
  </div>
  <div class="selection item" v-if="state.nextPage">
    <div class="background item-box">
      <input
        class="text course prereq"
        v-model="state.addPrereq"
        placeholder="Address"
        v-show="state.addHasPrereq"
      />
      <input
        class="text course prereqId"
        v-model="state.addPrereqId"
        placeholder="Id"
        v-show="state.addHasPrereq"
      />
      <textarea
        class="text course desc"
        v-model="state.addDesc"
        :class="{ 'no-prerequisite': !state.addHasPrereq }"
        placeholder="Course Description"
      ></textarea>
      <button
        class="Button hasPrereq"
        v-on:click="selectHasPrereq()"
        v-html="state.primary3"
        :class="{ disabled: !state.addHasPrereq }"
      ></button>
      <button class="Button back" v-on:click="goBack">BACK</button>
      <button
        class="Button buy"
        v-html="state.primary2"
        v-on:click="addScroll"
        :class="{ disabled: state.adding }"
        :disabled="state.adding"
      ></button>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */

import { defineComponent, reactive, computed } from 'vue';
import { useStore } from 'vuex';

const Web3 = require('web3');

const shopAddress = '0xFA0Db8E0f8138A1675507113392839576eD3052c';
const magicScrollABI = require('../../../../DeGuild-MG-CS-Token-contracts/artifacts/contracts/MagicShop/V2/IMagicScrolls+.sol/IMagicScrollsPlus.json').abi;
const skillCertificateABI = require('../../../../DeGuild-MG-CS-Token-contracts/artifacts/contracts/SkillCertificates/V2/ISkillCertificate+.sol/ISkillCertificatePlus.json').abi;
const noUrl = require('@/assets/no-url.jpg');

export default defineComponent({
  name: 'ItemShelf',
  setup() {
    const store = useStore();
    const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');
    const owner = computed(() => store.state.User.owner);

    const state = reactive({
      primary: 'BUY',
      primary2: 'ADD',
      primary3: 'Require prerequisite',
      addScroll: false,
      showBoth: false,
      showExam: false,
      showAll: false,
      nextPage: false,
      addURL: null,
      addName: null,
      addID: null,
      addPrice: null,
      addHasPrereq: false,
      addPrereq: null,
      addPrereqId: null,
      addDesc: null,
      addHasLesson: false,
      buying: false,
      adding: false,
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
      const pattern = new RegExp(
        '^(https?:\\/\\/)?' // protocol
          + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' // domain name
          + '((\\d{1,3}\\.){3}\\d{1,3}))' // OR ip (v4) address
          + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' // port and path
          + '(\\?[;&a-z\\d%_.~+=-]*)?' // query string
          + '(\\#[-a-z\\d_]*)?$',
        'i',
      ); // fragment locator
      return !!pattern.test(str);
    }

    const previewUrl = computed(() => (validURL(state.addURL) ? state.addURL : noUrl));

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
    async function getTokenType(address, prerequisiteId) {
      const certificateManager = new web3.eth.Contract(
        skillCertificateABI,
        address,
      );
      const caller = await certificateManager.methods
        .typeAccepted(prerequisiteId)
        .call();
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
     * Returns the url of the certificate address
     *
     * @param {address} address The certificate's address
     * @return {string} certificate's url.
     */
    async function getTitle(address, tokenType) {
      const imageUrl = await fetch(
        `https://us-central1-deguild-2021.cloudfunctions.net/app/readCertificate/${address}/${tokenType}`,
        { mode: 'cors' },
      );

      const dataUrl = await imageUrl.json();
      // console.log(dataUrl.url);
      return dataUrl.title;
    }

    async function getManagerName(address) {
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
        const prerequisiteTitle = await getTitle(
          state.imageSelected.prerequisite,
          state.imageSelected.prerequisiteId,
        );
        store.dispatch(
          'User/setDialog',
          `You need to earn ${prerequisiteTitle} certificate by ${prerequisite} first!`,
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
      const { prerequisite, prerequisiteId } = state.imageSelected;
      const confirm = await isShopOwnPrerequisite(prerequisite);
      const type = await getTokenType(prerequisite, prerequisiteId);
      // console.log(state.imageSelected);
      console.log(confirm, type, prerequisite);
      if (confirm) {
        await choosing(type);
        store.dispatch(
          'User/setDialog',
          `Please earn the certificate of this scroll, ${state.images[type].name}.`,
        );
      } else {
        const title = await getTitle(prerequisite, prerequisiteId);
        const name = await getManagerName(prerequisite, prerequisiteId);
        store.dispatch('User/setDialog', `${title} by ${name} is required`);
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
      state.buying = true;
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
        state.buying = false;

        return caller;
      } catch (error) {
        state.primary = 'Buy';
        state.buying = false;

        store.dispatch('User/setDialog', 'Transaction rejected!');

        return false;
      }
    }

    function addScrollToggle() {
      state.addScroll = true;
      state.imageSelected = null;
      store.dispatch(
        'User/setDialog',
        'What kind of scroll would you like to add?',
      );
    }
    function selectExam() {
      state.addHasLesson = false;
    }
    function selectBoth() {
      state.addHasLesson = true;
    }
    function selectHasPrereq() {
      state.addHasPrereq = !state.addHasPrereq;
    }
    function goNext() {
      state.nextPage = true;
    }
    function goBack() {
      state.nextPage = false;
    }
    function showNext() {
      state.pageIdx += 1;
      store.dispatch('User/setFetching', true);
      setTimeout(() => store.dispatch('User/setFetching', false), 100);
    }
    function showPrevious() {
      state.pageIdx -= 1;
      store.dispatch('User/setFetching', true);
      setTimeout(() => store.dispatch('User/setFetching', false), 100);
    }
    function cancelAdd() {
      if (!state.adding) {
        store.dispatch('User/setDialog', 'Cancelled! No scroll will be added!');
      }
      state.addURL = null;
      state.addName = null;
      state.addID = null;
      state.addPrice = null;
      state.addPrereq = null;
      state.addPrereqId = null;
      state.addDesc = null;
      state.addScroll = false;
      state.nextPage = false;
    }

    /**
     * Returns whether user is the owner of this shop
     *
     * @param {address} address ethereum address
     * @return {bool} ownership.
     */
    async function addScroll() {
      state.primary2 = "<i class='fas fa-spinner fa-spin'></i>";
      state.adding = true;
      /**
       * TODO: Validate data properly before sending to rinkeby
       * * My suggestion is that we should use vee-validate later
       */
      store.dispatch(
        'User/setDialog',
        'We are processing your transaction! It will take a while.',
      );

      const preRequisite = web3.utils.isAddress(state.addPrereq)
        ? state.addPrereq
        : '0x0000000000000000000000000000000000000000';
      const price = web3.utils.toWei(state.addPrice, 'ether');

      const magicShop = new web3.eth.Contract(magicScrollABI, shopAddress);
      const realAddress = web3.utils.toChecksumAddress(store.state.User.user);

      try {
        const caller = await magicShop.methods
          .addScroll(
            state.addPrereqId,
            preRequisite,
            state.addHasLesson,
            state.addHasPrereq,
            price,
          )
          .send({ from: realAddress });
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: state.addURL,
            address: shopAddress,
            tokenId: caller.events.ScrollAdded.returnValues.scrollID,
            name: state.addName,
            courseId: state.addID,
            description: state.addDesc,
          }),
        };
        await fetch(
          'https://us-central1-deguild-2021.cloudfunctions.net/shop/addMagicScroll',
          requestOptions,
        );

        cancelAdd();
        store.dispatch(
          'User/setDialog',
          'Transaction completed! I will tell the customers about it!',
        );
        state.primary2 = 'Add';
        state.adding = false;

        return caller;
      } catch (error) {
        state.primary2 = 'Add';
        state.adding = false;

        store.dispatch(
          'User/setDialog',
          'Transaction rejected! Have you changed your mind?',
        );
        return false;
      }
    }

    function showAll() {
      state.showAll = true;
      state.showExam = false;
      state.showBoth = false;
      state.pageIdx = 0;

      state.images = computed(() => (store.state.User.scrollList ? store.state.User.scrollList : []));
      store.dispatch('User/setDialog', 'All scrolls are shown.');
    }
    function showBoth() {
      state.showBoth = true;
      state.showExam = false;
      state.showAll = false;
      state.pageIdx = 0;

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
      state.pageIdx = 0;

      state.images = computed(() => (store.state.User.scrollList
        ? store.state.User.scrollList.filter((obj) => !obj.hasLesson)
        : []));
      store.dispatch(
        'User/setDialog',
        'These scrolls let you earn certificate, but you do not get to learn the lessons',
      );
    }

    return {
      state,
      choosing,
      showAll,
      showBoth,
      showExam,
      moreInfo,
      buy,
      addScrollToggle,
      cancelAdd,
      goNext,
      goBack,
      addScroll,
      selectExam,
      selectBoth,
      selectHasPrereq,
      showNext,
      showPrevious,
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

  &.course {
    height: 4vw;
    width: 28vw;
    left: 4vw;
    color: rgba(26, 26, 26, 0.6);

    &.url {
      text-align: center;
      left: 12.5vw;
      top: 4vw;
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
      top: 7vw;
      height: 4vw;
      width: 20vw;
    }

    &.prereqId {
      top: 7vw;
      height: 4vw;
      left: 25vw;

      width: 7vw;
    }

    &.desc {
      text-align: start;
      top: 13vw;
      height: 12vw;

      &.no-prerequisite {
        top: 7vw;
      }
    }
  }
}
</style>
