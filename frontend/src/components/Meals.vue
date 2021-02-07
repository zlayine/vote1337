<template>
  <div class="meals_container">
    <div class="title">Meals</div>
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
	
	.title {
		text-align: center;
		font-weight: 700;
		font-size: 30px;
		margin-bottom: 10px;
	}
}
</style>