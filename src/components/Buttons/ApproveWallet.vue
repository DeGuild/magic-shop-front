<template>
  <div v-if="user">
    <button class="btn" @click="approve" v-html="state.primary"></button>
  </div>
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
  name: 'ApproveWallet',
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
.btn {
  /* Small button */

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  position: absolute;
  width: 25vw;
  height: 10vw;
  left: 38.4vw;
  top: 20vw;

  /* standart theme/error */
  background: #ff7a52;
  border-radius: 4px;

  font-family: Secular One;
  font-style: normal;
  font-weight: normal;
  font-size: 3vw;
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
  &.connected {
    &:hover {
      background: unset;
    }
    cursor: cursor;
  }
}
</style>
