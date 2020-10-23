<template>
	<!-- 购买优惠券 -->
	<!-- pages/personalSub/buyCoupon/buyCoupon.wxml -->
	<view class="container">
		<view class="buyCouponInfo_container">
			<view class="buyCouponInfo" v-for="(item, index) in cardInfos" :key="index">
				<view class="buyCoupon_item">
					<text class="buyCouponInfo_title">{{ item.branchName }}</text>
				</view>
				<view class="buyCoupon_item">
					<text class="title">{{ item.cardName }}</text>
					<view class="right"><text class="uni-text-small">¥</text>{{ item.buyAmount | formatMoney }}</view>
				</view>
				<view class="buyCoupon_item">
					<view class="title">数量</view>
					<view class="stepper">
						<text :class="minusStatus + ' caclIcon'" type="number" @tap="bindMinus">-</text>
						<text class="num">{{ num }}</text>
						<text class="caclIcon" @tap="bindPlus">+</text>
					</view>
				</view>
				<view class="buyCoupon_item">
					<text class="title">小计</text>
					<view class="right"><text>¥</text>{{ totalPrice | formatMoney }}</view>
				</view>
			</view>
			<view class="weui-btn-area">
				<form @submit="goBuy" class="formSubmit" report-submit="true"><button class="weui-btn" formType="submit">购买</button></form>
				<!-- <button class="weui-btn" type="" bindtap='goBuy'>购买</button> -->
			</view>
		</view>
	</view>
</template>

<script>
export { default } from './buyCoupon.js';
</script>
<style lang="less" scoped>
@import './buyCoupon.less';
</style>
