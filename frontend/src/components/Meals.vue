<template>
  <div class="meals_container">
    <div class="welcome-message">welcome message</div>
    <v-card class="add-meal-holder" to="/addmeal">
      <div class="add-meal">
        <div class="text">ADD TODAY'S MEAL</div>
        <v-btn class="mx-2" fab small color="white">
          <v-icon dark> mdi-plus </v-icon>
        </v-btn>
      </div>
    </v-card>
    <meal />
    <meal />
  </div>
</template>

<script>
import Meal from "./Meal.vue";
export default {
  components: {
    Meal,
  },
};
</script>

<style lang="scss" scoped>
.meals_container {
  .welcome-message {
    text-align: center;
  }
  .add-meal-holder {
		margin: 30px auto;
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
}
</style>