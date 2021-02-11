<template>
  <div class="notification">
    <v-snackbar
      :timeout="3000"
      :value="notification"
      top
      :color=" notification == 1 ? 'deep-purple accent-4' : 'red darken-2'"
      elevation="10"
    >
      <div class="text">
        {{ notification_msg }}
      </div>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  computed: {
    notification() {
      return this.$store.getters.notification;
    },
    notification_msg() {
      return this.$store.getters.notification_msg;
    },
  },
};
</script>

<style lang="scss" scoped>
.text {
  font-weight: 600;
  font-size: 16px;
  text-align: center;
}
</style>