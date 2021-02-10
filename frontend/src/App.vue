<template>
  <v-app>
    <navbar />
    <router-view></router-view>
    <Footer></Footer>
  </v-app>
</template>

<script>
import Navbar from "./components/Navbar";
import Footer from './components/Footer';

export default {
  name: "main-app",
  components: {
    Navbar,
    Footer
  },
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
* {
  font-family: "Open Sans", sans-serif;
  letter-spacing: 0px;
}
</style>