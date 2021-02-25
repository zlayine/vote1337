<template>
  <div class="container add-meal">
    <div class="overlay" v-show="demo"></div>
    <div class="text-title step0">
      Adding Today's Meal
      <div class="how" @click="startTour">(How ?)</div>
    </div>
    <form>
      <v-text-field
        v-model="meal_name"
        label="Meal Name"
        class="input mb-3 step1"
        required
        :rules="nameRules"
        outlined
        hide-details
      ></v-text-field>
      <p class="text">
        Meal items: <span class="hint">(Prefered square images)</span>
      </p>
      <div class="meal-items mb-5 step2">
        <meal-item-form @saved="addItem" ref="empty" v-if="!demo" />
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
        <v-btn color="success" class="step7" @click="submit">
          Create meal
        </v-btn>
      </div>
    </form>
    <v-tour name="addTour" :steps="steps" :callbacks="myCallbacks">
      <template slot-scope="tour">
        <transition name="fade">
          <v-step
            v-if="tour.steps[tour.currentStep]"
            :key="tour.currentStep"
            :step="tour.steps[tour.currentStep]"
            :previous-step="tour.previousStep"
            :next-step="tour.nextStep"
            :stop="tour.stop"
            :skip="tour.skip"
            :is-first="tour.isFirst"
            :is-last="tour.isLast"
            :labels="tour.labels"
          >
            <template v-if="tour.isFirst">
              <div slot="actions">
                <v-btn
                  dark
                  elevation="0"
                  color="#2eb9ff"
                  class="btn-tour"
                  @click="tour.skip"
                >
                  Skip Tour
                </v-btn>
                <v-btn
                  color="success"
                  elevation="0"
                  class="btn-tour"
                  @click="tour.nextStep"
                >
                  Next
                </v-btn>
              </div>
            </template>
            <template v-else-if="!tour.isLast">
              <div slot="actions">
                <v-btn
                  dark
                  elevation="0"
                  color="#2eb9ff"
                  class="btn-tour"
                  @click="tour.previousStep"
                >
                  Previous
                </v-btn>
                <v-btn
                  color="success"
                  elevation="0"
                  class="btn-tour"
                  @click="tour.nextStep"
                >
                  Next
                </v-btn>
              </div>
            </template>
            <template v-else>
              <div slot="actions">
                <v-btn
                  color="success"
                  elevation="0"
                  class="btn-tour"
                  @click="tour.finish"
                >
                  Finish
                </v-btn>
              </div>
            </template>
          </v-step>
        </transition>
      </template>
    </v-tour>
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
      demo: false,
      nameRules: [(v) => !!v || "Name is required"],
      myCallbacks: {
        onStart: this.myCustomStartTour,
        onFinish: this.myCustomFinishTour,
        onSkip: this.myCustomFinishTour,
      },
      steps: [
        {
          target: ".step0",
          content:
            "Welcome! Here you can create today's meal. Please make sure you pick the right names and good looking pictures ;)",
          params: {
            placement: "bottom",
          },
        },
        {
          target: ".step1",
          content: "Here you can insert the meal name. ex: Chicken lunch..",
          params: {
            placement: "bottom",
          },
        },
        {
          target: ".step2",
          content: "Here is where the items you have choosed will be displayed",
          params: {
            placement: "bottom",
          },
        },
        {
          target: ".step3",
          content: "You can preview the image you choosed before adding.",
          params: {
            placement: "bottom",
          },
        },
        {
          target: ".step4",
          content: "Choose a name for the meal item. Be creative",
          params: {
            placement: "bottom",
          },
        },
        {
          target: ".step5",
          content: "If you need to crop the image, this tool will help you.",
          params: {
            placement: "bottom",
          },
        },
        {
          target: ".step6",
          content:
            "After finishing the meal item, save it to add a new meal item",
          params: {
            placement: "bottom",
          },
        },
        {
          target: ".step7",
          content:
            "Create the meal so other students can vote for it. Thank you for your time!",
          params: {
            placement: "bottom",
          },
        },
      ],
    };
  },
  async created() {
    await this.$store.dispatch("checkAddMeal");
    setTimeout(() => {
      if (!this.addMeal && this.$refs.d) this.showDialog();
      this.$store.commit("EMIT_NOTIFY_ADDING");
    }, 1000);
  },
  mounted() {
    let tour = localStorage.getItem("tour");
    if (!tour) {
      this.demo = true;
      this.$tours["addTour"].start();
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit("EMIT_NOTIFY_LEAVE");
    next();
  },
  methods: {
    addItem(data) {
      this.items.push(data);
      this.$refs.empty.clearItem();
    },
    removeItem(index) {
			console.log(this.items);
      this.items = this.items.filter((item, i) => {
				if (index == i)
        	console.log(index + " " + i, item);
        if (index != i) return item;
      });
			console.log(this.items);
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
    myCustomStartTour(data) {
      this.items.push({ name: "Tacos", demo: 1, size: 1.4 });
    },
    myCustomFinishTour(data) {
      this.items = [];
      this.demo = false;
      localStorage.setItem("tour", "done");
    },
    startTour() {
      this.demo = true;
      this.$tours["addTour"].start();
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

  .overlay {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background-color: #00000030;
    z-index: 100;
  }

  .text-title {
    font-size: 22px;
    font-weight: 700;
    text-align: center;
    margin-bottom: 25px;

    .how {
      font-size: 14px;
      display: inline;
      cursor: pointer;
      color: #2eb9ff;
    }
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

.btn-tour {
  font-weight: 600;
  margin-right: 10px;
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