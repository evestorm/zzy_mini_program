<!-- 优惠券详情 -->
<template>
	<view class="coupons container">
		<view class="panel" >
			<!-- 头部 -->
			<navigator :url="`/pages/indexSub/shopIntroduce/shopIntroduce?id=${cardInfo.storeID}`">
				<view class="header">
					<image class="logo" :src="cardInfo.imgUrl ? picDomain + cardInfo.imgUrl : ''"></image>
					<view class="name">{{ shopName }}</view>
					<!-- <view class="sales" v-if="cardInfo.isNeedBuy">
						销量
						<text>{{ cardInfo.receiveCount || 0 }}</text>
						张
					</view> -->
					<image
						src="https://pic.cwyyt.cn/upload/yyticons/181708178_right.png"
						class="main-go-more"
					></image>
				</view>
			</navigator>
			<view class="amount-wrapper" :style="cardInfo.cardBackgroundUrl?'background-image:url(https://pic.cwyyt.cn'+cardInfo.cardBackgroundUrl + ')':'https://pic.cwyyt.cn/upload/yyticons/171104114_zzy-bg-领取优惠券.png);'">
				<view class="amount">{{ cardInfo.cardName }}</view>
				<!-- <view class="desc px-2 ">{{ cardInfo.carDescRemark }}</view> -->
			</view>
			<view class="info-wrapper">
				<view class="available-stores info-item">
					<text class="left-title">可用门店</text>
					<text>{{ cardInfo.useStoreNames }}</text>
				</view>
				<view class="deadline info-item"  v-if="cardInfo.effectiveRemark!=''">
					<text class="left-title">有效期</text>
					<text v-if="cardInfo.effectiveRemark">{{ cardInfo.effectiveRemark }}</text>
					<text v-else-if="cardInfo.startTime">{{ cardInfo.startTime }}-{{ cardInfo.endTime }}</text>
				</view>
				<view class="available-time info-item">
					<text class="left-title">可用时段</text>
					<text>{{ cardInfo.useRangRemark }}</text>
				</view>
				<view class="address info-item">
					<text class="left-title">地址</text>
					<text>{{ cardInfo.address }}</text>
				</view>
				<view class="deadline info-item" v-if="cardInfo.productName">
					<text class="left-title">菜品名</text>
					<text>{{ cardInfo.productName }}</text>
				</view>
				<view class="deadline info-item">
					<text class="left-title">使用说明</text>
					<text>{{ cardInfo.carDescRemark||'无' }}</text>
				</view>
			</view>

			<!-- 章（已领取，已过期） -->
			<view class="stamp">
				<image
					class="img"
					v-if="cardInfo.cardStatusEnumValue == '已核销'"
					src="https://pic.cwyyt.cn/upload/img/20200323/1345354535_CONSUMED.png"
				></image>
				<!-- 已过期 -->
				<image
					class="img"
					v-else-if="cardInfo.isPast"
					src="https://pic.cwyyt.cn//upload/yyticons/151805185_alreadyPast.png"
				></image>
				<!-- 已退款 -->
				<image
					class="img"
					v-else-if="cardInfo.cardStatus == 4"
					src="https://pic.cwyyt.cn/upload/20200918/110259259_已退款.png"
				></image>
				<!-- 已领取 -->
				<image
					v-else
					class="img"
					src="https://pic.cwyyt.cn/upload/img/20200324/1819201920_already-received.png"
				></image>
			</view>
		</view>
		<!-- 弹出图片 -->
		<cover-view class="mask" catchtouchmove="preventTouchMove" v-if="showModal" @tap="showModal = false">
			<cover-view class="modalDlg" v-if="showModal" @tap.stop="">
				<cover-image class="img" :src="shareImgSrc"></cover-image>
				<cover-view class="btn" @tap="shareImg">保存图片</cover-view>
			</cover-view>
		</cover-view>
		<!-- 底部 -->
		<view class="bottom-wrapper">
			<view v-if="isShowShopButton">
				<button  class="fill" @tap="goShop">商城使用</button>
			</view>
			<view v-if="isShowHxButton" >
				<button  class="fill col6" @tap="goUse">线下核销</button>
			</view>
			<!-- 已退款不显示「我的分账码」 -->
			<view v-if="cardInfo.isEnableWxShare && cardInfo.wxShareRate > 0 && cardInfo.cardStatus != 4">
				<button
					class="fill col6"
					@tap="openPopup"
				>
					我的分账码
				</button>
			</view>
		</view>
	</view>
</template>

<script>
export { default } from './couponDetail.js';
</script>

<style lang="less" scoped>
@import url('couponDetail.less');
</style>
