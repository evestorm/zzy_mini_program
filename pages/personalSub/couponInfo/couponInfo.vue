<template>
	<!-- 优惠券 -->
	<!-- pages/personalSub/couponInfo/couponInfo.wxml -->
	<view class="container">
		<scroll-view class="scroll-user" style="height:100%;" scroll-y="true" :scroll-top="scrollTop" lower-threshold="120">
			<view class="couponInfo" v-if="cardInfos.length">
				<view
					class="coupon_item"
					v-for="(item, index) in cardInfos"
					:key="index"
					:data-couponId="item.smallProgramCardID"
					v-if="(item.timeRestrictionType == 1 && nowDate >= item.beginTime && nowDate <= item.endTime) || item.timeRestrictionType == 2"
				>
					<view class="coupon_top">
						<view class="coupon_name" @tap="goDetail" :data-couponId="item.smallProgramCardID">{{ item.cardName }}</view>
						<view class="tip_handle">
							<view class="tip_handleBtn" v-if="item.restrictionPerPerson > 0 && item.surplusCount > 0">
								<view v-if="item.isNeedBuy" :data-index="index" @tap.stop="goBuy">购买</view>
								<view v-else @tap.stop="goGet" :data-index="index">领取</view>
							</view>
							<view class="disable_coupon" v-else>
								<view v-if="item.isNeedBuy">
									<view v-if="item.surplusCount > 0" :data-index="index">
										<!-- 已购买 -->
										<image
											style="width: 100rpx; height: 100rpx;"
											src="https://pic.cwyyt.cn/upload/img/20200324/1825592559_already-purchase.png"
										></image>
									</view>
									<view v-else :data-index="index">
										<!-- 已购完 -->
										<image
											style="width: 100rpx; height: 100rpx;"
											src="https://pic.cwyyt.cn/upload/img/20200325/1359245924_already-bought.png"
										></image>
									</view>
								</view>
								<view v-else>
									<view v-if="item.surplusCount > 0" :data-index="index">
										<!-- 已领取 -->
										<image
											style="width: 100rpx; height: 100rpx;"
											src="https://pic.cwyyt.cn/upload/img/20200324/1819201920_already-received.png"
										></image>
									</view>
									<view v-else :data-index="index">
										<!-- 已领完 -->
										<image
											style="width: 100rpx; height: 100rpx;"
											src="https://pic.cwyyt.cn/upload/img/20200325/14010212_has-brought.png"
										></image>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="coupon_tip">
						<view class="tip_time" @tap="goDetail" :data-couponId="item.smallProgramCardID">
							<text class="tip_time_date">有效期：{{ item.effectiveRemark | formatRemark }}</text>
							<!-- <text class='vertical_line'></text> -->
							<text class="tip_time_useTime">可用时段：{{ item.useRangRemark }}</text>
						</view>
					</view>
					<view class="coupon_salseInfo" @tap="goDetail" :data-couponId="item.smallProgramCardID">
						<view class="salseInfo_money" v-if="item.isNeedBuy">
							¥
							<text>{{ item.buyAmount | formatMoney }}</text>
						</view>
						<view class="salseInfo_desc" v-else>{{ item.cardUseRemark }}</view>
						<view class="salseInfo_num" v-if="item.isNeedBuy">
							销量
							<text>{{ item.salesCount }}</text>
							张
						</view>
						<view class="salseInfo_num" v-else>
							剩余
							<text>{{ item.surplusCount }}</text>
							张
						</view>
					</view>
				</view>
				<view class="page__bd1">
					<view class="weui-loadmore weui-loadmore_line">
						<view class="weui-loadmore__tips weui-loadmore__tips_in-line">我也是有底线的</view>
					</view>
				</view>
			</view>
			<!-- <view v-else class="noFree">暂无优惠券</view> -->
			<view class="empty-wrapp" v-else>
				<image class="img" src="https://pic.cwyyt.cn/upload/img/20200323/161403143_no-coupon.png" mode=""></image>
				<view class="desc">
					您还没有优惠券哦
				</view>
			</view>
		</scroll-view>
	</view>
</template>
<script src="./couponInfo.js"></script>

<style lang="less" scoped>
@import url('couponInfo.less');
</style>
