<template>
  <div class="container add-meal">
    <div class="text-title">Adding today's meal</div>
    <form>
      <v-text-field
        v-model="meal_name"
        label="Meal Name"
        class="input mb-3"
        required
        :rules="nameRules"
        outlined
        hide-details
      ></v-text-field>
      <p class="text">Meal items: <span class="hint">(Prefered square images)</span></p>
      <div class="meal-items mb-5">
        <meal-item-form @saved="addItem" ref="empty" />
        <template v-for="(item, index) in items">
          <meal-item-form
            :key="index"
            :index="index"
            :item_data="item"
            @removeItem="removeItem"
          />
        </template>
      </div>
      <div class="actions">
        <v-btn class="mr-4" to="/"> cancel </v-btn>
        <v-btn color="success" @click="submit"> Create meal </v-btn>
      </div>
    </form>
    <DialogItem ref="d" />
  </div>
</template>

<script>
import MealItemForm from "../components/MealItemForm.vue";

export default {
  data() {
    return {
      meal_name: null,
      items: [],
      nameRules: [(v) => !!v || "Name is required"],
    };
  },
  async created() {
    await this.$store.dispatch("checkAddMeal");
    setTimeout(() => {
      if (!this.addMeal && this.$refs.d) this.showDialog();
    }, 1000);
  },
  methods: {
    addItem(data) {
      this.items.push(data);
      this.$refs.empty.clearItem();
    },
    removeItem(index) {
      this.items = this.items.filter((item, i) => {
        if (index != i) return item;
      });
    },
    async submit() {
      if (this.addMeal) {
        if (this.meal_name && this.meal_name != "" && this.items.length) {
          const res = await this.$store.dispatch("addMeal", {
            meal_name: this.meal_name,
            items: this.items,
          });
          if (res) this.$router.push("/");
        } else {
          let msg = "";

          if (this.meal_name == "" || !this.meal_name || this.items.length) {
            this.meal_name = "";
            msg = "Meal name is required!";
          } else msg = "Meal items are required!";
          this.$store.commit("SET_NOTIFICATION", {
            msg: msg,
            error: 1,
          });
        }
      } else this.showDialog();
    },
    async showDialog() {
      await this.$refs.d.open("Information", "Today's meal is already added..");
      this.$router.push("/");
    },
  },
  computed: {
    addMeal() {
      return this.$store.getters.addMeal;
    },
  },
  components: {
    MealItemForm,
    DialogItem: () => import("../components/DialogItem"),
  },
};
</script>

<style lang="scss" scoped>
.add-meal {
  margin-bottom: 100px;

  .text-title {
    font-size: 22px;
    font-weight: 700;
    text-align: center;
    margin-bottom: 25px;
  }

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
    transition: all 200ms;
  }

  .text {
    font-weight: 600;
    font-size: 19px;
    margin: 0;
    padding-left: 10px;

		.hint {
			font-size: 12px;
			color: #3d3d3d;
		}
  }

  .input {
    width: 300px;
  }
}

@media (max-width: 768px) {
  .add-meal {
    .input {
      width: 100%;
    }

    .actions {
      display: flex;
      justify-content: space-between;

      button {
        font-weight: 600;
      }
    }
  }
}
</style>