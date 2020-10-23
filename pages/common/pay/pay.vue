<template>
	<!-- 支付 -->
	<view class="pay-page">
		<view class="logo"><view :style="'background: url(' + payInfo.param.logo + ') 0 0/100% 100% no-repeat;'"></view></view>
		<view class="pay_store">
			<text>{{ payInfo.param.storeName }}</text>
		</view>
		<view class="pay_amount">
			￥
			<text>{{ payInfo.param.payAmount | formatMoney }}</text>
		</view>
		<view class="pay_info">
			<view>
				<text>商品</text>
				<text>
					{{ payInfo.param.productName }}
					<text v-if="payInfo.param.remark">，{{ payInfo.param.remark }}</text>
				</text>
			</view>
			<view>
				<text>订单时间</text>
				<text>{{ payInfo.param.orderTime }}</text>
			</view>
			<view>
				<text>应付金额</text>
				<text class="line_through">￥{{ payInfo.param.relAmount | formatMoney }}</text>
			</view>
			<view>
				<text>实付金额</text>
				<view class="money">￥<text>{{ payInfo.param.payAmount | formatMoney }}</text></view>
			</view>
			<view>
				<text>收款方</text>
				<text>{{ payInfo.param.comName }}</text>
			</view>
			<view>
				<text>支付方式</text>
				<text>微信支付</text>
			</view>
		</view>
		<view class="bottom-btn"><view class="pay_btn" @tap="pay">立即支付</view></view>
	</view>
</template>

<script>
export { default } from './pay.js';
</script>
<style lang="less" scoped>
@import './pay.less';
</style>
