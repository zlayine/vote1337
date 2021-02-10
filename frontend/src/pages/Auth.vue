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
      if (!this.currentUser)
        window.location.href =
          "https://api.intra.42.fr/oauth/authorize?client_id=112d563acce9f5f0ea1be2f74995194a18e3a3f9e3128d3c7906443679f633bf&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fauth&response_type=code";
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