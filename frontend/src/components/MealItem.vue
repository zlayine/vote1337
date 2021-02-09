<template>
  <v-card class="meal_item" :class="{ small: small }" elevation="3">
    <div class="item">
      <div class="image">
        <img
          :src="item.image_url"
          alt="img"
        />
      </div>
      <div class="overlay"></div>
      <div class="info">
        <div class="info_title">{{ item.name }}</div>
        <div class="stats">
          <div class="text">-{{ item.votes_down }}</div>
          <div class="text">+{{ item.votes_up }}</div>
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
    item: Object,
  },
  computed: {
    votePercent() {
      let total = this.item.votes.length;
      return parseInt((total / this.item.votes_down) * 100);
    },
  },
};
</script>

<style lang="scss" scoped>
.meal_item {
  width: 300px;
  border-radius: 10px;
  margin: 0 15px 0 0;

  &.small {
    width: 200px;
  }

  .item {
    position: relative;
		height: 300px;
    overflow: hidden;

    // .btn-report {
    // 	position: absolute;
    // 	padding: 5px;
    // 	right: -52px;
    // 	top: -52px;
    // 	border-radius: 40%;
    // 	background-color: red;
    // 	z-index: 20;
    // 	cursor: pointer;
    // 	transition: 200ms all;

    // 	button {
    // 		position: relative;
    // 		bottom: -3px;
    // 		left: -3px;
    // 	}
    // }

    .image {
      border-radius: 10px;
      // max-height: 300px;
			height: 100%;
      overflow: hidden;

      img {
        // width: 100%;
				width: auto;
				height: 100%;
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
        #2eb9ffd5,
        rgba(0, 255, 0, 0) 50%,
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