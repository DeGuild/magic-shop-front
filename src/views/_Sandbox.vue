<template>
  <div>
    <p>Upload an image to Firebase:</p>
    <input type="file" @change="previewImage($event)" accept="image/*" />
  </div>
  <div>
    <p>
      Progress: {{ state.uploadValue.toFixed() + '%' }}
      <progress :value="state.uploadValue" max="100"></progress>
    </p>
  </div>
  <div>
    <img class="preview" :src="state.picture" /><br /><button
      @click="onUpload()"
    >
      Upload
    </button>
  </div>
</template>

<script>
// @ is an alias to /src
import { reactive } from 'vue';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';

export default {
  name: 'Sandbox',
  setup() {
    // console.log(store.state.User.user);
    // console.log(user);
    // Connection to MetaMask wallet
    const state = reactive({
      imageData: null,
      picture: null,
      uploadValue: 0,
    });

    function previewImage(event) {
      state.uploadValue = 0;
      state.picture = null;
      const file = event.target.files[0];
      console.log(file);
      state.imageData = file;
    }

    function onUpload() {
      state.picture = null;
      const storage = getStorage();
      // const storageRef = ref(storage, `${state.imageData.name}`);
      const storageRef = ref(storage, `images/${state.imageData.name}`);
      const uploadTask = uploadBytesResumable(storageRef, state.imageData);

      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
          state.uploadValue = progress;
          // eslint-disable-next-line default-case
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error) => {
          // Handle unsuccessful uploads
          console.log(error.message);
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            state.picture = downloadURL;
          });
        },
      );
    }

    return { state, previewImage, onUpload };
  },
};
</script>
<style scoped lang="scss">
.preview {
  width: 7.5vw;
  height: 7.5vw;

  &.display {
    position: static;
  }

  &.click {
    cursor: pointer;
    &:hover {
      opacity: 0.9;
    }
  }

  &.selected {
    width: 7.1vw;
    height: 7.1vw;
    left: 4.2vw;
    top: 4.5vw;
  }
}
</style>
