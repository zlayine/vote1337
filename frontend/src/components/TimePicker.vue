<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    :nudge-right="40"
    :return-value.sync="time"
    transition="scale-transition"
    offset-y
    max-width="290px"
    min-width="290px"
  >
    <template v-slot:activator="{ on, attrs }">
			<slot name="abdo" v-bind:attrs="attrs" v-bind:on="on"></slot>
    </template>
    <v-time-picker
      v-if="menu"
      v-model="time"
      format="24hr"
      full-width
      @click:minute="setTime"
    ></v-time-picker>
  </v-menu>
</template>

<script>
export default {
	data(){
		return {
			menu: false,
			time: null,
		}
	},
	methods: {
		setTime(){
			this.$refs.menu.save(this.time);
			this.$emit("saveTime", this.time)
		}
	},
};
</script>

<style lang="scss" scoped>
</style>