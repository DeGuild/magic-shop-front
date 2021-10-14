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
// const {
//   skillCertificateABI,
// } = require('../../../../DeGuild-MG-CS-Token-contracts/artifacts/contracts/
// SkillCertificates/ISkillCertificate.sol/ISkillCertificate.json');
// const {
//   magicScrollABI,
// } = require('../../../../DeGuild-MG-CS-Token-contracts/artifacts/
// contracts/MagicShop/IMagicScrolls.sol/IMagicScrolls.json');

export default {
  name: 'ConnectWallet',
  setup() {
    const store = useStore();
    // const route = useRoute();

    const user = computed(() => store.state.User.user);

    const state = reactive({
      primary: 'SOMETHING WENT WRONG',
      network: '',
      certificateSet: null,
    });
    const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');

    /**
     * Returns all magic scrolls in the DeGuild system.
     *
     * @param {address} nextToFetch The address we lastly fetched
     * @return {address[]} all certificates in the DeGuild system.
     */
    // async function fetchAllMagicScrolls(nextToFetch) {
    //   console.log(nextToFetch);
    // let response = null;
    // if (nextToFetch) {
    //   response = await fetch(
    //     `https://us-central1-deguild-2021.cloudfunctions.net/app/allCertificates/${nextToFetch}/next`,
    //     { mode: 'cors' },
    //   );
    // } else {
    //   response = await fetch(
    //     'https://us-central1-deguild-2021.cloudfunctions.net/app/allCertificatesOnce',
    //     { mode: 'cors' },
    //   );
    // }

    // state.certificateSet = await response.json();
    // const next = state.certificateSet.result[state.certificateSet.result.length - 1];
    // store.dispatch('User/setCertificateToFetch', next);
    // return state.certificateSet;
    // }

    /**
     * Returns name of the address.
     *
     * @param {address} address The address of any contract using the interface given
     * @return {string} name of the contract.
     */
    // async function getName(address) {
    //   const certificateManager = new web3.eth.Contract(magicScrollABI, address);
    //   const caller = await certificateManager.methods.name().call();
    //   return caller;
    // }

    /**
     * Returns verification of the certificate
     *
     * @param {address} address The address of any contract using the interface given
     * @return {bool} status of verification.
     */
    // async function hasCertificate(address) {
    //   const certificateManager = new web3.eth.Contract(skillCertificateABI, address);
    //   const caller = await certificateManager.methods
    //     .verify(store.state.User.user)
    //     .call();
    //   return caller;
    // }

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
    // async function userCertificateChecker(address) {
    //   const hasCertificateResult = await hasCertificate(address);
    //   const certificateArray = [];

    //   if (hasCertificateResult) {
    //     const name = await getName(address);
    //     const imageUrl = await fetch(
    //       `https://us-central1-deguild-2021.cloudfunctions.net/app/readCertificate/${address}`,
    //       { mode: 'cors' },
    //     );

    //     const dataUrl = await imageUrl.json();
    //     certificateArray.push(name);
    //     certificateArray.push(dataUrl);
    //     certificateArray.push(address);
    //   }
    //   return certificateArray;
    // }

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
          store.dispatch('User/setUser', accounts.result[0]);
          // let next = state.certificateSet.result.length;
          // let toAdd = [];
          // const userCertificates = [];
          // store.dispatch('User/setFetching', true);

          // while (next > 0) {
          //   const cersVerified = await Promise.all(
          //     state.certificateSet.result.map(userCertificateChecker),
          //   );

          //   toAdd = toAdd.concat(cersVerified);
          //   toAdd.forEach((element) => {
          //     if (element.length > 0) userCertificates.push(element);
          //   });
          //   // console.log(toAdd);

          //   store.dispatch('User/setCertificates', userCertificates);
          //   next = await fetchAllCertificates(
          //     store.state.User.certificateToFetch,
          //   );
          // }
          // store.dispatch('User/setFetching', false);

          return true;
        } catch (error) {
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
      // await fetchAllCertificates();

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
