<template>
  <div class="container">
    <meals></meals>
  </div>
</template>

<script>
import Meals from "../components/Meals";

export default {
  data() {
    return {};
  },
  created() {},
  computed: {
    currentUser() {
      return this.$store.getters.currentUser;
    },
  },
  methods: {},
  components: {
    Meals,
  },
};
</script>

<style lang="scss">
</style>
