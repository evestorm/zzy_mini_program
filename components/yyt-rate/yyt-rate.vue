<!--作者:于大明-->
<template>
	<view class="yyt-rate line-h">
		<text
			class="icon iconfont icon-shoucang1 ml-1"
			style="color:#e95927"
			v-for="value in myScore"
			:key="value"
		></text>
		<text
			class="icon iconfont icon-shoucang1 ml-1"
			style="color:#e8e8e8"
			v-for="value in 5 - myScore"
			:key="value+5"
		></text>
	</view>
</template>

<script>
export { default } from './yyt-rate.js';
</script>

<style lang="less" scoped>
@import url('yyt-rate.less');
</style>
