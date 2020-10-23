<!--作者:何文韬-->
<template>
	<view class="page-content bg-white d-flex j-center">
		
		<view style="width: 690rpx;">
			<swiper
				class="swiper"
				autoplay
				interval="3000"
				duration="1000"
				current="1"
				indicator-dots
				indicator-color="#FFFFFF"
				indicator-active-color="#0084F9"
				v-if="shopImg.length>1"
			>
				<block v-for="(item, index) in shopImg" :key="index" >
					<swiper-item @tap="redirectoutUrl(item)">
						<image :src="imgserver+item.imgUrl" class="slide-image" mode='aspectFill'></image>
				   </swiper-item>
				</block>
			</swiper>
			<block v-for="(item, index) in shopImg" :key="index"  v-else>
			
					<image :src="imgserver+item.imgUrl" @tap="redirectoutUrl(item)" mode='aspectFill' class="slide-image"></image>
			
			</block>
			
		</view>
	</view>
</template>

<script>
export { default } from './yyt-head-banner.js';
</script>

<style lang="less" scoped>
@import url('yyt-head-banner.less');
</style>
