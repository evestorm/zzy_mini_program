<template>
	<view class="show-fenxiao-code">
		<!-- 二维码展示、截图区 -->
		<view class="qrcode-wrapper">
			<view class="banner"><image class="img" :src="image" mode="aspectFit"></image></view>
		</view>
	</view>
</template>

<script>
// code=123123213&image=https://pic.cwyyt.cn/upload/img/20191107/1633593359_2019110759151.png
export default {
	data() {
		return {
			image: '' // banner图 https://placekitten.com/300/200
		};
	},
	onLoad(payload) {
		// 获取传过来的二维码code
		// this.val = payload.code;
		this.image = payload.image;
		uni.setNavigationBarTitle({
			title: '分销码展示'
		});
	},
	methods: {}
};
</script>

<style lang="less" scoped>
@import url('./showFenxiaoCode.less');
</style>
