<template>
	<view class="container">
		<!-- 顶部选项卡切换 -->
		<view class="parent-tab-wrapper">
			<view class="tab-item"
				v-for="(item, index) in tabArr" :key="index"
				@tap="selectTabbar(item, index)">
				<image class="icon" :src="item.selected ? item.activeIcon : item.icon" mode=""></image>
				<view class="name" :class="item.selected ? 'active' : ''">{{ item.name }}</view>
			</view>
		</view>
		<!-- 订单列表 -->
		<view class="parent-order-wrapper">
			<!-- 预订单 -->
			<view v-if="tabIdx == 0">
				<my-bookings ref="myBookings"></my-bookings>
			</view>
			<!-- 宴会订单 -->
			<view v-if="tabIdx == 1">
				<my-banquet ref="myBanquet"></my-banquet>
			</view>
			<!-- 其他订单 -->
			<view v-if="tabIdx == 2">
				<my-order ref="myOrder"></my-order>
			</view>
			<view v-if="tabIdx == 3">
				<my-mall ref="myMall"></my-mall>
			</view>
		</view>
	</view>
</template>

<!-- <script>
export { default } from './myOrder.js';
</script> -->
<script src="./myOrder.js"></script>

<style lang="less" scoped>
.container {
	width: 100%;
	height: 100%;
	overflow: hidden;
	background: rgba(242, 242, 242, 1);
	position: relative;
}
// 顶部选项卡
.parent-tab-wrapper {
	// position: fixed;
	// left: 0;
	// top: 0;
	width: 100%;
	height: 100rpx;
	background-color: white;
	display: flex;
	justify-content: space-between;
	align-items: center;

	.tab-item {
		width: 160rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.icon {
			width: 54rpx;
			height: 54rpx;
		}
		.name {
			font-size: 20rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(102,106,109,1);
			&.active {
				color: rgba(0, 132, 249, 1);
			}
		}
	}
}
// 订单列表容器
.parent-order-wrapper {
	box-sizing: border-box;
	height: 100vh;
	overflow: hidden;
	
	// & > view {
	// 	height: 100%;
	// }
}
</style>
