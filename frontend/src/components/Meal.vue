<template>
  <div class="meal_section">
    <div class="meal_header">
      <div class="meal_info">
        <div class="meal_title">Meal for 01-01-2021</div>
        <div class="meal_user">by username</div>
      </div>
      <div class="meal_action">
        <div class="reports">
          <v-btn class="ma-2" plain color="primary" @click="reports = true">
            <v-icon left> mdi-poll </v-icon> Reports
          </v-btn>
        </div>
      </div>
    </div>
    <div class="meal_items_holder">
      <div class="overlay" v-if="!voted && !voting"></div>

      <div class="start-vote" v-if="!voted && !voting">
        <v-btn x-large rounded color="primary" dark @click="voting = !voting">
          Start voting
        </v-btn>
      </div>

      <div class="meal_items">
        <meal-item></meal-item>
        <meal-item></meal-item>
        <meal-item></meal-item>
        <meal-item></meal-item>
        <meal-item></meal-item>
        <meal-item></meal-item>
      </div>
    </div>
    <transition name="fade">
      <meal-item-voting v-if="voting" />
    </transition>
		<transition name="fade">
      <reports-modal v-if="reports" />
    </transition>
  </div>
</template>

<script>
import MealItem from "./MealItem.vue";
import MealItemVoting from "./MealItemVoting.vue";
import ReportsModal from "./ReportsModal.vue"

export default {
  data() {
    return {
      voting: false,
      voted: true,
			reports: false,
    };
  },
  components: {
    MealItem,
    MealItemVoting,
		ReportsModal
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
    line-height: 22px;
  }

  .meal_user {
    font-size: 20px;
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

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>