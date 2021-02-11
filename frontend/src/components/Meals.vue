<template>
  <div class="meals_container">
    <!-- <div class="welcome-message">welcome message</div> -->
    <v-card class="add-meal-holder" to="/addmeal" v-if="add_meal_enabler">
      <div class="add-meal">
        <div class="text">ADD TODAY'S MEAL</div>
        <v-btn class="mx-2" fab small color="white">
          <v-icon dark> mdi-plus </v-icon>
        </v-btn>
      </div>
    </v-card>
    <template v-for="meal in meals">
      <meal
        :key="meal._id"
        :meal="meal"
        @openReports="openReports"
        @openVoting="openVoting"
      />
    </template>
    <transition name="fade">
      <meal-item-voting
        v-if="voting"
        :meal="selectedMeal"
        @closeVoting="voting = false"
      />
    </transition>
    <transition name="fade">
      <reports-modal
        v-if="reports"
        :meal="selectedMeal"
        @closeReports="reports = false"
      />
    </transition>
  </div>
</template>

<script>
import Meal from "./Meal.vue";
import ReportsModal from "./ReportsModal.vue";
import MealItemVoting from "./MealItemVoting.vue";
import moment from "moment";

export default {
  data() {
    return {
      reports: false,
      voting: false,
      selectedMeal: null,
    };
  },
  async created() {
    if (this.meals.length > 0) return;
    await this.$store.dispatch("getMeals");
  },
  methods: {
    openReports(id) {
      this.selectedMeal = this.meals.filter((m) => m._id == id)[0];
      this.reports = true;
      window.scrollTo(0, 0);
    },
    openVoting(id) {
      this.selectedMeal = this.meals.filter((m) => m._id == id)[0];
      this.voting = true;
      window.scrollTo(0, 0);
    },
  },
  computed: {
    meals() {
      return this.$store.getters.meals;
    },
    currentUser() {
      return this.$store.getters.currentUser;
    },
    add_meal_enabler() {
      // let now = moment();
      let now = moment(moment("17:45:00", "HH:mm:ss").toDate());
      if (this.meals.length) {
        let mealDate = moment(new Date(this.meals[0].createdAt));
        let mealStart = moment(moment("12:00:00", "HH:mm:ss").toDate());
        let mealToStartDiff = mealDate.diff(mealStart, "minutes");
        if (mealToStartDiff >= 0) {
          mealStart = moment(moment("17:45:00", "HH:mm:ss").toDate());
          mealToStartDiff = mealDate.diff(mealStart, "minutes");
        }
        let nowToStartDiff = now.diff(mealStart, "minutes");
        if (nowToStartDiff >= 0 && mealToStartDiff < 0) {
          return true;
        }
        return false;
      } else {
        let mealStart = moment(moment("12:00:00", "HH:mm:ss").toDate());
        let nowToStartDiff = now.diff(mealStart, "minutes");
        if (nowToStartDiff >= 0 && nowToStartDiff < 4 * 60) return true;
        else {
          mealStart = moment(moment("17:45:00", "HH:mm:ss").toDate());
          nowToStartDiff = now.diff(mealStart, "minutes");
          if (nowToStartDiff >= 0 && nowToStartDiff < 3 * 60) return true;
        }
      }
      return false;
    },
  },
  components: {
    Meal,
    ReportsModal,
    MealItemVoting,
  },
};
</script>

<style lang="scss" scoped>
.meals_container {
	margin-top: 25px;
  .welcome-message {
    text-align: center;
  }
  .add-meal-holder {
    margin: 20px auto;
    width: 80%;
    box-shadow: 0px 0px 7px #22222227;
    border-radius: 28px;
    overflow: hidden;
    background-color: #2eb9ff;
    position: relative;
    cursor: pointer;

    .add-meal {
      padding: 10px;
      font-size: 24px;
      padding-bottom: 15px;
      font-weight: 600;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .text {
        text-align: center;
        color: #fff;
      }
    }
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
}

@media (max-width: 768px) {
  .meals_container {
    .add-meal-holder {
      width: 100%;
      border-radius: 20px;
    }
  }
}
</style>