<template>
  <div class="meal_section">
    <div class="meal_header">
      <div class="meal_info">
        <div class="meal_title">{{ this.meal.name }}</div>
        <div class="meal_user">{{ this.meal.user.username }} <span class="date">{{this.meal.createdAt | formatDate}}</span></div>
      </div>
      <div class="meal_action" v-if="user && user.staff">
        <div class="reports">
          <v-btn class="my-2" plain color="primary" @click="openReports">
            <v-icon left> mdi-poll </v-icon> Reports
          </v-btn>
        </div>
      </div>
    </div>
    <div class="meal_items_holder">
      <div class="btn-delete" v-if="mealOwner">
        <v-btn icon color="white" @click="deleteMeal">
          <v-icon> mdi-delete </v-icon>
        </v-btn>
      </div>
      <div class="overlay" v-if="!voted"></div>

      <div class="start-vote" v-if="!voted">
        <v-btn x-large rounded color="#2eb9ff" dark @click="openVoting">
          Start voting
        </v-btn>
      </div>

      <div class="meal_items">
        <meal-item
          :key="item._id"
          :item="item"
					@preview="enablePreview"
          v-for="item in this.meal.meals"
        ></meal-item>
      </div>
    </div>
    <ConfirmDialog ref="confirm" />
  </div>
</template>

<script>
import MealItem from "./MealItem.vue";
import moment from "moment";

export default {
  props: ["meal"],
  data() {
    return {
      loading: false,
    };
  },
  created() {},
  methods: {
    openReports() {
      this.$emit("openReports", this.meal._id);
    },
    openVoting() {
      this.$emit("openVoting", this.meal._id);
    },
    async deleteMeal() {
      if (
        await this.$refs.confirm.open(
          "Confirm",
          "Are you sure you want to delete this meal?"
        )
      ) {
        await this.$store.dispatch("deleteMeal", this.meal._id);
        await this.$store.dispatch("checkAddMeal");
      }
    },
		enablePreview(url){
			this.$emit('preview', url);
		}
  },
  computed: {
    currentUser() {
      return this.$store.getters.currentUser;
    },
    user() {
      return this.$store.getters.user;
    },
    voted() {
			// return false;
      if (!this.meal.enabled) return true;
      if (this.currentUser && this.meal.meals[0]) {
        const res = this.meal.meals[0].votes.filter((v) => {
          if (v.user._id == this.currentUser.id) return v;
        });
        if (res.length == 0) return false;
        else return true;
      } else return true;
    },
    mealOwner() {
      if (
        this.meal &&
        this.currentUser &&
        (this.meal.user._id == this.currentUser.id || (this.user && this.user.staff))
      )
        return true;
      return false;
    },
  },
	filters: {
		formatDate(val){
			return moment(String(val)).format('DD/MM/YYYY hh:mm');
		}
	},
  components: {
    MealItem,
    ConfirmDialog: () => import("./ConfirmDialog"),
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
    padding: 0 0px 0 10px;
  }
  .meal_title {
    font-size: 28px;
    font-weight: 700;
    line-height: 28px;
    margin-bottom: 5px;
  }

  .meal_user {
    font-size: 18px;
    font-weight: 700;
    color: grey;

		span {
			font-size: 16px;
			&::before {
				content: "•";
				margin-right: 5px;
			}
		}
  }

  .meal_items_holder {
    margin-top: 10px;
    padding: 10px 10px 0 10px;
    box-shadow: 0px 0px 3px #22222227;
    border-radius: 10px;
    position: relative;
    overflow: hidden;

    .btn-delete {
      position: absolute;
      padding: 5px;
      right: -12px;
      top: -12px;
      border-radius: 40%;
      background-color: red;
      z-index: 50;
      cursor: pointer;
      transition: 200ms all;
      box-shadow: 0 0 0px #02020220;

      button {
        position: relative;
        bottom: -5px;
        left: -5px;
      }
    }

    &:hover {
      .btn-delete {
        box-shadow: 0 0 5px #020202ba;
      }
    }

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
			padding-top: 5px;
			padding-left: 5px;
    }
  }
}

@media (max-width: 768px) {
  .meal_section {
    .meal_title {
      font-size: 20px;
			line-height: 20px;
    }

    .meal_user {
      font-size: 14px;

			span {
				font-size: 12px;
			}
    }

    .meal_items_holder {
      .start-vote {
        left: 20%;
      }
    }
    .reports {
      button {
        padding: 0 8px;
        margin-right: 0 !important;
      }
    }
  }
}
</style>