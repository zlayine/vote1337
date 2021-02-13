<template>
  <div class="container">
    <div class="img">
      <img :src="image" alt="" />
    </div>
    <div class="text">There is no food here..seriously</div>
  </div>
</template>

<script>
import notfound_img from "../assets/notfound_img.svg";
export default {
  data() {
    return {
      image: notfound_img,
    };
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .img {
    width: 20%;
    margin-top: 20px;
    margin-bottom: 20px;
    img {
      width: 100%;
    }
  }
  .text {
    font-size: 30px;
    font-weight: 500;
		text-align: center;
  }
}

@media (max-width: 768px) {
  .container {
    .img {
      width: 80%;
    }
  }
}
</style>