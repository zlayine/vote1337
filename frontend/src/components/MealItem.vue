<template>
  <v-card class="meal_item" elevation="3">
    <div class="item">
      <div class="btn-report">
        <v-btn icon color="white">
          <v-icon dense>mdi-alert</v-icon>
        </v-btn>
      </div>
      <div class="image">
        <img
          src="https://www.flavcity.com/wp-content/uploads/2018/05/healthy-meal-prep-recipes-500x500.jpg"
          alt="img"
        />
      </div>
      <div class="overlay"></div>
      <div class="info">
        <div class="info_title">item title</div>
        <div class="stats">
          <div class="text">-20</div>
          <div class="text">+20</div>
        </div>
        <div class="bar">
          <v-progress-linear
            background-color="success lighten-1"
            color="error"
            value="15"
            height="8"
          ></v-progress-linear>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script>

export default {

};
</script>

<style lang="scss" scoped>
.meal_item {
  min-width: 300px;
  border-radius: 10px;
  margin: 0 10px 0 0;

  .item {
    position: relative;
		overflow: hidden;

		.btn-report {
			position: absolute;
			padding: 5px;
			right: -52px;
			top: -52px;
			border-radius: 40%;
			background-color: red;
			z-index: 20;
			cursor: pointer;
			transition: 200ms all;

			button {
				position: relative;
				bottom: -3px;
				left: -3px;
			}
		}

		// &:hover {
		// 	.btn-report {
		// 		right: -12px;
		// 		top: -12px;
		// 	}
		// }

    .image {
      border-radius: 10px;
      max-height: 300px;
      overflow: hidden;

      img {
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
        #2eb9ffd5,
        rgba(0, 255, 0, 0) 50%,
        transparent 60%
      );
      margin: auto;
    }

    .info {
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
      }
    }
  }
}
</style>