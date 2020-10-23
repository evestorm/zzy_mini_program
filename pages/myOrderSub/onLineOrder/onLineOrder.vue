<!-- 线上订单 -->
<template>
	<view class="pt-3">
		<map
			class="map"
			v-if="showMap"
			style="width: 100%; height: 300px;"
			id="container"
			:longitude="orderInfo.orderUserAddressX"
			:latitude="orderInfo.orderUserAddressY"
			scale="16"
			:markers="markers"
			:include-points="points"
		></map>
		<!-- ========================================订单状态================================================== -->
		<view class="order-status d-flex a-center j-sb" @tap="showSteps = true">
			<view class="order-status-left">
				<image :src="orderStatus.payImg" :class="'img' + orderStatus.orderStatus" mode=""></image>
				<text class="font-weight">{{ orderInfo.orderSendStatusStr }}</text>
				<image src="https://pic.cwyyt.cn/upload/yyticons/181708178_right.png" mode="" class="right-icon"></image>
			</view>
			<view class="go-pay" v-show="orderInfo.orderStatus == 10" @tap.stop="goPay">去支付</view>
			<view class="cal-btn" v-show="orderInfo.orderStatus == 30 && orderInfo.orderSendStatus >= 30 && orderInfo.orderSendStatus < 40" @tap="showMap = true">
				查看骑手位置
			</view>
		</view>
		<!-- ========================================配送方式：自提、配送============================================= -->
		<view class="d-flex j-sb a-center bg-white car-pad p-3">
			<image src="https://pic.cwyyt.cn/upload/yyticons/1640434043_distribution-car.png" mode="" class="car-img"></image>
			<text class="left-title">配送方式</text>
			<!-- 只有在配送之后的才有是谁配送 -->
			<text class="ml-auto right-text" v-if="orderInfo.orderStatus >= 30">
				{{
					orderInfo.orderSendType == '1'
						? '自提'
						: orderInfo.orderSendDetailType == 10
						? '商城配送'
						: orderInfo.orderSendDetailType == 20
						? '团长配送'
						: orderInfo.orderSendDetailType == 30
						? '蜂鸟配送'
						: orderInfo.orderSendDetailType == 40
						? '达达配送'
						: '配送'
				}}
			</text>
			<text class="ml-auto right-text" v-if="orderInfo.orderStatus < 30">{{ orderInfo.orderSendType == '1' ? '自提' : '配送' }}</text>
		</view>
		<view class="distribution-info d-flex a-center j-sb" v-if="orderInfo.orderSendType != 1 && orderInfo.orderStatus >= 30 && orderInfo.orderStatus <= 40">
			<view class="d-flex a-center">
				<image src="https://pic.cwyyt.cn/upload/yyticons/164109419_distribution-people.png" class="people-img" mode=""></image>
				<text>配送人</text>
			</view>
			<!-- 配送类型明细(10,商城配送;20,团长配送;30,蜂鸟配送;40,达达配送 -->
			<view class="d-flex a-center" v-if="orderInfo.orderSendDetailType == 10 || orderInfo.orderSendDetailType == 20">
				<view class="mr-3" v-if="orderInfo.sendInfo.sendPeopleName">{{ orderInfo.sendInfo.sendPeopleName }}</view>
				<view class="cal-btn" @tap="callPhone">{{ orderInfo.orderSendDetailType == 10 ? '联系商家' : '联系团长' }}</view>
				<!-- <text class="name">{{ orderInfo.sendInfo.sendPeopleName }}</text>
				<text class="tell">{{ orderInfo.sendPeoplePhone }}</text> -->
			</view>
			<view class="d-flex a-center font-28" v-if="orderInfo.orderSendDetailType == 30 || orderInfo.orderSendDetailType == 40">
				<view class="col-3c">{{ orderInfo.sendInfo.sendPeopleName }}</view>
				<view class="cal-btn" @tap="callPhone">联系骑手</view>
			</view>
		</view>
		<view class="distribution-info" v-if="orderInfo.orderSendType != 1 && orderInfo.orderStatus >= 30 && orderInfo.orderStatus <= 40">
			<image src="https://pic.cwyyt.cn/upload/yyticons/104003403_送达时间@2x.png" class="time-img" mode=""></image>
			<text>送达时间</text>
			<!-- <text class="font-28 col-3c " space="emsp">
				{{ orderInfo.storeSendTimeRemark }}
			</text> -->
			<text class="font-28 col-3c ml-auto font-weight">{{ orderInfo.sendInfo.sendTime }}</text>
		</view>
		<!-- ========================================订单收货人信息============================================= -->
		<view class="order-consignee d-flex">
			<image src="https://pic.cwyyt.cn/upload/yyticons/1132173217_收货地址@2x.png" mode="" class="img"></image>
			<view class="">
				<view class="list">
					<text class="name font-28 col-3c font-weight">{{ orderInfo.orderUserName }}</text>
					<text>{{ orderInfo.orderUserPhone }}</text>
				</view>
				<view class="mt-2 font-28 col-3c" style="line-height: 40rpx;" v-if="orderInfo.orderSendType != 1">{{ orderInfo.orderUserAddress }}</view>
			</view>
		</view>
		<!-- ========================================订单内容============================================= -->
		<view class="order-info">
			<navigator class="hotel" hover-class="none" :url="`/pages/indexSub/orderFood/orderFood?storeId=${orderInfo.buUnitGUID}`">
				<image :src="'https://pic.cwyyt.cn' + orderInfo.imgUrl || 'https://pic.cwyyt.cn/upload/img/20200331/1620282028_hotel.png'" mode="" class="hotel-img"></image>
				<text class="hotel-title" v-show="orderInfo.businessName">{{ orderInfo.businessName }}({{ orderInfo.branchName }})</text>
				<image src="https://pic.cwyyt.cn/upload/yyticons/160957957_下一步@2x.png" mode="" class="arrow-right"></image>
			</navigator>
			<view class="order-list">
				<view class="order-list-item a-start" v-for="(item, index) in foodList" :key="index">
					<image :src="item.productUrl || 'https://pic.cwyyt.cn/upload/img/20200331/1618591859_food.png'" mode="" class="food-img"></image>
					<view class="flex-1 d-flex j-sb a-end">
						<view class="">
							<view class="item-name">{{ item.productName }}</view>
							<view class="item-price">
								<text>￥</text>
								<text class="price">{{ item.productPrice | formatMoney }}</text>
								<text class="except">/</text>
								<text>{{ item.productUnit }}</text>
							</view>
						</view>
						<view class="item-num">
							<text>X</text>
							<text>{{ item.productNums }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- ========================================订单配送信息============================================= -->
		<view class="deliver-info">
			<view class="mar-top">
				<!-- <view class="deliver-list car-pad">
					<image src="https://pic.cwyyt.cn/upload/yyticons/1640434043_distribution-car.png" mode="" class="car-img"></image>
					<text class="list-title">配送方式</text>
					<text class="list-right remark">
						{{ orderInfo.orderSendType == '1' ? '自提' : orderInfo.sendPeopleGUID == '' ? '商家配送' : '团长配送' }}
					</text>
				</view> -->
				<!-- 优惠券优惠信息 -->
				<view class="deliver-list pt-3 pb-2 car-pad" v-if="orderInfo.orderCouponInfo && orderInfo.orderCouponInfo.smallProgramCardUserID">
					<image src="https://pic.cwyyt.cn/upload/yyticons/15090898_优惠券 .png" mode="" class="coupon-img"></image>
					<text class="list-title">{{ orderInfo.orderCouponInfo.cardName }}</text>
					<text class="list-right remark">-￥{{ orderInfo.couponSubAmount }}</text>
				</view>
				<!-- 会员卡打折信息 -->
				<view class="deliver-list pt-3 pb-2 car-pad" v-if="orderInfo.hyCardInfo && orderInfo.hyCardInfo.hyUserCardID">
					<image src="https://pic.cwyyt.cn/upload/yyticons/15090898_优惠券 .png" mode="" class="coupon-img"></image>
					<text class="list-title">{{ orderInfo.hyCardInfo.hyCardTitle }}</text>
					<text class="list-right remark">-￥{{ orderInfo.cardSubAmount }}</text>
				</view>
				<!-- 会员卡积分抵扣信息 -->
				<view class="deliver-list pt-3 pb-2 car-pad pl-3" v-if="orderInfo.hyCardInfo && (orderInfo.hyCardInfo.hyUserCardID && orderInfo.cardScoreSubAmount != 0)">
					<text class="list-title ml-4">积分抵扣</text>
					<text class="list-right remark">-￥{{ orderInfo.cardScoreSubAmount }}</text>
				</view>
				<view class="deliver-list remark-pad">
					<image src="https://pic.cwyyt.cn/upload/yyticons/1643434343_distribution-remark.png" mode="" class="remark-img"></image>
					<text class="list-title">留言</text>
				</view>
				<view class="remark" v-if="orderInfo.orderRemark">{{ orderInfo.orderRemark }}</view>
				<view class="no-remark" v-else>客户没有留言~~</view>
			</view>
			<view class="mar-top">
				<view class="deliver-list pay-pad">
					<image src="https://pic.cwyyt.cn/upload/yyticons/1649454945_pay.png" mode="" class="pay-img"></image>
					<text class="list-title">金额</text>
					<view class="list-right">
						<text class="right-rmb">￥</text>
						<text class="right-num">{{ orderInfo.orderOriginalPrice | formatMoney }}</text>
					</view>
				</view>
				<view class="deliver-list fee-pad" v-if="orderInfo.orderPackAmount != 0">
					<image src="https://pic.cwyyt.cn/upload/yyticons/1649454945_pay.png" mode="" class="fee-img"></image>
					<text class="list-title">打包费</text>
					<view class="list-right">
						<text class="right-rmb">￥</text>
						<text class="right-num">{{ orderInfo.orderPackAmount | formatMoney }}</text>
					</view>
				</view>
				<view class="deliver-list fee-pad">
					<image src="https://pic.cwyyt.cn/upload/yyticons/1641314131_distribution-fee.png" mode="" class="fee-img"></image>
					<text class="list-title">运费(不参与优惠)</text>
					<view class="list-right">
						<text class="right-rmb">￥</text>
						<text class="right-num">{{ orderInfo.orderTransAmount | formatMoney }}</text>
					</view>
				</view>
				<view class="deliver-list fee-pad">
					<text class="count">合计</text>
					<view class="list-right">
						<text class="right-rmb">￥</text>
						<text class="total">{{ orderInfo.orderPrice | formatMoney }}</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 底部固定信息、按钮 -->
		<view style="width: 100%;height: 110rpx;box-sizing: border-box;" v-if="orderInfo.orderStatus <= 40"></view>
		<view class="bottom-fixed" v-if="orderInfo.orderStatus <= 30 || orderInfo.isCanConfirmOrder">
			<view class="btn-ilist">
				<view class="cancle btn" v-show="orderInfo.orderStatus == 10 || (orderInfo.orderStatus == 20 && orderInfo.isCancleShopOrderByUser)" @tap="cancleOrder">
					取消订单
				</view>
				<view class="go-pay btn" v-show="orderInfo.orderStatus == 10" @tap="goPay">去支付</view>
				<view class="go-pay btn" v-if="orderInfo.isCanConfirmOrder" @tap="confirm">确认收货</view>
			</view>
		</view>
		<!-- /底部弹出时间轴 -->
		<yyt-steps title="订单跟踪" :stepsLiat="orderInfo.eventLogs" @closeStep="cancleStep" v-if="showSteps"></yyt-steps>
	</view>
</template>
<script>
export { default } from './onLineOrder.js';
</script>
<style lang="less" scoped>
@import './onLineOrder.less';
</style>
