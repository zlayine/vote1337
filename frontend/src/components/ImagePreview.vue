<template>
  <div class="image-preview">
    <div class="btn-close">
      <v-btn
        class="btn-close"
        color="error"
        fab
        small
        dark
        @click="closePreview"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>
    <div class="image" v-if="image">
      <img
        :src="image"
        alt="image previewed"
      />
    </div>
  </div>
</template>

<script>
export default {
	props: {
		image: String
	},
  data() {
    return {};
  },
  methods: {
    closePreview() {
      this.$emit("closePreview");
    },
  },
};
</script>

<style lang="scss" scoped>
.image-preview {
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

  .image {
    width: 20%;
    overflow: hidden;
    margin: 100px auto;
    img {
      width: 100%;
    }
  }
}

@media (max-width: 768px) {
  .image-preview {
    .image {
      width: 90%;
    }
  }
}
</style>