<!-- 作者:于大明 -->
<template>
	<navigator  :url="`/pages/indexSub/shopIntroduce/shopIntroduce?id=${item.storeID}`">
		<view class="yyt-store-item row my-2 box-s">
			<view class="item-left col-4 pl-2 pt-2">
				<image class="radius-10" :src="storeItem.imgUrl_Server" mode="aspectFill"></image>
			</view>
			<view class="item-right col-8 my-1">
				<view class="rigth-top">
					<view class="top-left">{{ storeItem.businessName }}({{ storeItem.branchName }})</view>
					<view class="top-right" v-if="storeItem.points">{{ storeItem.points }}km</view>
				</view>
				<view class="rigth-center">
					<view class="center-left"><yyt-rate :score="storeItem.score"></yyt-rate></view>
					<view class="center-right">￥<text class="font-md font-weight">{{ storeItem.avgPrice }}/人</text></view>
				</view>
				<view class="right-bottom">
					<view class="bottom-left">
						<image src="https://pic.cwyyt.cn/upload/yyticons/1132173217_收货地址@2x.png" mode="widthFix"></image>
					</view>
					<view class="bottom-right">{{ storeItem.address }}</view>
				</view>
			</view>
		</view>
	</navigator>
</template>

<script>
export { default } from './yyt-store-item.js';
</script>

<style lang="less" scoped>
@import url('yyt-store-item.less');
</style>
