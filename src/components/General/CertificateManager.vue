<template>
  <h1 class="title">Certification Manager Page (Manager Page)</h1>
  <br />
  <div>
    <span class="panel left">
      <div><h1 class="title text">Certificate Information</h1></div>

      <div class="selector-box">
        <div>
          <div class="title instruction">Certificate name</div>
        </div>
        <input
          class="selector-custom"
          type="text"
          v-model="certificate.name"
          placeholder="Blockchain certificate"
        />
      </div>
      <div class="selector-box" v-if="state.scrolls">
        <div>
          <div class="title instruction">Scroll to burn</div>
        </div>
        <select v-model="certificate.scrollType" class="selector-custom">
          <option :value="i.tokenId" v-for="i in state.scrolls" :key="i">
            {{ i.name }}
          </option>
        </select>
      </div>
      <div class="selector-box" v-if="state.managers">
        <div>
          <div class="title instruction">Choose Certifcate Manager</div>
        </div>
        <select v-model="certificate.address" class="selector-custom">
          <option :value="i" v-for="i in state.managers" :key="i">
            {{ i }}
          </option>
        </select>
      </div>

      <div class="selector-box">
        <div>
          <div class="title instruction">
            Add certificate manager (press enter)
          </div>
        </div>
        <input
          class="selector-custom"
          type="text"
          v-model="certificate.approve"
          placeholder="0xabc..."
          @keydown.enter="state.fetching ? null : approveCertificateManager()"
        />
      </div>

      <div class="explaination">
        <h2>Instructions</h2>
        <div>
          <div class="explaination-text first">
            1. Define your certificate name for students, then choose a scroll
            to burn
          </div>
          <div class="explaination-text second">
            2. Choose a certificate manager or add a new one
          </div>
        </div>
      </div>
    </span>
    <span class="panel right">
      <div><h1 class="title text">Preview certificate</h1></div>

      <img class="upload-image" :src="state.imagePreview" />

      <div class="upload-pos">
        <div class="custom-file-upload">
          <label for="scroll-pic-upload" class="custom-file-upload button">
            <span class="fas fa-paperclip"></span>
            <span class="upload-preview">Upload certificate image</span>
          </label>
        </div>
      </div>
      <div class="preview" v-for="i in previewHTML" :key="i">
        <div>
          <span class="preview-text">{{ i }}:</span
          ><span class="preview-text data">{{ certificate[i] }}</span>
        </div>
      </div>

      <button
        class="btn upload"
        @click="state.fetching ? null : addSkill()"
        :disabled="
          !certificate.name ||
          !certificate.scrollType ||
          !certificate.address ||
          !state.imageName
        "
      >
        ADD CERTIFICATE
      </button>
    </span>
  </div>
  <input
    id="scroll-pic-upload"
    @change="previewImage($event)"
    type="file"
    accept="image/jpeg"
  />
</template>

<script>
/* eslint-disable no-await-in-loop */

import { useStore } from 'vuex';
// import { useRoute } from 'vue-router';

import { reactive, computed, onBeforeMount } from 'vue';

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import Web3Token from 'web3-token';

const Web3 = require('web3');

/**
 * Using relative path, just clone the git beside this project directory and compile to run
 */
// eslint-disable-next-line no-unused-vars
require('dotenv').config();

const shopAddress = process.env.VUE_APP_SHOP_ADDRESS;
const magicScrollABI = require('../../../../DeGuild-MG-CS-Token-contracts/artifacts/contracts/MagicShop/V2/IMagicScrolls+.sol/IMagicScrollsPlus.json').abi;
const skillCertificateABI = require('../../../../DeGuild-MG-CS-Token-contracts/artifacts/contracts/SkillCertificates/V2/ISkillCertificate+.sol/ISkillCertificatePlus.json').abi;

const noImg = require('@/assets/no-url.jpg');

