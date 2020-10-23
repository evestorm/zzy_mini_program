<template>
	<view class="fenxiao-code">
		<!-- 二维码展示/截图区 -->
		<view class="qrcode-wrapper">
			<canvas class="mini_poster" canvas-id="mini_poster" :style="{ width: canvasW + 'px', height: canvasH + 'px' }"></canvas>
			<view class="qrcode" style="width: 100%; height: 0; text-align: center; overflow: hidden;">
			</view>
		</view>
		<!-- 按钮区 -->
		<view class="btn-wrapper" v-if="!isFromMemberRetail || !isYiHeXiao">
			<button class="sw-btn left" @tap="toSaveImage">保存图片</button>
			<!-- #ifdef MP-WEIXIN -->
			<button class="sw-btn right" :open-type="finished ? 'share' : ''" @tap="showTip">分享给微信好友</button>
			<!-- #endif -->
		</view>
	</view>
</template>

<script>
	export { default } from './fenxiaoCode.js';
</script>

<style lang="less" scoped>
	@import url('./fenxiaoCode.less');
</style>
