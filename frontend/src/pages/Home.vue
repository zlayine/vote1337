<template>
  <div class="container">
    <meals></meals>
  </div>
</template>

<script>
import Meals from "../components/Meals";

export default {
  components: {
    Meals,
  },
  methods: {
    listen() {
      this.socket.on("newMealAdded", (data) => {
        this.$store.dispatch("socketGetMeal", data);
      });
      this.socket.on("newVoteAdded", (data) => {
        this.$store.dispatch("socketUpdateMeal", data);
      });
      this.socket.on("mealDeleted", (data) => {
        this.$store.dispatch("socketDeleteMeal", data);
      });
      this.socket.on("someoneAdding", () => {
        this.$store.commit("NOTIFY_ADDING", true);
      });
      this.socket.on("noOneAdding", () => {
        this.$store.commit("NOTIFY_ADDING", false);
      });
    },
    async joinServer() {
      await this.$store.dispatch("connectSocket", this.currentUser.token);
      if (this.socket) this.listen();
    },
  },
  async mounted() {
    if (this.currentUser) {
      if (!this.user)
        await this.$store.dispatch("getUser", this.currentUser.id);
      if (!this.socket) await this.joinServer();
    }
  },
  computed: {
    currentUser() {
      return this.$store.getters.currentUser;
    },
    user() {
      return this.$store.getters.user;
    },
    socket() {
      return this.$store.getters.socket;
    },
  },
};
</script>

<style lang="scss">
</style>
