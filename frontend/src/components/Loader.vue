<template>
  <div class="loader" v-if="loading">
    <div class="holder">
      <div class="percent" v-if="uploadPercent != null">{{ uploadPercent }}%</div>
      <v-icon x-large color="primary">fas fa-circle-notch fa-spin</v-icon>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    loading() {
      return this.$store.getters.loading;
    },
    uploadPercent() {
      return this.$store.getters.uploadPercent;
    },
  },
};
</script>

<style lang="scss" scoped>
.loader {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 100;
  background-color: #ffffff93;
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;

  .holder {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: relative;

    .percent {
      position: absolute;
      font-weight: 600;
    }

    i {
      font-size: 60px !important;
    }
  }
}
</style>