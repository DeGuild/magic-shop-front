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
      class="Button addScroll"
      v-on:click="state.loading ? null : addScrollToggle()"
      v-if="owner && !state.addScroll"
    >
      Add Scroll
    </button>
    <button
      class="Button addScroll cancel"
      v-if="state.addScroll"
      v-on:click="state.loading ? null : cancelAdd()"
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
            v-on:click="state.loading ? null : buy()"
            :class="{ disabled: state.buying }"
            :disabled="state.buying"
            v-html="state.buyButton"
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
          <button
            class="Button info"
            v-on:click="state.loading ? null : moreInfo()"
          >
            MORE INFO
          </button>
          <div class="text price">{{ state.imageSelected.price }} DGT</div>
        </div>
      </div>
    </div>
  </div>

  <!-- For adding -->
  <div class="selection item" v-if="state.addScroll">
    <div class="background item-box">
      <div class="background current-item-frame" />
      <div class="image selected">
        <img class="image selected display" :src="scrollToAdd.picture" />
      </div>
      <div class="upload-pos">
        <div class="custom-file-upload">
          <label for="scroll-pic-upload" class="custom-file-upload button">
            <i class="fas fa-paperclip"></i>
            <span class="upload-preview">{{ scrollToAdd.fileName }}</span>
          </label>
        </div>
      </div>
      <input
        class="text course name"
        v-model="scrollToAdd.name"
        placeholder="Course Name"
      />
      <input
        class="text course id"
        v-model="scrollToAdd.id"
        placeholder="Course ID"
      />
      <input
        class="text course set-price"
        v-model="scrollToAdd.price"
        placeholder="Price"
        type="number"
        min="0"
        oninput="validity.valid||(value='');"
      />
      <button
        class="Button exam add"
        :class="{ disabled: scrollToAdd.hasLesson }"
        @click="state.loading ? null : selectExam()"
      >
        Exam Only
      </button>
      <button
        class="Button both add"
        :class="{ disabled: !scrollToAdd.hasLesson }"
        @click="state.loading ? null : selectBoth()"
      >
        Both
      </button>

      <button
        class="Button buy"
        :class="{
          disabled:
            !scrollToAdd.name ||
            !scrollToAdd.id ||
            !scrollToAdd.price ||
            !scrollToAdd.imageData,
        }"
        @click="goNext"
        :disabled="
          !scrollToAdd.name ||
          !scrollToAdd.id ||
          !scrollToAdd.price ||
          !scrollToAdd.imageData
        "
      >
        NEXT
      </button>
    </div>
  </div>
  <div class="selection item" v-if="state.nextPage && state.addScroll">
    <div class="background item-box">
      <input
        class="text course prereq"
        v-model="scrollToAdd.prereq"
        placeholder="Address"
        v-show="scrollToAdd.hasPrereq"
      />
      <input
        class="text course prereqId"
        v-model="scrollToAdd.prereqId"
        placeholder="Id"
        v-show="scrollToAdd.hasPrereq"
      />
      <textarea
        class="text course desc"
        v-model="scrollToAdd.desc"
        :class="{ 'no-prerequisite': !scrollToAdd.hasPrereq }"
        placeholder="Course Description"
      ></textarea>
      <button
        class="Button hasPrereq"
        @click="state.loading ? null : selectHasPrereq()"
        v-html="scrollToAdd.hasPrereqButton"
        :class="{ disabled: !scrollToAdd.hasPrereq }"
      ></button>
      <button class="Button back" @click="goBack">BACK</button>
      <button
        class="Button buy"
        v-html="scrollToAdd.addButton"
        @click="state.loading || !scrollToAdd.desc ? null : addScroll()"
        :class="{ disabled: scrollToAdd.adding || !scrollToAdd.desc }"
        :disabled="scrollToAdd.adding"
      ></button>
    </div>
  </div>

  <input
    id="scroll-pic-upload"
    @change="previewName($event)"
    type="file"
    accept="image/jpeg"
  />
</template>

<script>
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */

import { defineComponent, reactive, computed } from 'vue';
import { useStore } from 'vuex';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import Web3Token from 'web3-token';

const Web3 = require('web3');

// const shopAddress = '0xFA0Db8E0f8138A1675507113392839576eD3052c';
const magicScrollABI = require('../../../../DeGuild-MG-CS-Token-contracts/artifacts/contracts/MagicShop/V2/IMagicScrolls+.sol/IMagicScrollsPlus.json').abi;
const skillCertificateABI = require('../../../../DeGuild-MG-CS-Token-contracts/artifacts/contracts/SkillCertificates/V2/ISkillCertificate+.sol/ISkillCertificatePlus.json').abi;
require('dotenv').config();

const shopAddress = process.env.VUE_APP_SHOP_ADDRESS;
const noImg = require('@/assets/no-url.jpg');

