<template>
  <div class="meals-voting">
    <div class="meals-container">
      <div class="text-title">Meal title</div>
      <div class="item">
        <div class="image">
          <img
            src="https://www.flavcity.com/wp-content/uploads/2018/05/healthy-meal-prep-recipes-500x500.jpg"
            alt="img"
          />
        </div>
        <div class="actions">
          <div class="d-flex justify-space-between">
            <v-btn class="mx-2" fab dark small color="error">
              <v-icon dark> mdi-thumb-down </v-icon>
            </v-btn>
            <v-btn class="mx-2" fab dark small color="warning">
              <v-icon dark> mdi-emoticon-sick-outline </v-icon>
            </v-btn>
            <v-btn class="mx-2" fab dark small color="success">
              <v-icon dark> mdi-thumb-up </v-icon>
            </v-btn>
          </div>
          <v-btn class="btn-report mt-3" rounded color="error" dark> Report something ? </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.meals-voting {
  position: absolute;
  background-color: #ffffffb9;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  backdrop-filter: blur(2px);

  .meals-container {
    width: 50%;
    margin: 100px auto;

    .text-title {
      text-align: center;
      font-size: 25px;
      font-weight: 700;
      margin-bottom: 25px;
    }

    .item {
      margin: auto;
      width: 400px;

      .image img {
        width: 100%;
      }

			.actions {
				display: flex;
				flex-direction: column;
			}
    }
  }
}
</style>