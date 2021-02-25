<template>
  <transition name="fade">
    <div class="item-form">
      <div
        class="empty step3"
        :class="{ preview: url ? true : false }"
        @click="launchFilePicker"
      >
        <v-icon large v-if="!url" color="#2eb9ffd5"> mdi-plus-circle </v-icon>
        <transition name="fade-out">
          <img :src="url" alt="" v-if="url" />
        </transition>
        <transition name="fade-out">
          <div class="img-size" v-if="url">
            {{ size | size_filter }}
          </div>
        </transition>
      </div>
      <input
        type="file"
        ref="file"
        :name="file"
        :disabled="saved"
        @change="onFileChange($event.target.files)"
        style="display: none"
      />
      <div class="item-info" v-if="url">
        <v-text-field
          v-model="name"
          :rules="nameRules"
          dense
          label="Name"
          hide-details
          :disabled="saved"
          required
          outlined
          class="my-2 input-name step4"
        ></v-text-field>
        <div class="actions">
          <v-btn class="mx-2" @click="clearItem" fab dark small color="error">
            <v-icon dark> mdi-close </v-icon>
          </v-btn>
          <v-btn
            class="mx-2 step5"
            @click="crop = true"
            v-if="!saved || item_data.demo"
            fab
            dark
            small
            color="primary"
          >
            <v-icon dark> mdi-crop </v-icon>
          </v-btn>
          <transition name="fade">
            <v-btn
              class="mx-2 step6"
              v-if="!saved || item_data.demo"
              @click="saveItem"
              fab
              dark
              small
              color="success"
            >
              <v-icon dark> mdi-content-save </v-icon>
            </v-btn>
          </transition>
        </div>
      </div>
      <transition name="fade">
        <image-cropper
          ref="cropper"
          v-if="crop"
          @cropImage="cropImage"
          @closeCrop="crop = false"
          :url="url"
        />
      </transition>
    </div>
  </transition>
</template>

<script>
import ImageCropper from "./ImageCropper.vue";

export default {
  props: ["item_data", "index"],
  data() {
    return {
      file: null,
      url: null,
      name: null,
      errorDialog: null,
      errorText: null,
      nameRules: [(v) => !!v || "Name is required"],
      saved: false,
      croppedImageSrc: "",
      crop: false,
      size: 0,
    };
  },
  watch: {
    item_data: function (newVal, oldVal) {
      this.url = URL.createObjectURL(newVal.file);
      this.name = newVal.name;
      this.size = newVal.size;
    },
  },
  created() {
    if (this.item_data) {
      if (this.item_data.demo)
        this.url =
          "https://www.godairyfree.org/wp-content/uploads/2020/04/pics-Mexican-Mushroom-Beef-Tacos-feature.jpg";
      else this.url = URL.createObjectURL(this.item_data.file);
      this.name = this.item_data.name;
      this.size = this.item_data.size;
      this.saved = true;
    }
  },
  methods: {
    launchFilePicker() {
      this.$refs.file.click();
    },
    onFileChange(file) {
      const maxSize = 1024;
      let imageFile = file[0];
      if (file.length > 0) {
        this.size = imageFile.size / maxSize / maxSize;
        if (!imageFile.type.match("image.*")) {
          this.errorText = "Please choose an image file";
        } else {
          this.file = imageFile;
          this.url = URL.createObjectURL(imageFile);
        }
        if (typeof FileReader === "function") {
          const reader = new FileReader();
          reader.onload = (event) => {
            this.url = event.target.result;
          };
          reader.readAsDataURL(this.file);
        } else {
          this.errorText = "FileReader API not supported";
        }
      }
    },
    enableCropping() {
      this.crop = true;
      this.$refs.cropper.tool.replace(this.url);
    },
    cropImage(data) {
      const maxSize = 1024;
      this.crop = false;
      this.url = data.url;
      this.file = data.file;
      this.size = data.file.size / maxSize / maxSize;
    },
    clearItem() {
      if (this.index != null) {
        console.log(this.index);
        this.$emit("removeItem", this.index);
        return;
      }
      this.url = null;
      this.data = null;
      this.name = null;
      this.saved = false;
      this.$refs.file.value = null;
    },
    saveItem() {
      if (!this.name || this.name == "") {
        this.name = "";
        this.$store.commit("SET_NOTIFICATION", {
          msg: "Meal item name is required",
          error: 1,
        });
        return;
      }
      this.saved = true;
      this.$emit("saved", {
        file: this.file,
        name: this.name,
        size: this.size,
      });
    },
  },
  filters: {
    size_filter(val) {
      if (val < 1) return parseInt(val * 1000) + "KB";
      return parseFloat(val).toFixed(1) + "MB";
    },
  },
  components: {
    ImageCropper,
  },
};
</script>

<style lang="scss" scoped>
.item-form {
  margin-right: 15px;
  width: 200px;
  transition: 200ms all;

  .empty {
    width: 200px;
    height: 300px;
    cursor: pointer;
    border: 4px dotted #2eb9ffd5;
    border-radius: 10px;
    display: flex;
    position: relative;
    justify-content: center;

    &.preview {
      display: flex;
      width: 200px;
      height: 300px;
      overflow: hidden;
      border: none;
      border-radius: 10px;
      box-shadow: 0 0 2px #0202027e;

      img {
        width: 100%;
        margin: auto;
      }

      .img-size {
        position: absolute;
        bottom: 0;
        left: 0;
        padding: 2px 10px;
        font-size: 14px;
        color: #fff;
        background-color: rgba(34, 34, 34, 0.788);
      }
    }
  }

  .item-info {
    transition: 200ms all;

    .input-name {
      width: 100%;
    }
  }
  .actions {
    display: flex;
    justify-content: center;
    position: relative;

    button {
      transition: 200ms all;
      position: relative;
    }
  }
}
</style>