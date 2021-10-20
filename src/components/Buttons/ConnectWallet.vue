<template>
  <div v-if="!user">
    <button class="btn" @click="ethEnabled" v-html="state.primary"></button>
  </div>
  <div v-if="user">
    <div class="btn connected" v-html="state.primary"></div>
  </div>
</template>

<script>
/* eslint-disable no-await-in-loop */

import { useStore } from 'vuex';
// import { useRoute } from 'vue-router';

import { reactive, onBeforeMount, computed } from 'vue';

const Web3 = require('web3');

/**
 * Using relative path, just clone the git beside this project directory and compile to run
 */
// eslint-disable-next-line no-unused-vars
const shopAddress = '0x1B362371f11cAA26B1A993f7Ffd711c0B9966f70';

const dgcAddress = '0x4312D992940D0b110525f553160c9984b77D1EF4';
const dgcABI = require('../../../../DeGuild-MG-CS-Token-contracts/artifacts/contracts/Tokens/DeGuildCoinERC20.sol/DeGuildCoinERC20.json').abi;
const magicScrollABI = require('../../../../DeGuild-MG-CS-Token-contracts/artifacts/contracts/MagicShop/IMagicScrolls.sol/IMagicScrolls.json').abi;
const ownerABI = require('../../../../DeGuild-MG-CS-Token-contracts/artifacts/@openzeppelin/contracts/access/Ownable.sol/Ownable.json').abi;
// DeGuild-MG-CS-Token-contracts/artifacts/@openzeppelin/contracts/access/Ownable.sol/Ownable.json
export default {
  name: 'ConnectWallet',
  setup() {
    const store = useStore();
    // const route = useRoute();

    const user = computed(() => store.state.User.user);

    const state = reactive({
      primary: 'SOMETHING WENT WRONG',
      network: '',
      magicScrollsData: [],
    });
    const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');

    /**
     * Returns all magic scrolls in the DeGuild system.
     *
     * @param {address} nextToFetch The address we lastly fetched
     * @return {address[]} all certificates in the DeGuild system.
     */
    async function fetchAllMagicScrolls(nextToFetch) {
      // console.log(nextToFetch);
      let response = null;
      if (nextToFetch) {
        response = await fetch(
          `https://us-central1-deguild-2021.cloudfunctions.net/shop/allMagicScrolls/${shopAddress}/next/${nextToFetch}`,
          { mode: 'cors' },
        );
      } else {
        response = await fetch(
          `https://us-central1-deguild-2021.cloudfunctions.net/shop/allMagicScrolls/${shopAddress}`,
          { mode: 'cors' },
        );
      }

      const magicScrolls = await response.json();
      // eslint-disable-next-line max-len
      const sortedById = magicScrolls.sort((a, b) => (parseInt(a.tokenId, 10) > parseInt(b.tokenId, 10) ? 1 : -1));
      // console.log(sortedById);

      const next = sortedById.length > 0
        ? sortedById[sortedById.length - 1].tokenId
        : null;
      // console.log(next);
      store.dispatch('User/setMagicScrollToFetch', next);
      // console.log(magicScrolls);
      // console.log(next);
      return magicScrolls;
    }

    /**
     * Returns data of the token.
     *
     * @param {int} tokenId The address of any contract using the interface given
     * @return {object} token object that looks like this
     * { uint256 - tokenId      : 3
     *   uint256 - price        : 20
     *   address - prerequisite : 0x0000000000000000000000000000000000000000
     *   bool - hasLesson       : false
     *   bool - hasPrerequisite : false
     *   bool - available       : true}
     */
    async function scrollTypeInfo(tokenId) {
      const magicShop = new web3.eth.Contract(magicScrollABI, shopAddress);

      try {
        const caller = await magicShop.methods.scrollTypeInfo(tokenId).call();
        return caller;
      } catch (error) {
        // console.error('Not purchasable');
        return {};
      }
    }

    /**
     * Returns whether user can purchase this token
     *
     * @param {int} tokenId The tokenId of any shop using the interface given
     * @return {bool} purchasablility.
     */
    async function isPurchaseable(tokenId, address) {
      const magicShop = new web3.eth.Contract(magicScrollABI, shopAddress);
      try {
        const caller = await magicShop.methods
          .isPurchasableScroll(tokenId, address)
          .call();
        return caller;
      } catch (error) {
        console.error(tokenId);
        return false;
      }
    }

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
        return caller <= balance && caller > 0;
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
        state.primary = 'CHANGE TO RINKEBY';
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
      state.primary = 'CONNECT WALLET';
      store.dispatch('User/setUser', null);
    }

    /**
     * Returns the information of the certificate of this user
     *
     * @param {address} address The address of any contract using the interface given
     * @return {certificate[]} array of the certificates.
     */
    async function tokenSetup(data) {
      // console.log(data.tokenId);
      const purchasable = await isPurchaseable(
        data.tokenId,
        store.state.User.user,
      );
      const onChain = await scrollTypeInfo(data.tokenId);

      if (onChain[0]) {
        const token = {
          tokenId: data.tokenId,
          url: data.url,
          name: data.name,
          courseId: data.courseId,
          description: data.description,
          purchasable,
          price: onChain[1],
          prerequisite: onChain[2],
          hasLesson: onChain[3],
          hasPrerequisite: onChain[4],
          available: onChain[5],
        };
        return token;
      }
      return null;
    }

    /**
     * Connect user to the dapp
     * @return {bool} status of connection.
     */
    async function connectWallet() {
      store.dispatch('User/reset');

      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.send('eth_requestAccounts');
          const accountLength = accounts.result[0].length;
          const connectedAddress = `${accounts.result[0].substring(
            0,
            5,
          )}...${accounts.result[0].substring(
            accountLength - 4,
            accountLength,
          )}`;
          state.primary = connectedAddress;
          const ownership = await isOwner(accounts.result[0]);
          const approve = await hasApproval(accounts.result[0]);
          let toAdd = [];

          store.dispatch(
            'User/setUser',
            web3.utils.toChecksumAddress(accounts.result[0]),
          );
          store.dispatch('User/setOwner', ownership);
          store.dispatch(
            'User/setDialog',
            'Please wait and I will show you what we have got!',
          );
          store.dispatch('User/setFetching', true);

          // console.log(approve);
          store.dispatch('User/setApproval', approve);
          if (!approve) {
            store.dispatch(
              'User/setDialog',
              'Seems like you have not approved your walllet.',
            );
          }

          // const userCertificates = [];
          let scrollsData = await fetchAllMagicScrolls();
          state.magicScrollsData = scrollsData;

          while (state.magicScrollsData.length > 0) {
            console.log(store.state.User.scrollToFetch);
            const tokenAvailability = await Promise.all(
              state.magicScrollsData.map(tokenSetup),
            );

            toAdd = toAdd.concat(
              tokenAvailability.filter((obj) => obj !== null),
            );

            store.dispatch('User/setMagicScrolls', toAdd);
            if (store.state.User.scrollToFetch) {
              scrollsData = await fetchAllMagicScrolls(
                store.state.User.scrollToFetch,
              );
              state.magicScrollsData = scrollsData;
            } else {
              state.magicScrollsData = [];
            }
          }

          store.dispatch('User/setFetching', false);
          // console.log(store.state.User.scrollList);
          store.dispatch(
            'User/setDialog',
            'Great! So, what would you like to buy?',
          );

          return true;
        } catch (error) {
          console.log(error);
          state.primary = 'ERROR!';
          // route.push('/no-provider');
        }
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
      state.primary = "<i class='fas fa-spinner fa-spin'></i>";
      if (state.network !== 'rinkeby') {
        await connectToRinkeby();
        return false;
      }
      await connectWallet();
      return true;
    }

    onBeforeMount(async () => {
      if (!store.state.User.user && window.ethereum) {
        state.primary = 'CONNECT WALLET';
      }
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
.btn {
  /* Small button */

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  position: absolute;
  width: 10vw;
  height: 3vw;
  left: 88vw;
  top: 20px;

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
