<!--联系我们-->
<template>
	<view class="container">
		<view class="contactSevice" @tap="callPhone">
			<image class="per" :src="servicePer" mode="aspectFill"></image>
			<image class="phone" :src="servicePhone" mode="aspectFill"></image>
			<button type="default">点击咨询</button>
		</view>
	</view>
</template>

<script>
export { default } from './contactService.js';
</script>

<style lang="less" scoped>
@import './contactService.less';
</style>
