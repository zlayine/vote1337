<template>
  <div class="nav">
    <div class="nav_logo">
      <h1>Voting 1337</h1>
    </div>
    <div class="nav_actions">
      <div class="action avatar">
        <v-avatar color="primary" class="avatar" size="50" v-if="user">
          <img :src="user.image_url" alt="avatar-img" />
        </v-avatar>
        <div v-else>
          <router-link to="/auth">Login</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.getters.user;
    },
  },
};
</script>

<style lang="scss" scoped>
.nav {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 5px;
  height: 80px;
  box-shadow: 0 0 5px #02020270;

  .nav_logo {
    margin-left: 25px;
    h1 {
      font-size: 30px;
      font-weight: 700;
    }
  }

  .nav_items {
    ul {
      .nav_item {
        text-decoration: none;
        margin-left: 10px;
        font-size: 1rem;
      }
    }
  }

  .nav_actions {
    display: flex;

    .action {
      margin-right: 5px;
      cursor: pointer;
    }
  }
}
</style>