<template>
  <div class="meals-voting">
    <div class="btn-close">
      <v-btn
        class="btn-close"
        color="error"
        v-if="!finish"
        fab
        small
        dark
        @click="closeVoting"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>
    <div class="meals-container">
      <!-- <div class="text-title">{{ meal.name }}</div> -->
      <div class="items_carrousel">
        <div class="item" v-if="finish">
          <transition name="slide-hide">
            <div class="finish">
              <div class="finish-img">
                <img :src="thankyou_img" alt="image thank you" />
              </div>
              <p>
                Thank you for your time! <br />And tell your friends to vote
              </p>
            </div>
          </transition>
        </div>
        <div class="item" v-else>
          <div class="item-title">{{ item.name }}</div>
          <transition name="slide-hide">
            <div :key="item._id" class="image">
              <img
                :src="item.image_url"
                :class="square ? 'square' : 'long'"
                alt="img"
              />
            </div>
          </transition>
          <div class="actions" v-if="!finish">
            <div class="likes" v-if="!report">
              <v-btn
                class="mx-2"
                fab
                dark
                small
                color="error"
                @click="report = true"
              >
                <v-icon dark> fas fa-heart-broken </v-icon>
              </v-btn>
              <v-btn
                class="mx-2"
                fab
                dark
                small
                color="success"
                @click="submitVote('up')"
              >
                <v-icon dark> fas fa-heart</v-icon>
              </v-btn>
            </div>
            <div class="form-report" v-else>
              <div class="message">Tell us why ?</div>
              <textarea v-model="description" rows="3">Description</textarea>
            </div>
            <v-btn
              class="btn-report mt-5 mx-5"
              rounded
              v-if="report"
              color="primary"
              dark
              @click="submitReport()"
            >
              Submit
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
      </div>
    </div>
  </div>
</template>

<script>
import thankyou_img from "../assets/thankyou_img.svg";

export default {
  props: ["meal"],
  data() {
    return {
      report: false,
      item: null,
      current: 0,
      description: null,
      square: true,
      votes: [],
      finish: false,
      thankyou_img: thankyou_img,
    };
  },
  created() {
    if (this.meal) this.setItem();
  },
  methods: {
    nextItem() {
      this.current++;
      this.setItem();
      this.description = null;
      this.report = false;
    },
    submitVote(vote) {
      this.votes.push({
        meal_item_id: this.item._id,
        vote: vote,
        report: "",
      });
      this.nextItem();
    },
    submitReport() {
      this.votes.push({
        meal_item_id: this.item._id,
        vote: "down",
        report: this.description,
      });
      this.nextItem();
      this.description = null;
      this.report = false;
      window.scrollTo(0, 0);
    },
    closeVoting() {
      this.$emit("closeVoting");
    },
    setItem() {
      if (this.current == this.meal.meals.length) this.showFinish();
      else this.item = this.meal.meals[this.current];
      this.description = null;
      this.square = true;
      let img = new Image();
      img.onload = () => {
        if (img.height / img.width > 1) this.square = false;
      };
      img.src = this.item.image_url;
    },
    showFinish() {
      this.finish = true;
      this.item = null;
      setTimeout(async () => {
        await this.$store.dispatch("submitVotes", {
          votes: this.votes,
          meal: this.meal._id,
        });
        this.closeVoting();
      }, 2000);
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
      text-transform: uppercase;
    }

    .items_carrousel {
      display: flex;
      position: relative;

      .item {
        margin: auto;
        width: 400px;
        position: relative;

        .finish {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          margin-top: 20px;
          height: 400px;
          transition: 300ms all;

          .finish-img {
            width: 70%;

            img {
              width: 100%;
            }
          }
          p {
            margin-top: 20px;
            font-size: 18px;
            font-weight: 600;
            padding: 5px;
            text-align: center;
          }
        }

        .image {
          height: 400px;
          margin: auto;
          overflow: hidden;
          display: flex;
          transition: 500ms all;
          justify-content: center;

          .square {
            width: 100%;
            margin: auto;
          }
          .long {
            height: 100%;
            margin: auto;
          }
        }
				
        .item-title {
          font-weight: 700;
          text-transform: uppercase;
          font-size: 25px;
					text-align: center;
					margin-bottom: 15px;
        }

        .actions {
          margin-top: 10px;
          margin-bottom: 10px;
          display: flex;
          flex-direction: column;

          .likes {
            display: flex;
            margin: 10px 5px 0 5px;
            justify-content: space-between;
            transition: 400ms all;

            button {
              padding: 25px;
            }
          }

          .form-report {
            margin: 10px 20px 0 20px;
            transition: 400ms all;
            display: flex;
            flex-direction: column;

            .message {
              font-size: 18px;
              font-weight: 600;
              text-align: center;
            }

            textarea {
              resize: none;
              background-color: #fff;
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
}

@media (max-width: 768px) {
  .meals-voting {
    .meals-container {
      width: 95%;
      overflow: initial;
      margin: 50px auto;

      .items_carrousel {
        .edge {
          display: none;
        }
        .item {
          width: 90%;

          .image {
            height: 300px;
          }
        }
      }
    }
  }
}
</style>