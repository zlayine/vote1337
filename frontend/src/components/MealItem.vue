<template>
  <v-card class="meal_item" :class="{ small: small }" elevation="3">
    <div class="item">
      <div class="image">
        <v-img :src="item.image_url">
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
            </v-row>
          </template>
        </v-img>
      </div>
      <div class="overlay" @click="enablePreview"></div>
      <div class="info">
        <div class="info_title">{{ item.name }}</div>
        <div class="stats">
          <div class="text text-error">{{ item.votes_down | vote_text_down }}</div>
          <div class="text text-success">{{ item.votes_up | vote_text_up }}</div>
        </div>
        <div class="bar">
          <v-progress-linear
            background-color="success lighten-1"
            color="error"
            :value="votePercent"
            height="8"
          ></v-progress-linear>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  props: {
    small: String,
    item: Object
  },
  methods: {
    enablePreview() {
      this.$emit("preview", this.item.image_url);
    }
  },
  computed: {
    votePercent() {
      if (this.item) {
        let total = this.item.votes_up + this.item.votes_down;
        if (this.item.votes_down > 0) {
          return parseInt((this.item.votes_down / total) * 100);
        }
			}
			return 0;
    }
  },
  filters: {
    vote_text_up(val) {
      if (val > 0) return "+" + val;
      return val;
    },
    vote_text_down(val) {
      if (val > 0) return "-" + val;
      return val;
    }
  }
};
</script>

<style lang="scss" scoped>
.meal_item {
  width: 300px;
  // overflow: hidden;
  border-radius: 10px;
  margin: 0 15px 0 0;

  &.small {
    width: 200px;
    margin-right: 20px;
    .item {
      height: 200px;
      .image {
        max-width: 200px;
        min-width: 200px;
      }
    }

    .info {
      .info_title {
        font-size: 18px !important;
      }
    }
  }

  .item {
    position: relative;
    height: 300px;
    overflow: hidden;

    .image {
      max-height: 300px;
      height: 100%;
      max-width: 300px;
      min-width: 300px;
      display: flex;

      img {
        margin: auto;
        width: 100%;
      }
    }

    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: linear-gradient(
        to top,
        #2eb9ff,
        #2eb9ff00 50%,
        transparent 60%
      );
      margin: auto;
    }

    .info {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      .info_title {
        position: absolute;
        left: 5px;
        bottom: 40px;
        font-weight: 700;
        text-transform: uppercase;
        font-size: 22px;
        color: #fff;
      }

      .stats {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 10px;
        display: flex;
        justify-content: space-between;
        margin: 0px 8px;
        .text {
          color: #fff;
          font-size: 20px;
          font-weight: 700;
          // &.text-error {
          // 	color: #ff5252;
          // }

          // &.text-success {
          // 	color: #53d857;
          // }
        }
      }

      .bar {
        border-radius: 10px;
        overflow: hidden;
        position: relative;
        z-index: 21;
      }
    }
  }
}
</style>