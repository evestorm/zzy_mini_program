<!--我的收藏-->
<template>
	<view class="container">
		<yyt-store-item
			v-if="shopInfo.length"
			:item="item"
			v-for="(item, index) in shopInfo"
			:key="index"
			:latitude="latitude"
			:longitude="longitude"
		/>
		<view v-else class="noCollect">
			<image :src="collectPic" class="img"></image>
			<view class="text">您收藏的酒店都会出现在这里</view>
		</view>
	</view>
</template>

<script>
export { default } from './myCollect.js';
</script>

<style lang="less" scoped>
@import '../../index/index.less';
@import './myCollect.less';
</style>
