<template>
  <div class="nav">
    <div class="nav_logo">
      <h1>Navigation</h1>
    </div>
    <div class="nav_actions">
      <div class="action login">login</div>
      <div class="action logout">logout</div>
      <div class="action avatar">Avatar</div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.nav {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	padding: 0 5px;
	height: 60px;
	border-bottom: 1px solid grey;
	margin-bottom: 20px;

	.nav_logo {
		h1 {
			font-size: 30px;
			font-weight: 700;
		}
	}

	.nav_items {
		ul {

			.nav_item {
				text-decoration: none;
				margin-left: 10px;
				font-size: 1rem;
			}
		}
	}

	.nav_actions {
		display: flex;
		
		.action {
			margin-right: 5px;
			cursor: pointer;
		}
	}
}
</style>