<template>
  <div class="meal_section">
    <div class="meal_header">
      <div class="meal_info">
        <div class="meal_title">{{ this.meal.name }}</div>
        <div class="meal_user">{{ this.meal.user.username }}</div>
      </div>
      <div class="meal_action" v-if="user && user.staff">
        <div class="reports">
          <v-btn class="my-2" plain color="primary" @click="openReports">
            <v-icon left> mdi-poll </v-icon> Reports
          </v-btn>
        </div>
      </div>
    </div>
    <div class="meal_items_holder">
      <div class="overlay" v-if="!voted"></div>

      <div class="start-vote" v-if="!voted">
        <v-btn x-large rounded color="primary" dark @click="openVoting">
          Start voting
        </v-btn>
      </div>

      <div class="meal_items">
        <meal-item
          :key="item._id"
          :item="item"
          v-for="item in this.meal.meals"
        ></meal-item>
      </div>
    </div>
  </div>
</template>

<script>
import MealItem from "./MealItem.vue";

export default {
  props: ["meal"],
  data() {
    return {
      loading: false,
    };
  },
  created() {
    // if (this.meal.enabled) this.userVoted();
    // else this.voted = true;
    // this.voted = false;
  },
  methods: {
    openReports() {
      this.$emit("openReports", this.meal._id);
    },
    openVoting() {
      this.$emit("openVoting", this.meal._id);
    },
  },
  computed: {
    currentUser() {
      return this.$store.getters.currentUser;
    },
    user() {
      return this.$store.getters.user;
    },
    voted() {
      if (!this.meal.enabled) return true;
      if (this.currentUser && this.meal.meals[0].votes) {
        const res = this.meal.meals[0].votes.filter((v) => {
          if (v.user._id == this.currentUser.id) return v;
        });
        if (res.length == 0) return false;
        else return true;
      } else return true;
    },
  },
  components: {
    MealItem,
  },
};
</script>

<style lang="scss" scoped>
.meal_section {
  margin-bottom: 25px;
  .meal_header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0 10px;
  }
  .meal_title {
    font-size: 28px;
    font-weight: 700;
    line-height: 28px;
    margin-bottom: 5px;
  }

  .meal_user {
    font-size: 18px;
    font-weight: 700;
    color: grey;
  }

  .meal_items_holder {
    margin-top: 10px;
    padding: 10px 10px 0 10px;
    box-shadow: 0px 0px 7px #22222227;
    border-radius: 10px;
    position: relative;

    .overlay {
      position: absolute;
      top: 0;
      z-index: 30;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ffffff80;
      margin: auto;
      backdrop-filter: blur(2px);
    }

    .start-vote {
      position: absolute;
      z-index: 50;
      left: 40%;
      top: 40%;

      button {
        font-size: 22px;
        font-weight: 600;
      }
    }

    .meal_items {
      display: flex;
      flex-direction: row;
      border-radius: 10px;
      overflow-x: auto;
      padding-bottom: 15px;
    }
  }
}

@media (max-width: 768px) {
  .meal_section {
    .meal_title {
      font-size: 20px;
    }

    .meal_user {
      font-size: 16px;
    }

    .meal_items_holder {
      .start-vote {
        left: 20%;
      }
    }
    .reports {
      button {
        padding: 0;
        margin-right: 0 !important;
      }
    }
  }
}
</style>