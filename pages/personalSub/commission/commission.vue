<template>
	<view class="commission-page">
		<view class="customer-top">
			<view class="customer-top-info">
				<image class="head-img" :src="userInfo.headImg" mode=""></image>
				<view class="">
					<view class="name">{{ userInfo.nickName }}</view>
					<view class="phone">手机号：{{ userInfo.phone }}</view>
				</view>
			</view>
			<view class="doMoney">
				<view class="money">
					<view class="text">我的佣金(￥)</view>
					<view class="num">{{ allShareMoney | formatMoney }}</view>
				</view>
			</view>
		</view>
		<view class="info">
			<view class="info-list" v-for="(item, index) in userShareMoneyInfos" :key="index">
				<view class="list-left">
					<view class="title">{{ item.description }}</view>
					<view class="time">{{ item.createTime }}</view>
				</view>
				<view class="right">+{{ item.amount }}</view>
			</view>
		</view>
	</view>
</template>

<script>
export { default } from './commission.js';
</script>
<style lang="less" scoped>
@import './commission.less';
</style>
