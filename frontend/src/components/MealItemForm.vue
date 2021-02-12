<template>
  <transition name="fade">
    <div class="item-form">
      <div
        class="empty"
        :class="{ preview: url ? true : false }"
        @click="launchFilePicker"
      >
        <v-icon large v-if="!url" color="#2eb9ffd5"> mdi-plus-circle </v-icon>
        <transition name="fade-out">
          <img :src="url" alt="" v-if="url" />
        </transition>
      </div>
      <input
        type="file"
        ref="file"
        :name="file"
        @change="onFileChange($event.target.files)"
        style="display: none"
      />
      <div class="item-info" v-if="url">
        <v-text-field
          v-model="name"
          dense
          label="Name"
          hide-details
          outlined
          class="my-2"
        ></v-text-field>
        <div class="actions">
          <v-btn class="mx-2" @click="clearItem" fab dark small color="error">
            <v-icon dark> mdi-close </v-icon>
          </v-btn>
          <transition name="fade">
            <v-btn
              class="mx-2"
              v-if="!saved"
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
    </div>
  </transition>
</template>

<script>
export default {
  props: ["item_data", "index"],
  data() {
    return {
      file: null,
      url: null,
      name: null,
      errorDialog: null,
      errorText: null,
      saved: false,
    };
  },
  created() {
    if (this.item_data) {
      this.url = URL.createObjectURL(this.item_data.file);
      this.name = this.item_data.name;
      this.saved = true;
    }
  },
  methods: {
    launchFilePicker() {
      this.$refs.file.click();
    },
    onFileChange(file) {
      let imageFile = file[0];
      if (file.length > 0) {
        if (!imageFile.type.match("image.*")) {
          this.errorText = "Please choose an image file";
        } else {
          this.file = imageFile;
          this.url = URL.createObjectURL(imageFile);
        }
      }
    },
    clearItem() {
      if (this.index != null) {
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
      if (!this.name || this.name == "") return;
      this.saved = true;
      this.$emit("saved", { file: this.file, name: this.name });
    },
  },
};
</script>

<style lang="scss" scoped>
.item-form {
  margin-right: 15px;
  transition: 200ms all;

  .empty {
    width: 200px;
    height: 300px;
    cursor: pointer;
    border: 4px dotted #2eb9ffd5;
    border-radius: 10px;
    display: flex;
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
    }
  }

  .item-info {
    transition: 200ms all;
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