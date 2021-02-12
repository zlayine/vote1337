<template>
  <div class="meals_container">
    <!-- <div class="welcome-message">welcome message</div> -->
    <v-card class="add-meal-holder" to="/addmeal" v-if="addMeal">
      <div class="add-meal-img">
        <img :src="add_meal_img" alt="add meal image" />
      </div>
      <div class="add-meal">
        <div class="text">ADD TODAY'S MEAL</div>
        <v-btn class="mx-2" fab small color="#2eb9ff">
          <v-icon dark color="white"> mdi-plus </v-icon>
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
import add_meal_img from "../assets/addmeal_img.svg";

export default {
  data() {
    return {
      reports: false,
      voting: false,
      selectedMeal: null,
      add_meal_img: add_meal_img,
    };
  },
  async created() {
    if (this.meals.length > 0) return;
    await this.$store.dispatch("getMeals");
    await this.$store.dispatch("checkAddMeal");
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
    addMeal() {
      return this.$store.getters.addMeal;
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
  margin-bottom: 100px;
  .welcome-message {
    text-align: center;
  }
  // .add-meal-holder {
  //   margin: 20px auto;
  //   width: 80%;
  //   box-shadow: 0px 0px 7px #22222227;
  //   border-radius: 28px;
  //   overflow: hidden;
  // 	background-color: #cbf5ff;
  //   color: #2eb9ff;
  //   position: relative;
  //   cursor: pointer;

  //   .add-meal {
  //     padding: 10px;
  //     font-size: 24px;
  //     padding-bottom: 15px;
  //     font-weight: 600;
  //     display: flex;
  //     flex-direction: column;
  //     justify-content: center;
  //     align-items: center;

  //     .text {
  //       text-align: center;
  //       // color: #fff;
  //     }
  //   }
  // }

  .add-meal-holder {
    width: 100%;
    height: 300px;
    margin-bottom: 20px;
    border: 4px solid #2eb9ff;
    color: #2eb9ff;
    position: relative;
    cursor: pointer;
    box-shadow: 0px 0px 0px #22222200 !important;
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    flex-direction: row;

    .add-meal-img {
      width: 30%;
      height: 100%;
      position: relative;
      img {
        width: 100%;
        margin-top: 15px;
      }
    }

    .add-meal {
      flex: 1;
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
        // color: #fff;
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
      flex-direction: column;
			
      .add-meal-img {
        width: 60%;
        position: absolute;
        bottom: 0;
        left: 0;
        height: auto;
        margin-top: auto;
      }

      .add-meal {
        flex: 0;
      }
    }
  }
}
</style>