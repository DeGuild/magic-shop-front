<template>
  <div v-if="!user">
    <button class="connect-button" @click="ethEnabled">
      <div v-html="state.primary"></div>
    </button>
  </div>
  <div v-if="user">
    <div class="connect-button connected" v-html="state.primary"></div>
  </div>
</template>

<script>
/* eslint-disable no-await-in-loop */

import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';

import { reactive, onBeforeMount, computed } from 'vue';

const Web3 = require('web3');

/**
 * Using relative path, just clone the git beside this project directory and compile to run
 */
// eslint-disable-next-line no-unused-vars
require('dotenv').config();

const shopAddress = process.env.VUE_APP_SHOP_ADDRESS;
const dgcAddress = process.env.VUE_APP_DGC_ADDRESS;
const dgcABI = require('../../../../DeGuild-MG-CS-Token-contracts/artifacts/contracts/Tokens/DeGuildCoinERC20.sol/DeGuildCoinERC20.json').abi;
const ownerABI = require('../../../../DeGuild-MG-CS-Token-contracts/artifacts/@openzeppelin/contracts/access/Ownable.sol/Ownable.json').abi;
// DeGuild-MG-CS-Token-contracts/artifacts/@openzeppelin/contracts/access/Ownable.sol/Ownable.json
export default {
  name: 'ConnectWallet',
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const user = computed(() => store.state.User.user);
    function shortenedAddress(address) {
      if (!address) {
        return "<i class='fas fa-spinner fa-spin'></i>";
      }
      const accountLength = address.length;
      const connectedAddress = `${address.substring(
        0,
        5,
      )}...${address.substring(accountLength - 4, accountLength)}`;
      return connectedAddress;
    }

    const state = reactive({
      primary: computed(() => (store.state.User.fetching || store.state.User.user
        ? shortenedAddress(store.state.User.user)
        : 'CONNECT WALLET')),
      network: '',
      magicScrollsData: [],
    });
    const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');

    /**
     * Returns whether user is the owner of this shop
     *
     * @param {address} address ethereum address
     * @return {bool} ownership.
     */
    async function isOwner(address) {
      const magicShop = new web3.eth.Contract(ownerABI, shopAddress);
      const realAddress = web3.utils.toChecksumAddress(address);
      try {
        const caller = await magicShop.methods.owner().call();
        return caller === realAddress;
      } catch (error) {
        // console.error('Not purchasable');
        return false;
      }
    }

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
        return (caller <= balance && caller > 0) || (balance === '0');
      } catch (error) {
        return false;
      }
    }

    /**
     * Returns whether user has approved this shop to spend their DGC
     *
     * @param {address} address ethereum address
     * @return {bool} approval.
     */
    async function checkBalance(address) {
      const deguildCoin = new web3.eth.Contract(dgcABI, dgcAddress);
      const realAddress = web3.utils.toChecksumAddress(address);
      try {
        const balance = await deguildCoin.methods.balanceOf(realAddress).call();
        return web3.utils.fromWei(balance, 'ether');
      } catch (error) {
        return false;
      }
    }

    /**
     * Returns verification of the Rinkeby Network
     *
     * @param {address} address The address of any contract using the interface given
     * @return {bool} status of verification.
     */
    async function verifyNetwork() {
      state.network = await web3.eth.net.getNetworkType();

      if (state.network !== 'rinkeby') {
        return false;
      }
      return true;
    }

    /**
     * Connect to the Rinkeby Network
     */
    async function connectToRinkeby() {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x4' }],
      });
    }

    /**
     * Disconnect user from the dapp
     */
    function disconnected() {
      store.dispatch('User/setUser', null);
    }

    /**
     * Connect user to the dapp
     * @return {bool} status of connection.
     */
    async function connectWallet() {
      store.dispatch('User/reset');

      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
          });
          const ownership = await isOwner(accounts[0]);
          const balance = await checkBalance(accounts[0]);
          const approve = await hasApproval(accounts[0]);

          if (route.name === 'admin' && !ownership) {
            router.push('/');
          }
          if (route.name === 'manager' && !ownership) {
            router.push('/');
          }

          store.dispatch(
            'User/setUser',
            web3.utils.toChecksumAddress(accounts[0]),
          );
          store.dispatch('User/setDeguildCoin', balance);
          store.dispatch('User/setOwner', ownership);
          store.dispatch(
            'User/setDialog',
            'Please wait and I will show you what we have gotten!',
          );
          store.dispatch('User/setFetching', true);

          // console.log(balance);
          store.dispatch('User/setApproval', approve);
          if (!approve) {
            store.dispatch(
              'User/setDialog',
              'Seems like you have not approved your walllet.',
            );
          }
          store.dispatch('User/setFetching', false);
          // console.log(store.state.User.scrollList);
          store.dispatch(
            'User/setDialog',
            'Great! So, what would you like to buy?',
          );

          return true;
        } catch (error) {
          // console.log(error);
        }
      } else {
        router.push('/no-provider');
      }
      return false;
    }

    /**
     * Handle what we do when the user changed the network
     */
    function handleChainChanged() {
      // We recommend reloading the page, unless you must do otherwise
      window.location.reload();
    }

    /**
     * Returns the information of the certificate of this user
     * @dev For now, 'eth_accounts' will continue to always return an array
     *
     * @param {address} address The addresses of connect wallets
     */
    function handleAccountsChanged(accounts) {
      const current = accounts[0];
      if (accounts.length === 0) {
        disconnected();
      } else if (current !== store.state.User.user) {
        connectWallet();
      }
    }

    /**
     * Connect to the Ethereum network
     */
    async function ethEnabled() {
      if (state.network !== 'rinkeby') {
        await connectToRinkeby();
        return false;
      }
      await connectWallet();
      return true;
    }

    onBeforeMount(async () => {
      await verifyNetwork();

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    });

    return {
      state,
      user,
      ethEnabled,
    };
  },
};
</script>

<style scoped lang="scss">
.connect-button {
  /* Small button */

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  position: fixed;
  width: 10vw;
  height: 3vw;
  left: 88vw;
  top: 0.7vw;

  /* standart theme/error */
  background: #ff5252;
  border-radius: 4px;

  font-family: Secular One;
  font-style: normal;
  font-weight: normal;
  font-size: 0.7vw;
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
    background: #cc3b3b;
  }
  &.connected {
    &:hover {
      background: #ff5252;
    }
    cursor: cursor;
  }
}
</style>
