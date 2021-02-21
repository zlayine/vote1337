<template>
  <div class="meals_container">
    <filter-layout @changeDate="fetchMeals" @changeCampus="fetchMeals" />
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
    <!-- <div class="none" v-if="!meals.length && !addMeal"> -->
    <div class="none" v-if="displayNone">
      <div class="text text-center" v-if="displayNone">
        Next meal will be available at: {{ getDisplayText }}
      </div>
      <div class="image">
        <img :src="nomeals_img" alt="no meals" />
      </div>
    </div>
    <transition-group name="fade-out">
      <meal
        :key="meal._id"
        :meal="meal"
        v-for="meal in meals"
        @openReports="openReports"
        @preview="enablePreview"
        @openVoting="openVoting"
      />
    </transition-group>

    <div class="text-center" v-if="!addMeal || meals.length">
      <v-pagination
        v-model="page"
        :length="totalPages"
        :total-visible="7"
        prev-icon="mdi-menu-left"
        next-icon="mdi-menu-right"
        @input="changePage"
      ></v-pagination>
    </div>
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
    <transition name="fade">
      <image-preview
        v-if="preview"
        :image="preview"
        @closePreview="preview = null"
      />
    </transition>
  </div>
</template>

<script>
import Meal from "./Meal.vue";
import ReportsModal from "./ReportsModal.vue";
import MealItemVoting from "./MealItemVoting.vue";
import ImagePreview from "./ImagePreview.vue";
import FilterLayout from "./Filter.vue";
import add_meal_img from "../assets/addmeal_img.svg";
import notfound_img from "../assets/notfound_img.svg";
import moment from "moment";

export default {
  data() {
    return {
      reports: false,
      voting: false,
      selectedMeal: null,
      add_meal_img: add_meal_img,
      page: 1,
      nomeals_img: notfound_img,
      preview: null,
      campus: null,
      date: [],
    };
  },
  async created() {
    if (this.meals.length > 0) return;
    let page = this.$route.query.page;
    this.campus = this.user ? this.user.campus : this.currentUser.campus;
    await this.$store.dispatch("checkAddMeal", this.campus);
    if (!page) this.$router.replace({ query: { page: 1 } });
    await this.fetchMeals({ page: page ? page : 1, campus: this.campus });
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
    async changePage() {
      this.$router.replace({ query: { page: this.page } });
      await this.fetchMeals({
        page: this.page,
        campus: this.campus,
        date: this.date,
      });
      window.scrollTo(0, 0);
    },
    enablePreview(url) {
      this.preview = url;
    },
    async fetchMeals(data) {
      if (data.date) this.date = data.date;
      else data.date = this.date;
      this.campus = data.campus;
      await this.$store.dispatch("getMeals", data);
      await this.$store.dispatch("checkAddMeal", this.campus);
    },
    getMealTimeDiff() {
      let now = moment();
      // now = moment(moment("16:00:00", "HH:mm:ss").toDate());
      if (this.meals.length) {
        let lastMeal = moment(new Date(this.meals[0].createdAt));
        let diff = now.diff(lastMeal, "hours");
        if (diff < 3 && diff >= 0) return 0;
      }
      let mealStart = moment(moment("11:00:00", "HH:mm:ss").toDate());
      let nowToStartDiff = now.diff(mealStart, "hours");
      if (nowToStartDiff == 0) return 1;
      else if (nowToStartDiff > 0) {
        mealStart = moment(moment("16:45:00", "HH:mm:ss").toDate());
        nowToStartDiff = now.diff(mealStart, "hours");
        if (nowToStartDiff == 0) return 2;
      }
      return 0;
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
    totalPages() {
      return this.$store.getters.mealTotalPages;
    },
    user() {
      return this.$store.getters.user;
    },
    displayNone() {
      let diff = this.getMealTimeDiff();
      // console.log(diff);
      if (this.addMeal) return false;
      if (diff) return true;
    },
    getDisplayText() {
      if (this.getMealTimeDiff() == 1) return "12:00";
      return "17:45";
    },
  },
  components: {
    Meal,
    ReportsModal,
    MealItemVoting,
    ImagePreview,
    FilterLayout,
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

  .none {
    width: 70%;
    margin: auto;
    .image {
      width: 30%;
      margin: auto;
      margin-bottom: 20px;
      img {
        width: 100%;
      }
    }

    .text {
      font-size: 18px;
      margin-bottom: 15px;
    }
  }

  .add-meal-holder {
    width: 100%;
    max-height: 300px;
    min-height: 300px;
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
    margin-top: 0px;

    .none .image {
      width: 70%;
    }
    .add-meal-holder {
      // margin-top: 20px;
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
        position: relative;
      }
    }
  }
}
</style>