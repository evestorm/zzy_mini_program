<template>
	<view>
		<image class="fail_top" src="https://pic.cwyyt.cn/upload/img/20200321/17050454_pay-err.png"></image>
		<view class="fail_mid">支付失败，请重新支付</view>
		<view class="fail_bot" @tap="goTo">返回</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			url: '',
			param: '',
		};
	},
	onLoad(option) {
		let param = option.param ? option.param.replace(/\;/g, '=') : '';
		param = param ? param.replace(/\|/g, '&') : '';
		this.url=option.url ? option.url : '/pages/index/index';
		this.param=param;
	},

	methods: {
		goTo() {
			uni.navigateBack();
			// setTimeout(() => {
			// 	if (this.url == '/pages/index/index') {
			// 		uni.switchTab({
			// 			url: this.url
			// 		});
			// 	} else if (this.url == '/pages/myOrderSub/onLineOrder/onLineOrder') {
			// 		uni.redirectTo({
			// 			url: `${this.url}?${this.param}`
			// 		});
			// 	} else {
					
			// 	}
			// }, 3000);
		},
	}
};
</script>
<style lang="less" scoped>
@import './payFail.less';
</style>
