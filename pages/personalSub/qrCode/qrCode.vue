<!-- 支付 -->
<template>
	<view class="qrcode">
		<image class="logo" :src="code.logoUrl" role="img"></image>
		<view>向商家出示会员码</view>
		<view class="code_num">
			<text v-for="(item, index) in code.num" :key="index">{{ item }}</text>
		</view>
		<image class="bar_code" :src="code.barCode" role="img"></image>
		<image class="qr_code" :src="code.qrCode" role="img"></image>
		<view style="margin-top:30rpx;">每隔10分钟更新一次</view>
	</view>
</template>

<script>
export { default } from './qrCode.js';
</script>
<style lang="less" scoped>
@import './qrCode.less';
</style>
