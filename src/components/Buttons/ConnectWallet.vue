<template>
  <div id="app">
    <button class="btn" @click="ethEnabled" v-html="state.primary"></button>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { reactive, onBeforeMount } from 'vue';

const Web3 = require('web3');

export default {
  name: 'ConnectWallet',
  setup() {
    const store = useStore();
    const state = reactive({
      primary: 'SOMETHING WENT WRONG',
      btn1style: {},
      network: '',
    });

    async function verifyNetwork() {
      const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');
      state.network = await web3.eth.net.getNetworkType();

      if (state.network !== 'rinkeby') {
        // console.log('Please change to rinkeby testnet');
        state.primary = 'CHANGE TO RINKEBY';
        return false;
      }
      return true;
    }

    async function connectToRinkeby() {
      try {
        //  Rinkeby chain id
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x4' }],
        });
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          console.error(switchError);
        }
        // handle other "switch" errors
      }
    }

    function disconnected() {
      state.primary = 'CONNECT WALLET';
      store.dispatch('User/setUser', null);
    }

    async function connectWallet() {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.send('eth_requestAccounts');
          // console.log(accounts.result[0]);
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
          return true;
        } catch (error) {
          // console.error(error);
          state.primary = 'CONNECT WALLET';
        }
      }
      return false;
    }

    function handleChainChanged() {
      // We recommend reloading the page, unless you must do otherwise
      window.location.reload();
    }

    // For now, 'eth_accounts' will continue to always return an array
    function handleAccountsChanged(accounts) {
      // console.log(accounts[0]);
      // console.log(store.state.User.user);
      const current = accounts[0];
      if (accounts.length === 0) {
        // MetaMask is locked or the user has not connected any accounts
        disconnected();
      } else if (current !== store.state.User.user) {
        connectWallet();
        // Do any other work!
      }
    }

    onBeforeMount(async () => {
      if (!store.state.User.user && window.ethereum) {
        state.primary = 'CONNECT WALLET';
      }
      await verifyNetwork();

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    });

    async function ethEnabled() {
      state.primary = "<i class='fas fa-spinner fa-spin'></i>";
      if (state.network !== 'rinkeby') {
        await connectToRinkeby();
        return false;
      }
      return connectWallet();
    }

    return {
      state,
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
  cursor: pointer;

  &:hover {
    background: #cc3b3b;
  }
}
</style>
