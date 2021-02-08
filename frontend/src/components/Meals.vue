<template>
  <div class="meals_container">
    <!-- <div class="welcome-message">welcome message</div> -->
    <v-card class="add-meal-holder" to="/addmeal">
      <div class="add-meal">
        <div class="text">ADD TODAY'S MEAL</div>
        <v-btn class="mx-2" fab small color="white">
          <v-icon dark> mdi-plus </v-icon>
        </v-btn>
      </div>
    </v-card>
    <meal @openReports="reports = true" @openVoting="voting = true"/>
    <meal @openReports="reports = true" @openVoting="voting = true"/>
    <transition name="fade">
      <meal-item-voting v-if="voting" @closeVoting="voting = false" />
    </transition>
    <transition name="fade">
      <reports-modal v-if="reports" @closeReports="reports = false" />
    </transition>
  </div>
</template>

<script>
import Meal from "./Meal.vue";
import ReportsModal from "./ReportsModal.vue";
import MealItemVoting from "./MealItemVoting.vue";

export default {
  data() {
    return {
      reports: false,
			voting: false,
    };
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
  .welcome-message {
    text-align: center;
  }
  .add-meal-holder {
    margin: 20px auto;
    width: 80%;
    box-shadow: 0px 0px 7px #22222227;
    border-radius: 28px;
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