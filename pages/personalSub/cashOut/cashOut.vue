<template>
	<view class="cashOut-box">
		<view class="cashOut-title">提现</view>
		<view class="cashOut-input">
			<view>￥</view>
			<input type="number" :placeholder="placeTips" placeholder-style="font-size:24rpx" v-model="amount" @input="checkNum($event)" />
			<view class="cashOut-all" @tap="cashOutAll">全部提现</view>
		</view>
		<view class="cashOut-warn">{{ amount > remain ? '输入的金额超过可提余额' : '' }}</view>
		<view :class="['cashOut-btn', !canCashOut ? 'cashOut-btn-disabled' : '']" @tap="withdrawal">提现</view>
		<view class="cashOut-tips">
			本次提现至微信余额，提现会扣除
			<text class="tip-rate">{{ rate||0 }}%</text>
			手续费，请合理安排。
		</view>
	</view>
</template>

<script>
export { default } from './cashOut.js';
</script>

<style lang="less" scoped>
@import './cashOut.less';
</style>
