<template>
  <div class="meals-voting">
    <div class="btn-close">
      <v-btn
        class="btn-close"
        color="error"
        fab
        small
        dark
        @click="closeVoting"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>
    <div class="meals-container">
      <div class="text-title">{{ meal.name }}</div>
      <div class="items_carrousel">
        <div class="edge left"></div>
        <div class="item">
          <transition name="slide-hide">
            <div :key="logo" class="image">
              <img :src="logo" alt="img" />
            </div>
          </transition>
          <div class="actions">
            <div class="likes" v-if="!report">
              <v-btn
                class="mx-2"
                fab
                dark
                small
                color="error"
                @click="submitVote('down')"
              >
                <v-icon dark> mdi-thumb-down </v-icon>
              </v-btn>
              <v-btn
                class="mx-2"
                fab
                dark
                small
                color="success"
                @click="submitVote('up')"
              >
                <v-icon dark> mdi-thumb-up </v-icon>
              </v-btn>
            </div>
            <div class="form-report" v-else>
              <textarea rows="5">Description</textarea>
            </div>
            <v-btn
              class="btn-report mt-5 mx-5"
              rounded
              :color="!report ? 'error' : 'primary'"
              dark
              @click="report ? this.submitReport() : report = true"
            >
              {{ report ? "Submit" : "Report something ?" }}
            </v-btn>
            <v-btn
              v-if="report"
              class="btn-close mx-5"
              color="error"
              fab
              small
              dark
              @click="report = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
        </div>
        <div class="edge right"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["meal"],
  data() {
    return {
      report: false,
      item: null,
      current: 0,
      description: null,
    };
  },
  created() {
    this.setItem();
  },
  methods: {
    nextItem() {
      this.current++;
      this.setItem();
    },
    submitVote(vote) {
      console.log(vote);
      this.nextItem();
    },
    submitReport() {
      this.nextItem();
      this.description = null;
    },
    closeVoting() {
      this.$emit("closeVoting");
    },
    setItem() {
      if (this.current == this.meal.meals.length) this.showFinish();
      else this.item = this.meal.meals[this.current];
			this.description = null;
    },
    showFinish() {
      this.closeVoting();
    },
  },
};
</script>

<style lang="scss" scoped>
.meals-voting {
  position: absolute;
  background-color: #ffffffb9;
  width: 100%;
  height: 100%;
  top: 0;
  z-index: 100;
  left: 0;
  backdrop-filter: blur(10px);

  > .btn-close {
    position: fixed;
    top: 15px;
    left: 15px;
  }

  .meals-container {
    width: 70%;
    margin: 100px auto;
    overflow: hidden;

    .text-title {
      text-align: center;
      font-size: 25px;
      font-weight: 700;
      margin-bottom: 25px;
    }

    .items_carrousel {
      display: flex;
      position: relative;
      .edge {
        position: absolute;
        height: 100%;
        z-index: 50;
        width: 20%;

        &.left {
          background-image: linear-gradient(
            to right,
            #ffffff,
            rgba(0, 255, 0, 0) 50%,
            transparent 60%
          );
        }

        &.right {
          right: 0;
          background-image: linear-gradient(
            to left,
            #fff,
            rgba(0, 255, 0, 0) 50%,
            transparent 60%
          );
        }
      }

      .item {
        margin: auto;
        width: 400px;
        position: relative;

        .image {
          height: 400px;
          overflow: hidden;
          display: flex;
          transition: 500ms all;

          img {
            margin: auto;
            width: 100%;
          }
        }

        .actions {
          margin-top: 10px;
          display: flex;
          flex-direction: column;

          .likes {
            display: flex;
            margin: 10px 15px 0 15px;
            justify-content: space-between;
            transition: 400ms all;
          }

          .form-report {
            margin: 10px 20px 0 20px;
            transition: 400ms all;

            textarea {
              resize: none;
              width: 100%;
              padding: 5px;
              border: 1px solid #dbdbdb;
              outline: none;
              font-size: 18px;
              border-radius: 5px;
            }
          }

          .btn-close {
            margin: 10px 0;
            transition: 200ms all;
            align-self: center;
          }
        }
      }

      // .next,
      // .prev {
      //   width: 200px;
      //   display: flex;
      //   position: relative;

      //   .image {
      //     margin: auto;
      // 		display: flex;
      // 		height: 200px;
      // 		overflow: hidden;
      //     // transition: 500ms all 400ms;

      //     img {
      // 			margin: auto;
      //       width: 100%;
      //     }
      //   }
      // }
      // .next {
      //   right: -120px;
      // }
      // .prev {
      //   left: -120px;
      // }
    }
  }

  .slide-hide-enter-active {
    transform: translateX(205%) scale(0.5) translateY(25%);
  }
  .slide-hide-leave-active {
    position: absolute;
    transform: translateX(-170%) scale(0.5) translateY(25%);
  }
  .slide-hide-enter,
  .slide-hide-leave-to {
    opacity: 0;
  }

  // .slide-appear-enter-active {
  // 	transition: all .3s ease;
  // }
  // .slide-appear-leave-active {
  //   // position: absolute;
  //   // top: 30%;
  // 	transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  // }
  // .slide-appear-enter,
  // .slide-appear-leave-to {
  //   transform: translateX(100%);
  //   opacity: 0;
  // }
}

@media (max-width: 768px) {
  .meals-voting {
    .meals-container {
      width: 80%;
      overflow: initial;
      margin: 50px auto;

      .items_carrousel {
        .edge {
          display: none;
        }
        .item {
          width: 400px;
          .image {
            height: 300px;
          }
        }
      }
    }
  }
}
</style>