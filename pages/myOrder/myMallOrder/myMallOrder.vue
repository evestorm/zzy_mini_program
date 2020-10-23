<template>
	<view class="my-mall-order">
		<!-- tabbar -->
		<view class="bookings-top w-100 " >
			<view class="bookings-tab-wrapper">
				<view
					class="tab-item"
					v-for="(item, index) in tabArr"
					:key="index"
					@tap="selectTabbar(item, index)"
					:class="item.selected ? 'active' : ''"
				>
					<view class="name">{{ item.name }}</view>
				</view>
			</view>
		</view>
		<!-- 列表 -->
		<view class="list-wrapper">
			<mescroll-uni
				:topbar="true"
				:down="downOption"
				:up="upOption"
				@up="upCallback"
				:top="navFilterBottom"
				:bottom="swBottom"
			>
				<view class="empty-wrapper" v-if="dataList.length == 0">
					<view class="empty-tip">
						<image
							class="img"
							src="https://pic.cwyyt.cn/upload/img/20200310/2017571757_empty-order.png"
							mode=""
						></image>
						<view class="text">您还没有订单哦</view>
					</view>
					<navigator
						open-type="switchTab"
						class="btn d-flex a-center j-center"
						hover-class="none"
						url="/pages/index/index"
					>
						去预订
					</navigator>
				</view>
				<navigator
					class="item"
					v-for="(item, index) in dataList"
					:key="index"
					:url="`/pages/myOrderSub/onLineOrder/onLineOrder?id=${item.id}`"
				>
					<!-- 简介 -->
					<view class="intro">
						<view class="shop-name">{{ item.businessName }}({{ item.branchName }})</view>
						<view class="order-status">
							{{item.orderStatusStr}}
							<!-- {{
								item.orderStatus == 10
									? '待支付'
									: item.orderStatus == 20
									? '待确认'
									: item.orderStatus == 25
									? '待发货'
									: item.orderStatus == 30
									? '待收货'
									: item.orderStatus == 40
									? '已完成'
									: item.orderStatus == 50
									? '已取消'
									: ''
							}} -->
						</view>
						<view class="see-more">
							<image class="img" src="https://pic.cwyyt.cn/upload/yyticons/160957957_下一步@2x.png" mode=""></image>
						</view>
					</view>
					<!-- 详情 -->
					<view class="desc">
						<image class="img" :src="'https://pic.cwyyt.cn' + item.imgUrl" mode=""></image>
						<view class="order-info">
							<view class="money">
								<image class="img" src="https://pic.cwyyt.cn/upload/yyticons/170753753_money.png" mode=""></image>
								<view class="num">￥{{ item.orderPrice | formatMoney }}</view>
							</view>
							<view class="product">
								<image class="img" src="https://pic.cwyyt.cn/upload/yyticons/170942942_product.png" mode=""></image>
								<view class="info">
									<text space="emsp">{{ item.productDetailDesc }}</text>
								</view>
							</view>
							<view class="time">
								<image class="img" src="https://pic.cwyyt.cn/upload/yyticons/1630543054_date.png" mode=""></image>
								<view class="date">{{ item.createTime }}</view>
							</view>
						</view>
					</view>
					<!-- 动作 -->
					<view class="action">
						<view @tap.stop="goPay(item)" class="btn blue" v-if="item.orderStatus == '10'">
							支付
						</view>
						<view @tap.stop="cancelOrder(item)" class="btn blue" v-if="item.orderStatus == '10'">
							取消订单
						</view>
						<view @tap.stop="confirm(item)" class="btn blue" v-if="item.isCanConfirmOrder">
							确认收货
						</view>
					</view>
				</navigator>
			</mescroll-uni>
		</view>
	</view>
</template>

<script>
export { default } from './myMallOrder.js';
</script>

<style lang="less" scoped>
@import url('myMallOrder.less');
@import url('../orderCard.less');
</style>
