<template>
	<view class="my-bookings">
		<!-- tabbar -->
		<view class="w-100 pb-3">
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
					:url="`/pages/myOrderSub/bookingInfo/bookingInfo?orderId=${item.customerBookID}`"
				>
					<!-- 简介 -->
					<view class="intro">
						<view class="shop-name">{{ item.shopName }}</view>
						<view class="order-status">
							<!-- {{formatTag(item)}} -->
							{{ item.tag }}
						</view>
						<view class="see-more">
							<image class="img" src="https://pic.cwyyt.cn/upload/yyticons/160957957_下一步@2x.png" mode=""></image>
						</view>
					</view>
					<!-- 详情 -->
					<view class="desc">
						<image class="img" :src="item.shopImg" mode=""></image>
						<view class="order-info">
							<view class="time">
								<image class="img" src="https://pic.cwyyt.cn/upload/yyticons/1630543054_date.png" mode=""></image>
								<view class="date">{{ item.bookDate | parseShortDate }}</view>
								<view class="suffix">{{ item.diningTypeName }}{{ item.bookTime }}</view>
							</view>
							<view class="type" v-if="item.bookOrderTypeName">
								<image class="img" src="https://pic.cwyyt.cn/upload/yyticons/1657425742_banquet.png" mode=""></image>
								<!-- 如果没宴会，加个tip的class -->
								<view class="name">{{ item.bookOrderTypeName }}</view>
							</view>
							<view class="other">
								<view>
									<image class="img" src="https://pic.cwyyt.cn/upload/yyticons/170222222_cs.png" mode=""></image>
									<view class="title">客服经理：</view>
									<view class="name">{{ item.marketerName || '无' }}</view>
								</view>
								<view @tap.stop="callPhone(item.marketerPhone || null)">
									<image class="img" src="https://pic.cwyyt.cn/upload/yyticons/170111111_zzy-电话预定.png" mode=""></image>
									<view class="name">{{ item.marketerPhone || '无' }}</view>
								</view>
							</view>
						</view>
					</view>
					<!-- 动作 -->
					<view class="action">
						<navigator
							hover-class="none"
							hover-stop-propagation="true"
							class="btn"
							v-if="item.tag == '待确定'"
							:url="
								`/pages/myOrderSub/cancelOrder/cancelOrder?id=${item.customerBookID}&shopId=${
									item.storeID
								}`
							"
						>
							取消订单
						</navigator>
						<navigator
							:url="`/pages/myOrderSub/Invite/Invite?id=${item.customerBookID}`"
							hover-class="none"
							hover-stop-propagation="true"
							class="btn blue"
							v-if="
								item.tag == '待使用' ||
									item.tag == '待支付' ||
									item.tag == '已支付' ||
									item.tag == '商户预订单' ||
									!isPayMaterialMoney(item)
							"
						>
							去分享
						</navigator>
						<navigator
							class="btn blue"
							hover-class="none"
							hover-stop-propagation
							v-if="item.tag == '待评价'"
							:url="
								`/pages/myOrderSub/commentsDetail/commentsDetail?id=${
									item.customerBookBookOrderId
								}&shopId=${item.storeID}&salerId=${item.saleId}&salerName=${
									item.marketerName
								}`
							"
						>
							去评价
						</navigator>
					</view>
				</navigator>
			</mescroll-uni>
		</view>
	</view>
</template>

<script>
export { default } from './myBookings.js';
</script>

<style lang="less" scoped>
@import url('myBookings.less');
@import url('../orderCard.less');
</style>
