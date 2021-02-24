<template>
  <div class="nav">
    <router-link class="nav_logo" to="/auth">
      <div class="logo">
        <img :src="logo" alt="1337 logo" />
      </div>
      <div class="text">
        <h1>RATE MY</h1>
        <span>PLATE</span>
      </div>
    </router-link>
		
    <div class="nav_actions">
			
			<settings-config v-if="user && user.staff == true" />
      <div class="action" v-if="user">
        <v-avatar color="primary" class="avatar" size="50">
          <img :src="user.image_url" alt="avatar-img" />
        </v-avatar>
        <div class="link" @click="logout">
          <v-icon color="grey" large>mdi-logout</v-icon>
        </div>
      </div>
      <div v-else-if="$route.name != 'auth'">
        <router-link class="link" to="/auth">Login</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import logo from "../assets/1337.svg";
import SettingsConfig from './SettingsConfig.vue'

export default {
  data() {
    return {
      logo: logo,
      dialog: false,
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
	components: {
		SettingsConfig,
	}
};
</script>

<style lang="scss" scoped>
*::selection {
    outline: none;
}
.nav {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 5px;
  height: 80px;
  box-shadow: 0 0 5px #02020270;
	outline: none;

  .nav_logo {
    margin-left: 25px;
    text-decoration: none;
    display: flex;
    flex-direction: row;

    .logo {
      // height: 80%;
      width: 100px;
      margin-right: 15px;
    }
    .text {
      display: flex;
      color: #000;
      margin-top: 30px;

      h1 {
        font-size: 17px;
        font-weight: 500;
        margin-right: 5px;

				span {
					margin-top: 1px;
				}
      }
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
      .text {
        display: flex;
        flex-direction: column;
        margin-top: 5px;
      }
    }
  }
}
</style>