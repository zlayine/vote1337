<template>
  <div class="nav">
    <div class="nav_logo">
      <h1>Voting 1337</h1>
    </div>
    <div class="nav_actions">
      <div class="action" v-if="user">
        <v-avatar color="primary" class="avatar" size="50">
          <img :src="user.image_url" alt="avatar-img" />
        </v-avatar>
        <div class="link" @click="logout">
          <v-icon color="grey" large>mdi-logout</v-icon>
        </div>
      </div>
      <div v-else>
        <router-link class="link" to="/auth">Login</router-link>
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
  methods: {
    logout() {
      this.$store.commit("LOGOUT");
      this.$store.commit("SET_NOTIFICATION", { msg: "Logged out!", error: 0 });
			this.$router.push("/auth")
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
      display: flex;
      flex-direction: row;

      .avatar {
        cursor: pointer;
        margin-right: 20px;
      }
    }
    .link {
      font-weight: 600;
      text-decoration: none;
      margin-right: 20px;
      font-size: 19px;
      margin: auto;
      cursor: pointer;
    }
  }
}
</style>