export default defineComponent({
  name: 'ItemShelf',
  setup() {
    const store = useStore();
    const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');
    const owner = computed(() => store.state.User.owner);

    const state = reactive({
      buyButton: 'BUY',
      addScroll: false,
      showBoth: false,
      showExam: false,
      showAll: false,
      nextPage: false,
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
      imageSelected: null,
    });
    const scrollToAdd = reactive({
      imageData: null,
      fileName: 'Click to upload image',
      picture: noImg,
      addButton: 'ADD',
      hasPrereqButton: 'Require prerequisite',
      name: null,
      id: null,
      price: null,
      hasLesson: false,
      hasPrereq: false,
      prereq: null,
      prereqId: null,
      desc: null,
    });

    function previewName(event) {
      // console.log('File changed!');
      const file = event.target.files[0];
      console.log(file);
      scrollToAdd.imageData = file;
      scrollToAdd.fileName = file.name;

      const previewing = URL.createObjectURL(event.target.files[0]);
      scrollToAdd.picture = previewing;
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
        const prerequisiteTitle = await getTitle(
          state.imageSelected.prerequisite,
          state.imageSelected.prerequisiteId,
        );
        store.dispatch(
          'User/setDialog',
          `You need to earn ${prerequisiteTitle} certificate first!`,
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
      state.buyButton = "<i class='fas fa-spinner fa-spin'></i>";
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
        state.buyButton = 'Buy';
        await choosing(tokenId);
        store.dispatch(
          'User/setDialog',
          'Transaction completed! Thank you for doing business with us~',
        );
        state.buying = false;

        return caller;
      } catch (error) {
        state.buyButton = 'Buy';
        state.buying = false;

        store.dispatch('User/setDialog', 'Transaction rejected!');

        return false;
      }
    }

    function addScrollToggle() {
      state.addScroll = true;
      store.dispatch(
        'User/setDialog',
        'What kind of scroll would you like to add?',
      );
    }
    function selectExam() {
      scrollToAdd.hasLesson = false;
    }
    function selectBoth() {
      scrollToAdd.hasLesson = true;
    }
    function selectHasPrereq() {
      scrollToAdd.hasPrereq = !scrollToAdd.hasPrereq;
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
      state.addScroll = false;
    }

    async function addScroll() {
      store.dispatch('User/setFetching', true);
      scrollToAdd.addButton = "<i class='fas fa-spinner fa-spin'></i>";
      state.adding = true;

      store.dispatch(
        'User/setDialog',
        'We are processing your transaction! It will take a while.',
      );
      try {
        const realAddress = web3.utils.toChecksumAddress(store.state.User.user);
        const magicShop = new web3.eth.Contract(magicScrollABI, shopAddress);
        const preRequisite = web3.utils.isAddress(scrollToAdd.prereq)
          ? scrollToAdd.prereq
          : '0x0000000000000000000000000000000000000000';
        const price = web3.utils.toWei(scrollToAdd.price.toString(), 'ether');
        const currentType = await magicShop.methods
          .numberOfScrollTypes()
          .call();
        // generating a token with 1 day of expiration time
        const token = await Web3Token.sign(
          (msg) => web3.eth.personal.sign(msg, realAddress),
          '1d',
        );
        const storage = getStorage();
        const storageRef = ref(storage, `images/${shopAddress}/${currentType}`);

        const uploadTask = uploadBytesResumable(
          storageRef,
          scrollToAdd.imageData,
        );
        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // console.log(`Upload is ${progress}% done`);
            // eslint-disable-next-line default-case
            switch (snapshot.state) {
              case 'paused':
                // console.log('Upload is paused');
                break;
              case 'running':
                // console.log('Upload is running');
                break;
            }
          },
          (error) => {
            // Handle unsuccessful uploads
            console.error(error.message);
            store.dispatch('User/setFetching', false);
          },
          async () => {
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                try {
                  console.log('File available at', downloadURL);
                  scrollToAdd.picture = downloadURL;
                  const transaction = await magicShop.methods
                    .addScroll(
                      scrollToAdd.prereqId ? scrollToAdd.prereqId : '0',
                      preRequisite,
                      scrollToAdd.hasLesson,
                      scrollToAdd.hasPrereq,
                      price,
                    )
                    .send({ from: realAddress });

                  console.log(transaction);

                  const requestOptions = {
                    method: 'POST',
                    headers: {
                      Authorization: token,
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      url: downloadURL,
                      address: shopAddress,
                      tokenId: currentType.toString(),
                      name: scrollToAdd.name,
                      courseId: scrollToAdd.id,
                      description: scrollToAdd.desc,
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
                  scrollToAdd.addButton = 'Add';
                  state.adding = false;

                  store.dispatch(
                    'User/setDialog',
                    'Alright, we will change that for you!',
                  );
                  store.dispatch('User/setFetching', false);
                  window.location.reload();

                  return transaction;
                } catch (error) {
                  scrollToAdd.addButton = 'Add';
                  state.adding = false;
                  store.dispatch('User/setFetching', false);

                  store.dispatch(
                    'User/setDialog',
                    'Transaction rejected! Have you changed your mind?',
                  );
                  return null;
                }
              },
            );
          },
        );
      } catch (error) {
        console.log(error);
        scrollToAdd.addButton = 'Add';
        state.adding = false;
        store.dispatch('User/setFetching', false);

        store.dispatch(
          'User/setDialog',
          'Transaction rejected! Have you changed your mind?',
        );
      }
      return false;
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
      previewName,
      owner,
      scrollToAdd,
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