export default {
  name: 'CertficateManager',
  setup() {
    const store = useStore();
    // const route = useRoute();

    const user = computed(() => store.state.User.user);
    const previewHTML = ['name', 'scrollType', 'address'];

    const state = reactive({
      imageFile: null,
      imagePreview: noImg,
      imageName: null,
      fetching: computed(() => store.state.User.fetching),
      scrolls: null,
      managers: null,
    });
    const certificate = reactive({
      name: null,
      scrollType: null,
      address: null,
      approve: null,
    });
    const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');

    async function fetchSetup() {
      store.dispatch('User/setFetching', true);

      const response = await fetch(
        `https://us-central1-deguild-2021.cloudfunctions.net/app/magicScrolls/${shopAddress}`,
        { mode: 'cors' },
      );
      const response2 = await fetch(
        `https://us-central1-deguild-2021.cloudfunctions.net/app/manager/${shopAddress}`,
        { mode: 'cors' },
      );

      const magicScrolls = await response.json();
      const managers = await response2.json();
      // console.log(magicScrolls);
      console.log(managers);
      if (!managers.message) {
        state.managers = managers;
      }
      state.scrolls = magicScrolls;
      store.dispatch('User/setFetching', false);
    }

    function previewImage(event) {
      // console.log('File changed!');
      const file = event.target.files[0];
      console.log(file);
      state.imagePreview = URL.createObjectURL(file);
      state.imageFile = file;
      state.imageName = file.name;
    }

    async function approveCertificateManager() {
      const magicShop = new web3.eth.Contract(magicScrollABI, shopAddress);
      const transaction = await magicShop.methods
        .setCertificateManager(certificate.approve, true)
        .send({ from: user.value });
      console.log(transaction);
    }
    async function addSkill() {
      store.dispatch('User/setFetching', true);

      const response3 = await fetch(
        `https://us-central1-deguild-2021.cloudfunctions.net/app/allCertificates/${certificate.address}`,
        { mode: 'cors' },
      );

      const allcerts = await response3.json();
      const count = allcerts.length;

      try {
        const realAddress = web3.utils.toChecksumAddress(store.state.User.user);
        // generating a token with 1 day of expiration time
        const token = await Web3Token.sign(
          (msg) => web3.eth.personal.sign(msg, realAddress),
          '1d',
        );
        console.log(token);
        const storage = getStorage();
        const storageRef = ref(
          storage,
          `images/${certificate.address}/${count.length}`,
        );

        const certificateManager = new web3.eth.Contract(
          skillCertificateABI,
          certificate.address,
        );

        const uploadTask = uploadBytesResumable(storageRef, state.imageFile);
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
                  const transaction = await certificateManager.methods
                    .addCertificate(certificate.scrollType)
                    .send({ from: realAddress });
                  console.log(transaction);
                  console.log('File available at', downloadURL);
                  console.log({
                    url: downloadURL,
                    address: certificate.address,
                    tokenId: count.toString(),
                    title: certificate.name,
                  });
                  const requestOptions = {
                    method: 'POST',
                    headers: {
                      Authorization: token,
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      url: downloadURL,
                      address: certificate.address,
                      tokenId: count.toString(),
                      title: certificate.name,
                    }),
                  };
                  await fetch(
                    'https://us-central1-deguild-2021.cloudfunctions.net/certificate/addCertificate',
                    requestOptions,
                  );
                  store.dispatch('User/setFetching', false);

                  return null;
                } catch (error) {
                  store.dispatch('User/setFetching', false);

                  return null;
                }
              },
            );
          },
        );
      } catch (error) {
        console.log(error);
        store.dispatch('User/setFetching', false);
      }
      return false;
    }
    onBeforeMount(async () => {
      await fetchSetup();
    });

    return {
      state,
      certificate,
      user,
      previewHTML,
      addSkill,
      previewImage,
      approveCertificateManager,
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
  position: relative;
}
.upload-image {
  height: 10vw;
  width: 10vw;
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
    left: 7vw;
  }
}
.explaination {
  position: absolute;
  justify-content: center;
  align-items: center;
  background: grey;
  width: 43vw;
  left: 2vw;
  height: 9vw;
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
