<!-- 优惠券详情 -->
<template>
	<view class="coupons container">
		<view class="panel">
			<navigator
				hover-class="none"
				class="header"
				:url="`/pages/indexSub/shopIntroduce/shopIntroduce?id=${cardInfos.storeID}`"
			>
				<image
					class="logo"
					:src="cardInfos.imgUrl ? picDomain + cardInfos.imgUrl : ''"
					@tap="goShopInfo"
				></image>
				<view class="name">{{ shopName }}</view>
				<!-- <view class="sales" v-if="cardInfos.isNeedBuy">
					销量
					<text>{{ cardInfos.salesCount || 0 }}</text>
					张
				</view> -->
				<image
					src="https://pic.cwyyt.cn/upload/yyticons/181708178_right.png"
					class="main-go-more"
				></image>
			</navigator>
			<view class="amount-wrapper" :style="cardInfos.cardBackgroundUrl?'background-image:url(https://pic.cwyyt.cn'+cardInfos.cardBackgroundUrl + ')':'https://pic.cwyyt.cn/upload/yyticons/171104114_zzy-bg-领取优惠券.png);'">
				<view class="amount">{{ cardInfos.cardName }}</view>
			</view>
			<view class="info-wrapper">
				<view class="available-stores info-item">
					<text class="left-title">可用门店</text>
					<text>{{ cardInfos.useStoreNames }}</text>
				</view>
				<view class="deadline info-item" v-if="cardInfos.effectiveRemark!=''">
					<text class="left-title">有效期</text>
					<text v-if="cardInfos.effectiveRemark">{{ cardInfos.effectiveRemark }}</text>
					<text v-else>{{ startTime }}-{{ endTime }}</text>
				</view>
				<view class="available-time info-item">
					<text class="left-title">可用时段</text>
					<text>{{ cardInfos.useRangRemark }}</text>
				</view>
				<view class="address info-item">
					<text class="left-title">地址</text>
					<text>{{ cardInfos.address }}</text>
				</view>
				<view class="deadline info-item" v-if="cardInfos.productName">
					<text class="left-title">菜品名</text>
					<text>{{ cardInfos.productName }}</text>
				</view>
				<view class="deadline info-item">
					<text class="left-title">使用说明</text>
					<text>{{ cardInfos.carDescRemark||'无' }}</text>
				</view>
			</view>
			<!-- 章（已领取，已购买） -->
			<view class="stamp" v-if="cardInfos.cardStatusEnumValue">
				<!-- 已领取 -->
				<image
					class="img"
					v-if="
						cardInfos.restrictionPerPerson <= 0 &&
							cardInfos.surplusCount > 0 &&
							!cardInfos.isNeedBuy
					"
					src="https://pic.cwyyt.cn/upload/img/20200324/1825592559_already-purchase.png"
				></image>
				<!-- 已购买 -->
				<image
					class="img"
					v-if="
						cardInfos.restrictionPerPerson <= 0 &&
							cardInfos.surplusCount > 0 &&
							cardInfos.isNeedBuy
					"
					src="https://pic.cwyyt.cn/upload/img/20200324/1819201920_already-received.png"
				></image>
			</view>
		</view>
		<view class="bottom-wrapper">
			<view class="d-flex j-sb a-center position-relative">
			<block v-if="!cardStatusEnumValue">
				<form
					report-submit="true"
					@submit="buyCard"
					style="margin:auto;"
					v-if="
					cardInfos.isEnable==1 &&
					expired&&
						cardInfos.restrictionPerPerson > 0 &&
							cardInfos.surplusCount > 0 &&
							cardInfos.isNeedBuy
					"
				>
					<button class="fill" formType="submit">￥{{ cardInfos.buyAmount }}立即购买</button>
				</form>

				<button
					class="fill disable"
					v-if="
						cardInfos.restrictionPerPerson <= 0 &&
							cardInfos.surplusCount > 0 &&
							cardInfos.isNeedBuy
					"
				>
					已购买
				</button>
				<button
					class="fill disable"
					v-if="
						cardInfos.restrictionPerPerson <= 0 &&
							cardInfos.surplusCount <= 0 &&
							cardInfos.isNeedBuy
					"
				>
					已购完
				</button>

				<form
					report-submit="true"
					@submit="getCard"
					style="margin:auto;"
					v-if="
					cardInfos.isEnable==1 &&
					expired&&
						cardInfos.restrictionPerPerson > 0 &&
							cardInfos.surplusCount > 0 &&
							!cardInfos.isNeedBuy
					"
				>
					<button class="fill" formType="submit">领取</button>
				</form>
				<button
					class="fill disable"
					v-if="
						cardInfos.restrictionPerPerson <= 0 &&
							cardInfos.surplusCount > 0 &&
							!cardInfos.isNeedBuy
					"
				>
					已领取
				</button>
				<button
					class="fill disable"
					v-if="
						cardInfos.restrictionPerPerson <= 0 &&
							cardInfos.surplusCount <= 0 &&
							!cardInfos.isNeedBuy
					"
				>
					已领完
				</button>
			</block>
			<block v-else>
				<form
					report-submit="true"
					@submit="goUse"
					style="margin:auto;"
					v-if="cardStatusEnumValue == '正常'"
				>
					<button class="" formType="submit">去使用</button>
				</form>
				<button class="fill disable" v-else>{{ cardStatusEnumValuetext }}</button>
			</block>
			<navigator class="go-my-coipons position-absolute right-0" url="/pages/personalSub/myCoupon/myCoupon" hover-class="none">
				<view>我的优惠券</view>
			</navigator>
			</view>
		</view>
	</view>
</template>

<script>
export { default } from './coupons.js';
</script>

<style lang="less" scoped>
@import url('coupons.less');
</style>
