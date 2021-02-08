<template>
  <div class="reports_modal">
    <div class="btn-close">
      <v-btn class="btn-close" color="error" fab small dark @click="closeReports">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>
    <div class="reports_container">
      <div class="text-title">Reports for ....</div>
      <v-item-group class="meals" v-model="selected">
        <div v-for="n in 4" :key="n" class="meal-item">
          <v-item v-slot="{ active, toggle }">
            <div @click="toggle" class="meal">
              <meal-item small="true"></meal-item>
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
          <div class="none" v-if="selected == null">
            Please select a meal to show reports..
          </div>
        </transition>
        <v-card class="report-info" elevation="1">
          <div class="user-data">
            <v-avatar color="primary" class="avatar" size="40">
              <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John" />
            </v-avatar>
            <div class="user-name">username</div>
          </div>
          <div class="description">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Incidunt
            quas possimus atque eligendi optio iure laborum beatae, aperiam in
            dolorum aliquid quos fugiat soluta distinctio laboriosam, illum
            laudantium, reprehenderit nobis?
          </div>
        </v-card>
        <v-card class="report-info" elevation="1">
          <div class="user-data">
            <v-avatar color="primary" class="avatar" size="40">
              <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John" />
            </v-avatar>
            <div class="user-name">username</div>
          </div>
          <div class="description">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Incidunt
            quas possimus atque eligendi optio iure laborum beatae, aperiam in
            dolorum aliquid quos fugiat soluta distinctio laboriosam, illum
            laudantium, reprehenderit nobis?
          </div>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
import MealItem from "./MealItem.vue";
export default {
  data() {
    return {
      selected: null,
    };
  },
	methods: {
		closeReports() {
			this.$emit("closeReports");
		}
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