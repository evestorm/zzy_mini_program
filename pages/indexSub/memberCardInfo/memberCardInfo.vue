<template>
	<!--pages/memberCardInfo/memberCardInfo.wxml-->
	<view class="container">
		<view class="memberCardInfo_desc_txt">
			<view class="desc_text_item">
				<view class="desc_text_title">会员须知</view>
				<view class="desc_text_tip">
					<view class="tip_container">
						<view class="tip_title" style="margin-bottom:10rpx;">特权说明</view>
						<view class="tip_item_desc">{{ memberCardInfo.cardRightRemark }}</view>
					</view>
					<view class="tip_item" v-if="memberCardInfo.isEnableScore == 1 && memberCardInfo.isHaveCard == 1">
						<text class="tip_item_title">积分优惠</text>
						<text class="tip_item_desc">每消费{{ memberCardInfo.cardFeeAmount }}元，赠送{{ memberCardInfo.cardGiveScore }}积分</text>
					</view>
					<view class="tip_item" v-if="memberCardInfo.isEnableScore == 1 && memberCardInfo.isHaveCard == 1">
						<text class="tip_item_title">积分抵扣</text>
						<text class="tip_item_desc">
							每使用{{ memberCardInfo.cardUseScore || '0' }}积分，抵扣{{ memberCardInfo.cardDeductionMoney || '0' }}元
						</text>
					</view>
					<view class="tip_item tip_discoun" v-if="memberCardInfo.isHaveCard == 1">
						<text class="tip_item_title">折扣优惠</text>
						<view class="tip_item_discoun">
							<text class="tip_item_desc" v-for="(item, index) in memberCardInfo.discount" :key="index">
								会员等级{{ item.hyLevelName }},享受折扣{{ item.hyLevelDiscount || '0' }}折
							</text>
						</view>
					</view>
				</view>
			</view>
			<view class="desc_text_item text-between">
				<text class="tip_title">有效日期</text>
				<text class="tip_item_desc">{{ memberCardInfo.effectiveDate }}</text>
			</view>
			<view class="desc_text_item text-between">
				<text class="tip_title">可用时段</text>
				<text class="tip_item_desc">{{ memberCardInfo.availableTime }}</text>
			</view>
			<view class="desc_text_item text-between">
				<text class="tip_title">电话</text>
				<text class="tip_item_desc" :data-phone="memberCardInfo.cardCustomTel || ''" @tap="callPhone">
					{{ memberCardInfo.cardCustomTel || '暂无' }}
				</text>
			</view>
			<view class="desc_text_item text-between">
				<text class="tip_title">可用门店</text>
				<view>
					<view class="tip_item_desc" v-if="memberCardInfo.canUseStore.length == 0">暂无</view>
					<view class="tip_item_desc" v-for="(item, index) in memberCardInfo.canUseStore" :key="index">{{ item }}</view>
				</view>
			</view>
			<view class="desc_text_item">
				<view class="tip_title">商户服务</view>
				<view class="tip">{{ memberCardInfo.cardBusService || '暂无' }}</view>
			</view>
			<view class="desc_text_item ">
				<view class="tip_title">使用须知</view>
				<view class="tip">{{ memberCardInfo.cardUseRemark || '暂无' }}</view>
			</view>
		</view>
		<view class="memberCardInfo_desc_img" v-if="memberCardInfo.photoDescUrl">
			<view class="desc_text_title">会员卡详情</view>
			<navigator :url="`/pages/outUrl/outUrl?marketSetID=${memberCardInfo.marketSetID}&paramValue=${memberCardInfo.hyCardParam}`"> 
				<image mode="aspectFill" :src="memberCardInfo.photoDescUrl"></image>
			</navigator>
		</view>
	</view>
</template>

<script>
export { default } from './memberCardInfo.js';
</script>

<style lang="less" scoped>
@import url('memberCardInfo.less');
</style>
