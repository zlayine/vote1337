<template>
  <v-app>
    <navbar />
    <transition name="fade-out">
      <router-view></router-view>
    </transition>
    <!-- <Footer></Footer> -->
  </v-app>
</template>

<script>
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default {
  name: "main-app",
	data(){
		return {
			loading: false,
		}
	},
  async created() {
    if (this.currentUser && !this.user) {
			this.loading = true;
      await this.$store.dispatch("getUser", this.currentUser.id);
			this.loading = false;
    }
  },
  computed: {
    currentUser() {
      return this.$store.getters.currentUser;
    },
    user() {
      return this.$store.getters.user;
    },
  },
  components: {
    Navbar,
    Footer,
  },
};
</script>

<style>
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