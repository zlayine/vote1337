<template>
  <div class="loader" v-if="loading">
    <v-icon x-large color="primary">fas fa-circle-notch fa-spin</v-icon>
  </div>
</template>

<script>
export default {
  computed: {
    loading() {
      return this.$store.getters.loading;
    },
  },
};
</script>

<style lang="scss" scoped>
.loader {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 100;
  background-color: #ffffff80;
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
}
</style>