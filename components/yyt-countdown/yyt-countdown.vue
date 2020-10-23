<!-- 作者:覃彬 -->
<!-- 定时器 item-->
<template>
	<view class="time-memter" :style="{transform: transform}">
		<view class="time">{{ time.hh || '00' }}</view>
		<view class="unit">:</view>
		<view class="time">{{ time.mm || '00' }}</view>
		<view class="unit">:</view>
		<view class="time">{{ time.ss || '00' }}</view>
	</view>
</template>

<script>
export { default } from './yyt-countdown.js';
</script>

<style lang="less" scoped>
@import url('yyt-countdown.less');
</style>
