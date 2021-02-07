<template>
  <v-app>
    <navbar></navbar>
    <router-view></router-view>
  </v-app>
</template>

<script>
import Navbar from "./components/Navbar";

export default {
  name: "main-app",
  components: {
    Navbar,
  },
};
</script>

<style>
body {
	margin: 0;
	padding: 0;
	font-family: sans-serif;
}
</style>