<!-- 预定详情 -->
<template>
	<view class="booking-info">
		<!-- =================================门店====================================== -->
		<navigator class="hotel" :url="`/pages/indexSub/shopInfo/shopInfo?id=${orderDetail.store.storeID}`">
			<image :src="orderDetail.store.storeLogo" class="hotel-img" mode=""></image>
			<text class="text-info hotel-title">{{ orderDetail.store.storeName }}</text>
			<image src="https://pic.cwyyt.cn/upload/yyticons/160957957_下一步@2x.png" class="right" mode=""></image>
		</navigator>
		<!-- =================================客户====================================== -->
		<view class="customer">
			<view class="customer-top">
				<view class="flex">
					<image src="https://pic.cwyyt.cn/upload/yyticons/163505355_name.png" class="name-icon" mode=""></image>
					<text class="text-info">
						{{ userInfo.fullName ? userInfo.fullName : userInfo.nickName }}
					</text>
				</view>
				<navigator
					class="market"
					v-if="orderDetail.saler.marketerID"
					:url="
						`/pages/common/salesManagerInfo/salesManagerInfo?salesID=${
							orderDetail.saler.marketerID
						}&shopID=${orderDetail.store.storeID}`
					"
				>
					<image :src="orderDetail.saler.imgUrl" class="market-img" mode=""></image>
					<view class="">
						<view class="text-info market-name">{{ orderDetail.saler.name }}</view>
						<view class="more">详情>></view>
					</view>
				</navigator>
			</view>
			<view class="customer-phone" @tap="callPhone">
				<image src="https://pic.cwyyt.cn/upload/yyticons/1628232823_call.png" class="phone-icon" mode=""></image>
				<text class="text-info">{{ orderDetail.customerOrder.customerBookPhone }}</text>
			</view>
			<view class="customer-phone" v-if="orderDetail.customerOrder.customerBookCompany != ''">
				<image src="https://pic.cwyyt.cn/upload/yyticons/163003303_danwei.png" class="gs-icon" mode=""></image>
				<text class="text-info">{{ orderDetail.customerOrder.customerBookCompany }}</text>
			</view>
		</view>
		<!-- =================================商家订单====================================== -->
		<view class="" v-if="customerBookStatus != 1 && orderDetail.customerOrder.masterTableName != ''">
			<view class="top-title">
				<text class="title">商家订单</text>
				<view
					class="tip-bg"
					style="background-image:url('https://pic.cwyyt.cn/upload/img/20200324/120759759_tip-bg.png')"
				>
					{{ tipText }}
				</view>
			</view>
			<view class="shop-order text-info">
				<view class="order-list">
					<image src="https://pic.cwyyt.cn/upload/yyticons/1651205120_pc.png" class="pc-icon" mode=""></image>
					<view class="date">{{ orderDetail.customerOrder.bookDate }}</view>
					<view>
						{{ orderDetail.customerOrder.diningTypeName }}
						{{ orderDetail.customerOrder.willArrivedOn }}
					</view>
					<view class="state">{{ orderDetail.customerOrder.tag }}</view>
				</view>
				<view class="order-list">
					<image src="https://pic.cwyyt.cn/upload/yyticons/1652105210_people.png" class="type-icon" mode=""></image>
					<text>{{ orderDetail.customerOrder.bookOrderTypeName }}</text>
				</view>
				<view class="order-list">
					<image src="https://pic.cwyyt.cn/upload/yyticons/165507557_table.png" class="table-icon" mode=""></image>
					<text class="table-list">{{ tableTists }}</text>
				</view>
			</view>
			<view class="remark">
				<image src="https://pic.cwyyt.cn/upload/yyticons/1643434343_distribution-remark.png" class="remak-icon" mode=""></image>
				<view class="text-info remark-text">{{ orderDetail.customerOrder.bookOrderHabit }}</view>
			</view>
			<view class="money" v-if="orderDetail.customerOrder.fee != 0">
				<image src="https://pic.cwyyt.cn/upload/yyticons/1647144714_money.png" class="money-icon" mode=""></image>
				<view class="text-info">消费</view>
				<view class="count">
					<text class="dw">￥</text>
					<text class="num">{{ orderDetail.customerOrder.fee | formatMoney }}</text>
				</view>
			</view>
		</view>
		<!-- =================================预定信息====================================== -->
		<view class="" v-if="!isAPPOrder">
			<view class="top-title"><text class="title">预定信息</text></view>
			<view class="reserve-info">
				<view class="text-info flex">
					<text space="ensp">{{ orderDetail.customerOrder.customerRemark }}</text>
					<!-- <text>?豪华包房</text>
					<text>?生日派对</text>
					<text>?4-8人</text> -->
					<text
						class="org"
						v-show="orderDetail.customerOrder.tag == '待确定' && customerBookStatus != 2"
					>
						待确定
					</text>
					<text class="org" v-show="orderDetail.customerOrder.tag == '已取消'">已取消</text>
				</view>
				<view class="text-info">
					<view v-if="orderDetail.customerOrder.orderInfoRemark.length != 0">
						<view
							class="order-item"
							v-for="(item, index) in orderDetail.customerOrder.orderInfoRemark"
							:key="index"
						>
							<text space="ensp">{{ item }}</text>
						</view>
					</view>
					<view class="" v-else>
						<text>{{ orderDetail.customerOrder.bookDate }}</text>
						<text>{{ orderDetail.customerOrder.diningTypeName }}</text>
						<text>{{ orderDetail.customerOrder.willArrivedOn }}</text>
					</view>
				</view>
			</view>
			<view class="remark pad-left">
				<image src="https://pic.cwyyt.cn/upload/yyticons/1643434343_distribution-remark.png" class="remak-icon remark-text" mode=""></image>
				<view class="text-info remark-text">{{ orderDetail.customerOrder.remark }}</view>
			</view>
		</view>
		<!-- =================================我的评价====================================== -->
		<view class="" v-if="orderDetail.description.headImg">
			<view class="top-title"><text class="title">我的评价</text></view>
			<view class="evaluate">
				<view class="rate">
					<text class="text-info">总分</text>
					<view class="userComment_msg_grade_rating_stars">
						<text
							class="icon iconfont icon-shoucang1 startRate"
							v-for="(item, index) in orderDetail.description.score"
							:key="index"
						></text>
					</view>
					<!-- <uniRate value="3" size=20 margin=5 disabled :default-color="'#f2f2f2'" :active-color="'#FF4732'"></uniRate> -->
					<text class="text-info right">{{ orderDetail.description.time | parseShortDate }}</text>
				</view>
				<view class="rate-text">{{ orderDetail.description.description }}</view>
				<view class="rate-imgs">
					<block v-for="(item, index) in orderDetail.description.photos" :key="index">
						<image
							class="rate-img"
							:src="item"
							mode="aspectFill"
							@tap="previewImage"
							:data-url="item"
						></image>
					</block>
				</view>
				<view class="shopReply" v-if="orderDetail.description.reply">
					<view class="title">商家回复</view>
					<view class="content">{{ orderDetail.description.reply }}</view>
				</view>
			</view>
		</view>
		<view class="free-btn">
			<navigator
				v-if="orderDetail.customerOrder.tag == '待确定'"
				:url="
					`/pages/myOrderSub/cancelOrder/cancelOrder?id=${customerOrderId}&shopId=${
						orderDetail.store.storeID
					}`
				"
			>
				<button type="primary">取消订单</button>
			</navigator>
			<navigator
				v-if="orderDetail.customerOrder.tag == '待使用'"
				:url="`/pages/myOrderSub/Invite/Invite?id=${customerOrderId}`"
			>
				<button type="primary">去分享</button>
			</navigator>
			<navigator
				v-if="orderDetail.customerOrder.tag == '待评价' || orderDetail.customerOrder.tag == '去评价'"
				:url="
					`/pages/myOrderSub/commentsDetail/commentsDetail?id=${orderId}&shopId=${
						orderDetail.store.storeID
					}&salerId=${orderDetail.saler.marketerID}&salerName=${orderDetail.saler.name}`
				"
			>
				<button type="primary">去评价</button>
			</navigator>
			<!-- <button type="primary" @tap='gotoCommentsDetail' v-show="customerBookStatus==2&&orderDetail.customerOrder.fee!=0&&orderDetail.customerOrder.customerRemark==0">去评价</button> -->
		</view>
	</view>
</template>

<script>
export { default } from './bookingInfo.js';
</script>
<style lang="less" scoped>
@import './bookingInfo.less';
</style>
