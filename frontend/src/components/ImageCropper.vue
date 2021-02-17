<template>
  <div class="image-cropper">
    <div class="btn-close">
      <v-btn class="btn-close" color="error" fab small dark @click="closeCrop">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>
    <div class="crop-holder">
      <vue-cropper
        class="cropper"
        ref="tool"
        :modal="true"
        :background="false"
        :guides="false"
        :src="url"
        :zoomable="false"
      ></vue-cropper>
      <div class="actions">
        <v-btn class="mx-2" fab dark color="success" @click="saveCrop">
          <v-icon dark> mdi-content-save </v-icon>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";

export default {
  props: ["url"],
  methods: {
    closeCrop() {
      this.$emit("closeCrop");
    },
    saveCrop() {
      let img_url = this.$refs.tool.getCroppedCanvas().toDataURL();
      this.$refs.tool.getCroppedCanvas().toBlob((blob) => {
				this.$emit('cropImage', {url: img_url, file: this.blobToFile(blob)})
      }, 'image/jpeg', 0.95);
    },
    blobToFile(theBlob) {
      theBlob.lastModifiedDate = new Date();
      theBlob.name = "croppedimg";
      return theBlob;
    },
  },
  components: {
    VueCropper,
  },
};
</script>

<style lang="scss" scoped>
.image-cropper {
  position: fixed;
  overflow: hidden;
  z-index: 200;
  background-color: #000000c7;
  backdrop-filter: blur(5px);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  display: flex;

  .btn-close {
    position: fixed;
    top: 15px;
    left: 15px;
  }

  .crop-holder {
    width: 40%;
    height: 80%;
    margin: auto;
    display: flex;
    flex-direction: column;
    .cropper {
      height: auto;
      overflow: hidden;
      margin: 30px auto;
    }
    .actions {
      margin: auto;
    }
  }
}

@media (max-width: 768px) {
  .image-cropper {
    .crop-holder {
      width: 90%;
    }
  }
}
</style>