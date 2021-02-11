<template>
  <div class="container">
    <div class="signin" v-if="!$route.query.code">
      <v-btn depressed @click="signin"> Sign in </v-btn>
    </div>
    <div v-else>Loading</div>
  </div>
</template>

<script>
import { login } from "../auth.js";

export default {
  data() {
    return {};
  },
  created() {
    if (this.currentUser) this.$router.push("/");
    if (this.$route.query.code) this.accessData();
  },
  methods: {
    signin() {
      if (!this.currentUser) window.location.href = process.env.VUE_APP_AUTH_42;
      else login(this.currentUser.user);
    },
    async accessData() {
      await this.$store.dispatch("createUser", this.$route.query.code + "");
      this.$router.push("/");
    },
  },
  computed: {
    currentUser() {
      return this.$store.getters.currentUser;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>