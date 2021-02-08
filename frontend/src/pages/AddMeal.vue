<template>
  <div class="container">
    <form>
      <v-text-field
        v-model="meal_name"
        label="Meal Name"
        class="input mb-3"
        outlined
				hide-details
        required
      ></v-text-field>
      <p class="">Meal items:</p>
      <div class="meal-items mb-5">
        <template v-for="(item, index) in items">
          <meal-item-form :key="item.name" :index="index" :item_data="item" @removeItem="removeItem" />
        </template>
        <meal-item-form @saved="addItem" ref="empty" />
      </div>
      <v-btn class="mr-4" to="/"> cancel </v-btn>
      <v-btn color="primary" @click="submit"> Create meal </v-btn>
    </form>
  </div>
</template>

<script>
import MealItemForm from "../components/MealItemForm.vue";
export default {
  data() {
    return {
      meal_name: null,
      items: [],
    };
  },
  methods: {
    addItem(data) {
      this.items.push(data);
      this.$refs.empty.clearItem();
    },
		removeItem(index) {
			console.log(index)
			this.items = this.items.filter((item, i) => {
				console.log(i)
				if (index != i)
					return item;
			})
		},
		submit() {

		}
  },
  components: {
    MealItemForm,
  },
};
</script>

<style lang="scss" scoped>
.meal-items {
  display: flex;
  flex-direction: row;
  margin: 10px 0;
  padding: 10px;
  box-shadow: 0px 0px 7px #22222227;
  border-radius: 10px;
  position: relative;
  overflow-x: auto;
  overflow-y: hidden;
}

.input {
  width: 300px;
}
</style>