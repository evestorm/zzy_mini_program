<template>
	<view>
		<view class="adContainer"><web-view :src="marketSetUrl"></web-view></view>
	</view>
</template>

<script>
export { default } from './outUrl.js';
</script>
<style lang="less" scoped>
@import url('outUrl.less');
</style>
