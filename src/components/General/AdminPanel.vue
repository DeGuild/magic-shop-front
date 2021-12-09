<template>
  <h1 class="title">Certification Transfer Page (Admin Page)</h1>
  <br />
  <div>
    <span class="panel left">
      <div><h1 class="title text">Download Scroll Transactions</h1></div>
      <div class="selector-box" v-if="state.courses">
        <div>
          <div class="title instruction">Courses</div>
        </div>
        <select
          v-model="downloading.course"
          @change="getRound()"
          class="selector-custom"
        >
          <option :value="i" v-for="i in state.courses" :key="i">
            {{ i.title }}
          </option>
        </select>
      </div>
      <div class="selector-box" v-if="downloading.course && state.rounds">
        <div>
          <div class="title instruction">Choose Round</div>
        </div>
        <select v-model="downloading.round" class="selector-custom">
          <option :value="i" v-for="i in state.rounds" :key="i">
            {{ i.coursePassword }}
          </option>
        </select>
      </div>
      <div v-if="downloading.course">
        <div class="title instruction">Add Round (press enter)</div>

        <input
          type="text"
          class="selector-custom"
          placeholder="Put in the passcode to add round"
          v-model="state.newRound"
          @keydown.enter="state.fetching ? null : addRoundToCourse()"
        />
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

      <button
        class="btn download"
        @click="getCSV()"
        :disabled="!downloading.course || !downloading.round"
      >
        Download CSV
      </button>
    </span>
    <span class="panel right">
      <div><h1 class="title text">Preview certificate</h1></div>
      <div v-if="downloading.course">
        <img class="upload-image" :src="downloading.course.url" />
        <div class="preview" v-for="i in previewHeader" :key="i">
          <div>
            <span class="preview-text">{{ i }}:</span
            ><span class="preview-text data">{{ downloading.course[i] }}</span>
          </div>
        </div>
      </div>

      <div class="upload-pos">
        <div class="custom-file-upload">
          <label for="scroll-pic-upload" class="custom-file-upload button">
            <span class="fas fa-paperclip"></span>
            <span class="upload-preview"> {{ state.csvName }}</span>
          </label>
        </div>
      </div>
      <button
        class="btn upload"
        @click="batchMint()"
        :disabled="!downloading.course || !state.csvFile"
      >
        BATCH MINT
      </button>
    </span>
  </div>
  <input
    id="scroll-pic-upload"
    @change="previewCSV($event)"
    type="file"
    accept="text/csv"
  />
</template>

<script>

import { useStore } from 'vuex';

import { reactive, computed, onBeforeMount } from 'vue';
import Web3Token from 'web3-token';

const Web3 = require('web3');

/**
 * Using relative path, just clone the git beside this project directory and compile to run
 */

require('dotenv').config();

const shopAddress = process.env.VUE_APP_SHOP_ADDRESS;
const skillCertificateABI = require('../../../../DeGuild-MG-CS-Token-contracts/artifacts/contracts/SkillCertificates/V2/ISkillCertificate+.sol/ISkillCertificatePlus.json').abi;

