<template>
  <h1 class="title">Certification Transfer Page (Admin Page)</h1>
  <br />
  <div>
    <span class="panel left">
      <div><h1 class="title text">Download Scroll Transactions</h1></div>
      <div class="selector-box">
        <div>
          <div class="title instruction">Courses</div>
        </div>
        <select class="selector-custom">
          <option v-for="i in 100" :key="i">wtf</option>
        </select>
      </div>
      <div class="selector-box">
        <div>
          <div class="title instruction">Round</div>
        </div>
        <select class="selector-custom">
          <option>wtf</option>
        </select>
      </div>
      <div class="explaination">
        <h2>Instructions</h2>
        <div>
          <div class="explaination-text first">
            1. Download .csv and fill out the ‘Pass’ column of the downloaded
            .csv
          </div>
          <div class="explaination-text second">
            2. Upload .csv and it will be used for minting certificates to the
            users who PASSED.
          </div>
          <div class="explaination-text third">
            3. Accept every transactions. Scrolls will be burned and mint
            certificates.
          </div>
        </div>
      </div>

      <div class="btn download">Download CSV</div>
    </span>
    <span class="panel right">
      <div><h1 class="title text">Preview certificate</h1></div>

      <img src="@/assets/no-url.jpg" />
      <div class="preview" v-for="i in 4" :key="i">
        <div>
          <span class="preview-text">{{i}}:</span
          ><span class="preview-text data">{{i}}</span>
        </div>
      </div>
      <div class="upload-pos">
        <div class="custom-file-upload">
          <label for="scroll-pic-upload" class="custom-file-upload button">
            <span class="fas fa-paperclip"></span>
            <span class="upload-preview"> csv upload</span>
          </label>
        </div>
      </div>
      <div class="btn upload">BATCH MINT</div>
    </span>
  </div>
  <input
    id="scroll-pic-upload"
    @change="previewName($event)"
    type="file"
    accept="image/jpeg"
  />
</template>

<script>
/* eslint-disable no-await-in-loop */

import { useStore } from 'vuex';
// import { useRoute } from 'vue-router';

import { reactive, computed } from 'vue';

const Web3 = require('web3');

/**
 * Using relative path, just clone the git beside this project directory and compile to run
 */
// eslint-disable-next-line no-unused-vars
require('dotenv').config();

const shopAddress = process.env.VUE_APP_SHOP_ADDRESS;
const dgcAddress = process.env.VUE_APP_DGC_ADDRESS;
const dgcABI = require('../../../../DeGuild-MG-CS-Token-contracts/artifacts/contracts/Tokens/DeGuildCoinERC20.sol/DeGuildCoinERC20.json').abi;

export default {
  name: 'AdminPanel',
  setup() {
    const store = useStore();
    // const route = useRoute();

    const user = computed(() => store.state.User.user);

    const state = reactive({
      primary: 'APPROVE',
      network: '',
      magicScrollsData: [],
    });
    const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');

    /**
     * Returns whether user has approved this shop to spend their DGC
     *
     * @param {address} address ethereum address
     * @return {bool} approval.
     */
    async function hasApproval(address) {
      const deguildCoin = new web3.eth.Contract(dgcABI, dgcAddress);
      const realAddress = web3.utils.toChecksumAddress(address);
      try {
        const balance = await deguildCoin.methods.balanceOf(realAddress).call();
        const caller = await deguildCoin.methods
          .allowance(realAddress, shopAddress)
          .call();
        return caller <= balance && caller > 0;
      } catch (error) {
        return false;
      }
    }

    /**
     * Returns whether user is the owner of this shop
     *
     * @param {address} address ethereum address
     * @return {bool} ownership.
     */
    async function approve() {
      state.primary = "<i class='fas fa-spinner fa-spin'></i>";

      const deguildCoin = new web3.eth.Contract(dgcABI, dgcAddress);
      const realAddress = web3.utils.toChecksumAddress(store.state.User.user);
      try {
        const balance = await deguildCoin.methods.balanceOf(realAddress).call();
        const caller = await deguildCoin.methods
          .approve(shopAddress, balance)
          .send({ from: realAddress });
        console.log(caller);
        const approval = await hasApproval(realAddress);
        store.dispatch('User/setApproval', approval);

        return approval;
      } catch (error) {
        return false;
      }
    }

    return {
      state,
      user,
      approve,
    };
  },
};
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
  justify-content: center;
  align-items: center;
  width: 40vw;
  height: 5vw;
  bottom: 6vw;
  left: 4.4vw;
  position: absolute;
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
  color: black;
  width: 20vw;
  height: 1.5vw;
  overflow: hidden;
  text-overflow: ellipsis;
}
.custom-file-upload {
  position: relative;
  width: 25vw;
  height: 2vw;
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
.panel {
  position: absolute;
  top: 10vw;
  height: 38vw;
  width: 46.8vw;

  background: rgba(175, 175, 175, 0.9);

  &.right {
    right: 3vw;
  }
  &.left {
    left: 3vw;
  }
}
.btn {
  /* Small button */

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  position: absolute;
  width: 25vw;
  height: 3vw;
  bottom: 3vw;

  /* standart theme/error */
  background: #ff7a52;
  border-radius: 4px;

  font-family: Secular One;
  font-style: normal;
  font-weight: normal;
  font-size: 2vw;
  display: flex;
  align-items: center;
  letter-spacing: 0.00892857em;
  text-transform: uppercase;

  /* shades/white */
  color: #ffffff;

  /* Inside Auto Layout */
  flex: none;
  order: 0;
  flex-grow: 0;
  margin: 0px 0px;

  &:hover {
    background: #ff6e42;
  }

  &.download {
    left: 11vw;
    bottom: 17vw;
  }
  &.upload {
    right: 10vw;
  }
}
.title {
  display: inline-block;
  justify-content: center;
  align-items: center;
  background: grey;
  width: 94vw;
  font-size: 3vw;
  font-family: Poppins;

  color: white;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000,
    1px 1px 0 #000;
  &.text {
    width: 36vw;
    font-size: 2vw;
  }
  &.instruction {
    width: 36vw;
    font-size: 1.5vw;
  }
}
.preview {
  padding-top: 0vw;
  position: relative;
  justify-content: center;
  align-items: center;
  background: whitesmoke;
  width: 43vw;
  left: 2vw;
  top: 1vw;
  height: 2.5vw;
  font-size: 1.1vw;
  font-family: Poppins;

  color: black;
}
.preview-text {
  position: absolute;
  margin: 0.6vw 0.6vw 0.6vw 0.6vw;
  font-weight: 900;
  left: 0vw;
  &.data {
    display: inline-block;
    left: 6vw;
  }
}
.explaination {
  position: absolute;
  justify-content: center;
  align-items: center;
  background: grey;
  width: 43vw;
  left: 2vw;
  height: 13vw;
  bottom: 2vw;
  font-size: 1.1vw;
  font-family: Poppins;

  color: white;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000,
    1px 1px 0 #000;
}
.explaination-text {
  display: flex;
  flex-direction: column;
  left: 1vw;
  font-size: 1vw;
  position: absolute;
  &.first {
    top: 4.5vw;
  }
  &.second {
    top: 6.5vw;
  }
  &.third {
    top: 8.5vw;
  }
}
.selector-custom {
  width: 36vw;
  height: 2vw;
  font-family: Poppins;
  font-size: 1vw;
}
.selector-box {
  margin: 0.5vw 0.5vw 0.5vw 0.5vw;
}
</style>
