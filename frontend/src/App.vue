<template>
  <v-app>
    <navbar />
    <loader />
    <notification />
    <transition name="fade-out">
      <router-view></router-view>
    </transition>
    <footer-layout />
  </v-app>
</template>

<script>
import Navbar from "./components/Navbar";
import Loader from "./components/Loader";
import Notification from "./components/Notification";
import FooterLayout from "./components/FooterLayout.vue";

export default {
  name: "main-app",
  data() {
    return {
      loading: false,
    };
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
  components: {
    Navbar,
    FooterLayout,
    Loader,
    Notification,
  },
};
</script>

<style lang="scss">
$primary: #2eb9ff;
$secondary: #cbf5ff;
$shadow-color: #22222227;
$brdr-radius: 4px;

html {
  height: 100%;
}
body {
  margin: 0;
  padding: 0;
}
* {
  font-family: "Open Sans", sans-serif;
  letter-spacing: 0px;
}
.fade-enter-active {
  transition: opacity 0.2s;
}
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-out-enter-active {
  transition: opacity 0.2s;
}
.fade-out-leave-active {
  display: none;
}
.fade-out-enter,
.fade-out-leave-to {
  opacity: 0;
}
</style>