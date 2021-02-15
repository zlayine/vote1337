<template>
  <div class="nav">
    <div class="nav_logo">
      <div class="logo">
				<img :src="logo" alt="1337 logo">
      </div>
      <h1>EATING</h1>
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
import logo from "../assets/1337.svg";

export default {
  data() {
    return {
			logo: logo
		};
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
  },
  methods: {
    logout() {
      this.$store.commit("LOGOUT");
      this.$store.commit("SET_NOTIFICATION", { msg: "Logged out!", error: 0 });
      this.$router.push("/auth");
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
    display: flex;
    flex-direction: row;

    .logo {
      // height: 80%;
      width: 100px;
      margin-right: 15px;
    }
    h1 {
      font-size: 35px;
      margin-top: 17px;
      font-weight: 500;
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
    padding: 0 10px;

    .action {
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

@media (max-width: 768px) {
  .nav {
    .nav_logo {
      margin-left: 10px;

      .logo {
				width: 70px;
        img {
          width: 70px;
        }
      }
      h1 {
				margin-top: 12px;
        font-size: 24px;
      }
    }
  }
}
</style>