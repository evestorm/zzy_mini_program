<template>
	<view class="pay">
		<view class="pay-info">
			<image :src="param.logo" class="logo" mode=""></image>
			<view class="name">{{ param.storeName }}</view>
			<view class="money">￥{{ param.payAmount | formatMoney }}</view>
			<!-- 实付金额 -->
		</view>
		<view class="pay-type" @tap="payStyle = '微信'">
			<image
				src="https://pic.cwyyt.cn/upload/yyticons/160344344_微信支付@2x.png"
				class="pay-logo"
				mode=""
			></image>
			<view class="pay-text">微信支付</view>
			<image
				class="pay-sel ml-auto"
				:src="
					payStyle == '微信'
						? 'https://pic.cwyyt.cn/upload/yyticons/160437437_已选择@2x.png'
						: 'https://pic.cwyyt.cn/upload/yyticons/181307137_未选择@2x.png'
				"
				mode=""
			></image>
		</view>
		<view class="pay-type" @tap="payStyle = param.hyUserAmount >= param.payAmount ? '会员' : '微信'">
			<image
				src="https://pic.cwyyt.cn/upload/yyticons/1813471347_VIP@2x.png"
				class="pay-logo"
				mode=""
			></image>
			<view class="pay-text">会员支付</view>
			<view class="ml-auto">
				<view class="can-pay" v-if="param.hyUserAmount&&param.hyUserAmount >= param.payAmount">
					<text>余额￥</text>
					<text class="num">{{ param.hyUserAmount | formatMoney }}</text>
				</view>
				<text class="not-pay" v-else>余额不足</text>
			</view>
			<image
				class="pay-sel ml-3"
				:src="
					payStyle == '会员'
						? 'https://pic.cwyyt.cn/upload/yyticons/160437437_已选择@2x.png'
						: 'https://pic.cwyyt.cn/upload/yyticons/181307137_未选择@2x.png'
				"
				mode=""
			></image>
		</view>
		<view class="buttom-btn" @tap="payOrder"><view class="btn">确认支付</view></view>
	</view>
</template>

<script>
export { default } from './onlinePay.js';
</script>
<style lang="less" scoped>
@import './onlinePay.less';
</style>