export default {
  name: 'AdminPanel',
  setup() {
    const store = useStore();

    const user = computed(() => store.state.User.user);

    const previewHeader = ['title', 'address', 'tokenId'];

    const state = reactive({
      fetching: computed(() => store.state.User.fetching),
      courses: null,
      rounds: null,
      newRound: null,
      csvFile: null,
      csvName: 'Upload CSV file',
    });

    const downloading = reactive({
      course: null,
      round: null,
    });
    const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');

    async function fetchSetup() {
      store.dispatch('User/setFetching', true);

      const responseNew = await fetch(
        'https://us-central1-deguild-2021.cloudfunctions.net/app/courses',
        { mode: 'cors' },
      );

      const skillsWithType = await responseNew.json();
      state.courses = skillsWithType;

      store.dispatch('User/setFetching', false);
    }

    async function getRound() {
      store.dispatch('User/setFetching', true);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      try {
        const realAddress = web3.utils.toChecksumAddress(store.state.User.user);
        // generating a token with 1 day of expiration time
        const token = await Web3Token.sign(
          (msg) => web3.eth.personal.sign(msg, realAddress),
          '1d',
        );

        const requestOptions = {
          method: 'GET',
          headers: {
            Authorization: token,
          },
        };
        const response = await fetch(
          `https://us-central1-deguild-2021.cloudfunctions.net/shop/round/${shopAddress}/${downloading.course.address}/${downloading.course.tokenId}`,
          requestOptions,
        );

        const rounds = await response.json();

        state.rounds = rounds;

        store.dispatch('User/setFetching', false);
      } catch {
        store.dispatch('User/setFetching', false);
      }
    }

    async function addRoundToCourse() {
      store.dispatch('User/setFetching', true);
      const realAddress = web3.utils.toChecksumAddress(store.state.User.user);
      // generating a token with 1 day of expiration time
      const token = await Web3Token.sign(
        (msg) => web3.eth.personal.sign(msg, realAddress),
        '1d',
      );

      const requestOptions = {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          addressM: shopAddress,
          addressC: downloading.course.address,
          tokenId: downloading.course.tokenId,
          coursePassword: state.newRound,
        }),
      };
      const response = await fetch(
        'https://us-central1-deguild-2021.cloudfunctions.net/shop/round',
        requestOptions,
      );

      await response.json();

      await getRound();

      store.dispatch('User/setFetching', false);
    }

    async function getCSV() {
      try {
        store.dispatch('User/setFetching', true);
        const realAddress = web3.utils.toChecksumAddress(store.state.User.user);
        // generating a token with 1 day of expiration time
        const token = await Web3Token.sign(
          (msg) => web3.eth.personal.sign(msg, realAddress),
          '1d',
        );

        const requestOptions = {
          method: 'GET',
          headers: {
            Authorization: token,
            'content-type': 'text/csv;charset=UTF-8',
          },
        };

        const response = await fetch(
          `https://us-central1-deguild-2021.cloudfunctions.net/shop/csv/${shopAddress}/${downloading.course.typeAccepted}/${downloading.round.coursePassword}`,
          requestOptions,
        );
        const data = await response.text();

        const downloadLink = document.createElement('a');
        const blob = new Blob(['\ufeff', data]);
        const url = URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.download = `${shopAddress}-${downloading.course.typeAccepted}-${downloading.round.coursePassword}.csv`;

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        store.dispatch('User/setFetching', false);
      } catch (err) {
        store.dispatch('User/setFetching', false);
      }
    }

    function CSVToArray(strData, _strDelimiter) {
      // Check to see if the delimiter is defined. If not,
      // then default to comma.
      const strDelimiter = _strDelimiter || ',';

      // Create a regular expression to parse the CSV values.
      const objPattern = new RegExp(
        // Delimiters.
        `(\\${strDelimiter}|\\r?\\n|\\r|^)`
          // Quoted fields.
          + '(?:"([^"]*(?:""[^"]*)*)"|'
          // Standard fields.
          + `([^"\\${strDelimiter}\\r\\n]*))`,
        'gi',
      );

      // Create an array to hold our data. Give the array
      // a default empty first row.
      const arrData = [[]];

      // Create an array to hold our individual pattern
      // matching groups.
      let arrMatches = null;

      // Keep looping over the regular expression matches
      // until we can no longer find a match.
      // eslint-disable-next-line no-cond-assign
      while ((arrMatches = objPattern.exec(strData))) {
        // Get the delimiter that was found.
        const strMatchedDelimiter = arrMatches[1];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
          strMatchedDelimiter.length
          && strMatchedDelimiter !== strDelimiter
        ) {
          // Since we have reached a new row of data,
          // add an empty row to our data array.
          arrData.push([]);
        }

        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        let strMatchedValue;
        if (arrMatches[2]) {
          // We found a quoted value. When we capture
          // this value, unescape any double quotes.
          strMatchedValue = arrMatches[2].replace(new RegExp('""', 'g'), '"');
        } else {
          // We found a non-quoted value.
          // eslint-disable-next-line prefer-destructuring
          strMatchedValue = arrMatches[3];
        }

        // Now that we have our value string, let's add
        // it to the data array.
        arrData[arrData.length - 1].push(strMatchedValue);
      }

      // Return the parsed data.
      return arrData;
    }

    async function batchMint() {
      const fr = new FileReader();
      fr.onload = async () => {
        try {
          const csvArray = CSVToArray(fr.result);

          const jsonObjHeader = [].concat.apply(...csvArray.slice(0, 1));

          const jsonArr = csvArray.slice(1).map((row) => {
            const objForJSON = {};

            for (let index = 0; index < jsonObjHeader.length; index += 1) {
              objForJSON[jsonObjHeader[index]] = row[index];
            }

            return objForJSON;
          });

          const noUndefined = jsonArr.filter((ele) => ele.status);
          const passed = noUndefined.filter((ele) => ele.status.toLowerCase() === 'true');
          const arrayUser = passed.map((ele) => ele.address);
          const arrayToken = passed.map((ele) => ele.tokenId);
          const typeId = downloading.course.tokenId;
          const manager = new web3.eth.Contract(
            skillCertificateABI,
            downloading.course.address,
          );

          await manager.methods
            .batchMint(arrayUser, arrayToken, typeId.toString())
            .send({ from: store.state.User.user });
          return true;
        } catch (err) {
          return false;
        }
      };

      fr.readAsText(state.csvFile);
    }

    function previewCSV(event) {
      const file = event.target.files[0];
      state.csvFile = file;
      state.csvName = file.name;
    }

    onBeforeMount(async () => {
      await fetchSetup();
    });

    return {
      state,
      downloading,
      user,
      previewHeader,
      addRoundToCourse,
      getRound,
      batchMint,
      getCSV,
      previewCSV,
    };
  },
};
</script>

<style scoped lang="scss">
.upload-image {
  height: 10vw;
  width: 10vw;
}
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
    bottom: 14vw;
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
  height: 11vw;
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
