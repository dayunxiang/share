<template>
	<el-row class="footer-msg">
		<el-col :span="24">
			<el-card>
				<div>{{con}}</div>
			</el-card>
		</el-col>
	</el-row>
	
</template>

<script>
	export default {
		props: {
			con: {
				type: String
			}
		}
	}
</script>

<style scoped>
	.footer-msg {
		position: fixed;
		right: 0;
		bottom: 0;
		color: #333;
    font-size: 14px;
		z-index: 10;
	}
	.el-card {
		text-align: center;
		background-color: #fff;
	}
</style>
