<!-- 邀请函 -->
<template>
	<view class="container">
		<view class="Invite_container">
			<view class="Invite_content" :style="'background-image:url(' + InviteImg + ')'" v-cloak>
				<view class="Invite_content_main">
					<view class="Invite_content_top">
						邀请函
					</view>
					<view class="Invite_content_Info">
						<view class="Invite_content_top_center">
							From:
							<text class="name">{{ orderDetail.customerOrder.customerName }}</text>
						</view>

						<view class="Invite_content_Info-orderType">诚邀您来参加我的<text v-show="orderDetail.customerOrder.shareBookRemark">{{ orderDetail.customerOrder.shareBookRemark}}!</text></view>
						<view class="Invite_content_Info-title">时间:</view>
						<view class="Invite_content_Info_time">
							<text>{{ orderDetail.customerOrder.bookDate }}</text>
							<text>{{ orderDetail.customerOrder.diningTypeName }}</text>
							<text>{{ orderDetail.customerOrder.willArrivedOn }}</text>
						</view>
						<view class="Invite_content_Info-title">
							地点:
						</view>
						<view class="Invite_content_shopInfo">
							<view class="Invite_content_shopInfo_title">{{ orderDetail.store.storeName }}</view>
							<view class="Invite_content_shopInfo_address" @tap="btnMap">
								<text>{{ orderDetail.store.address }}</text>
							</view>
						</view>
						<view class="Invite_content_shopInfo_telPhone" @tap="callPhone">
							<view class="Invite_content_Info-title">客服电话:</view>
							<view class="Invite_content_shopInfo_phone">{{ orderDetail.store.telephone }}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="Invite_content_bottom">
				<view class="weui-btn-area1">

					<button class=" share" open-type="share">转发邀请函</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script src="./Invite.js"></script>
<style lang="less" scoped>
@import './Invite.less';
@import '../../myOrder/orderCard.less';
</style>
