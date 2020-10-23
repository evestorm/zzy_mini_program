<!--我的优惠券-->
<template>
	<!-- pages/myCoupon/myCoupon.wxml -->
	<view class="container">
		<!-- <uni-nav-bar
			left-icon="back"
			@clickLeft="tapLeftFromNav"
			title="我的优惠券"
			color="#fff"
			background-color="#0184f9"
			:fixed="true"
			:status-bar="true"
			ref="navbarRef"
		></uni-nav-bar> -->
		<scroll-view class="scroll-user" style="height:100%;" scroll-y="true" lower-threshold="120">
			<view class="couponInfo" v-if="cardInfos.length > 0">
				<!-- 下面这行注释掉是因为  v-if="item.branchName" 这个条件，不过现在不需要展示这个branchName了  -->
				<!-- <view class="couponInfo_list" v-for="(item, index) in cardInfos" :key="index" v-if="item.branchName" @tap="goDetail" :data-couponId="item.smallProgramCardID" :data-shopId="item.storeID" :data-cardStatusEnumValue="item.cardStatusEnumValue" :data-cardCodeUrl="item.cardCodeUrl" :data-qrCodeUrl="item.qrCodeUrl" :data-smallProgramCardUserID="item.smallProgramCardUserID"> -->
				<view
					class="couponInfo_list"
					:class="item.cardBackgroundUrl?'bg-opcity':''"
					:style="item.cardBackgroundUrl?'background-image:url(https://pic.cwyyt.cn'+item.cardBackgroundUrl + ')':'background-image:url(https://pic.cwyyt.cn/upload/img/20200324/17080080_coupon-bg.png);'"
					v-for="(item, index) in cardInfos"
					:key="index"
					@tap="chooseCoupon(item)"
					:data-couponId="item.smallProgramCardID"
					:data-shopId="item.storeID"
					:data-cardStatusEnumValue="item.cardStatusEnumValue"
					:data-cardCodeUrl="item.cardCodeUrl"
					:data-qrCodeUrl="item.qrCodeUrl"
					:data-smallProgramCardUserID="item.smallProgramCardUserID"
				>
					<view class="couponInfo_list_top">
						<view class="couponInfo_list_title">
							<!-- 卡卷状态(1,正常;2,已核销;3,已过期) -->
							<view class="couponInfo_list_title_l">
								<image :src="picDomain + item.imgUrl" mode="aspectFill" class="img"></image>
								<view class="couponInfo_list_title_shopInfo">
									<view class="couponInfo_list_title_couponInfo">
										<view class="sw-name">{{ item.cardName }}</view>
										<view class="rule">{{item.carDescRemark}}</view>
									</view>
								</view>
							</view>
							 <!-- 选择优惠券进来的不用展示按钮 -->
							 <!-- {CardStatus}卡卷状态(1,正常;2,已核销;3,已过期;4,已退款) -->
							<view
								class="couponInfo_list_title_r btn"
								v-if="item.cardStatusEnumValue == '正常'&&!selectCoup.storeId"
								@tap.stop="goDetail(item)"
							>
								可使用
							</view>
							<view class="couponInfo_list_title_r" v-else-if="item.cardStatusEnumValue == '已核销'">
								<image
									style="width: 100rpx; height: 100rpx;"
									src="https://pic.cwyyt.cn/upload/img/20200323/1345354535_CONSUMED.png"
									mode=""
								></image>
							</view>
							<view class="couponInfo_list_title_r" v-else-if="item.cardStatus == 4">
								<image
									style="width: 100rpx; height: 100rpx;"
									src="https://pic.cwyyt.cn/upload/20200918/110259259_已退款.png"
									mode=""
								></image>
							</view>
							<view
								class="couponInfo_list_title_r btn"
								style="color:#0084F9;background-color:#BDE6FF;"
								v-else-if="item.isPast"
							>
								已过期
							</view>
						</view>
					</view>
					<view class="couponInfo_list_bottom">
						<view class="couponInfo_list_bottom_switch">
							<view v-if="item.effectiveRemark!=''" class="code" :style="item.cardBackgroundUrl?'color:#fff;':''">有效期：{{ item.effectiveRemark | formatRemark }}</view>
							<view class="code" :style="item.cardBackgroundUrl?'color:#fff;':''">可用时段：{{ item.useRangRemark }}</view>
						</view>
						<view class="is-shopping-usable" v-if="item.isUseShop==1">商城可用</view>
					</view>
				</view>
				<view class="page__bd1">
					<view class="weui-loadmore weui-loadmore_line">
						<view class="weui-loadmore__tips weui-loadmore__tips_in-line">我也是有底线的</view>
					</view>
				</view>
			</view>
			<view class="empty-wrapp" v-else>
				<image
					class="img"
					src="https://pic.cwyyt.cn/upload/img/20200323/161403143_no-coupon.png"
					mode=""
				></image>
				<view class="desc">您还没有优惠券哦</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
export { default } from './myCoupon.js';
</script>
<style lang="less" scoped>
@import './myCoupon.less';
</style>
