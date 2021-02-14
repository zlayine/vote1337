<template>
  <div class="reports_modal">
    <div class="btn-close">
      <v-btn
        class="btn-close"
        color="error"
        fab
        small
        dark
        @click="closeReports"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>
    <div class="reports_container">
      <div class="text-title">Reports for {{ meal.name }}</div>
      <v-item-group class="meals" v-model="selected">
        <div v-for="item in meal.meals" :key="item._id" class="meal-item">
          <v-item v-slot="{ active, toggle }">
            <div @click="toggle" class="meal">
              <meal-item :item="item" small="true"></meal-item>
              <v-btn
                class="btn-check"
                fab
                dark
                small
                :color="active ? 'primary' : 'grey'"
              >
                <v-icon dark> mdi-check-bold </v-icon>
              </v-btn>
            </div>
          </v-item>
        </div>
      </v-item-group>
      <div class="reports">
        <transition name="fade">
          <div
            class="none"
            v-if="
              selected == null || (selected != null && mealReports.length == 0)
            "
          >
            {{
              selected == null
                ? "Please select a meal to show reports.."
                : "No reports for this meal"
            }}
          </div>
        </transition>
        <v-card
          class="report-info"
          elevation="1"
          :key="report._id"
          v-for="report in mealReports"
        >
          <div class="user-data">
            <v-avatar color="primary" class="avatar" size="40">
              <img :src="report.user.image_url" alt="John" />
            </v-avatar>
            <div class="user-name">{{ report.user.username }}</div>
          </div>
          <div class="description">
            {{ report.description }}
          </div>
        </v-card>
        <!-- <div class="text-center" v-if="mealReports && mealReports.length">
          <v-pagination
            v-model="page"
            :length="totalPages"
            :total-visible="7"
            prev-icon="mdi-menu-left"
            next-icon="mdi-menu-right"
            @input="changePage"
          ></v-pagination>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import MealItem from "./MealItem.vue";
export default {
  props: ["meal"],
  data() {
    return {
      selected: null,
      page: 1,
    };
  },
  created() {
    this.$store.dispatch("getReports", this.meal._id);
  },
  methods: {
    closeReports() {
      this.$emit("closeReports");
    },
    async changePage() {
      this.$router.replace({ query: { page: this.page } });
      await this.$store.dispatch("getReports", {
        id: this.meal._id,
        page: page ? page : 1,
      });
    },
  },
  computed: {
    reports() {
      return this.$store.getters.reports;
    },
    mealReports() {
      if (this.selected != null) {
        return this.reports.filter(
          (r) => r.meal_item._id == this.meal.meals[this.selected]._id
        );
      }
      return null;
    },
    
  },
  components: { MealItem },
};
</script>

<style lang="scss" scoped>
.reports_modal {
  position: absolute;
  background-color: #ffffffb9;
  width: 100%;
  height: 100%;
  z-index: 100;
  top: 0;
  left: 0;
  backdrop-filter: blur(10px);

  .btn-close {
    position: fixed;
    top: 15px;
    left: 15px;
  }

  .reports_container {
    display: flex;
    flex-direction: column;
    width: 60%;
    margin: 50px auto;

    .text-title {
      text-align: center;
      font-size: 40px;
      font-weight: 700;
      margin-bottom: 20px;
    }

    .meals {
      display: flex;
      flex-direction: row;
      overflow-x: auto;
      padding: 20px;

      .meal-item {
        .meal {
          cursor: pointer;
          display: flex;
          justify-content: center;
          flex-direction: column;

          .btn-check {
            margin: auto;
            margin-top: 10px;
          }
        }
      }
    }

    .reports {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .none {
        font-size: 20px;
        font-weight: 700;
        text-align: center;
        margin-top: 25px;
      }

      .report-info {
        background-color: #fff;
        border-radius: 10px;
        margin-top: 15px;
        display: flex;
        flex-direction: row;
        transition: 200ms all;

        .user-data {
          padding: 10px;
          display: flex;
          flex-direction: column;
          justify-content: center;

          .avatar {
            margin: 4px auto;
          }
          .user-name {
            margin: 5px auto;
            line-height: 12px;
          }
        }
        .description {
          padding: 10px;
          border-left: 1px solid #e2e2e2af;
        }
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
  .reports_modal {
    .reports_container {
      width: 100%;

      .text-title {
        font-size: 22px;
      }

      .reports {
        padding: 0 5px;
      }
    }
  }
}
</style>