<template>
  <div class="container">
    <div class="img">
      <img :src="login_img" alt="login_img" />
    </div>
    <div class="action" v-if="!$route.query.code">
      <v-btn :loading="loading" :disbled="!!$route.query.code" @click="signin">
        Sign in with intra
      </v-btn>
    </div>
  </div>
</template>

<script>
import { login } from "../auth.js";
import login_img from "../assets/login_img.svg";

export default {
  data() {
    return {
      loading: false,
      login_img: login_img,
    };
  },
  created() {
    if (this.currentUser) this.$router.push("/");
    if (this.$route.query.code) this.accessData();
  },
  mounted() {
    this.loading = false;
  },
  methods: {
    signin() {
      this.loading = true;
      if (!this.currentUser) window.location.href = process.env.VUE_APP_AUTH_42;
      else login(this.currentUser.user);
    },
    async listen() {
      this.socket.on("newMealAdded", (data) => {
        this.$store.dispatch("socketGetMeal", data);
      });
      this.socket.on("newVoteAdded", (data) => {
        this.$store.dispatch("socketUpdateMeal", data);
      });
      this.socket.on("mealDeleted", (data) => {
        this.$store.dispatch("socketDeleteMeal", data);
      });
      return 1;
    },
    async joinServer() {
      await this.$store.dispatch("connectSocket", this.currentUser.token);
      if (this.socket) await this.listen();
    },
    async accessData() {
      this.loading = true;
      await this.$store.dispatch("createUser", this.$route.query.code + "");
      await this.joinServer();
      setTimeout(() => {
        this.loading = false;
        this.$router.push("/");
      }, 1500);
    },
  },
  computed: {
    currentUser() {
      return this.$store.getters.currentUser;
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .img {
    margin-top: 40px;
    width: 30%;

    img {
      width: 100%;
    }
  }
  .action {
    margin-top: 25px;

    button {
      text-transform: capitalize;
      font-size: 20px;
      font-weight: 600;
      padding: 20px 50px;
      background-color: #2eb9ff;
      color: #fff;
    }
  }
}

@media (max-width: 768px) {
  .container {
    .img {
      width: 80%;
    }
  }
}
</style>