<template>
	<view class="use-coupon container">
		<view class="panel">
			<view class="header">
				<image class="logo" :src="picDomain + cardInfo.imgUrl"></image>
				<view class="name">{{ cardInfo.branchName }}</view>
			</view>
			<view style="background-color: #FFFFFF;">
				<view class="main">
					<view class="code">
						<image :src="picDomain + cardInfo.cardCodeUrl" class="img" mode="widthFix"></image>
					</view>
					<view class="qrcode"><image class="img" :src="picDomain + cardInfo.qrCodeUrl"></image></view>
				</view>
				<view class="footer">
					<view v-if="cardInfo.effectiveRemark!=''" >
						有效期：
						<text>{{ cardInfo.effectiveRemark }}</text>
					</view>
					<view>
						可用时段：
						<text>{{ cardInfo.useRangRemark }}</text>
					</view>
				</view>
			</view>
			<view class="footdowm"></view>
		</view>
	</view>
</template>

<script>
export { default } from './useCoupon.js';
</script>

<style lang="less" scoped>
@import url('useCoupon.less');
</style>
