<!-- 作者:于大明 -->
<template>
	<!-- 产品类型组件 -->
	<view class="yyt-product-type bg-white py-1 font-24">
		<swiper
			:class="{
				'swiper-single-height': typeItems.length <= 4,
				'swiper-mutil-height': typeItems.length > 4
			}"
			:current="currentPageIndex"
			:indicator-dots="mutilTypeItems.length > 1"
			:autoplay="false"
			indicator-active-color="#0285f9"
		>
			<swiper-item v-for="(mutilTypeItem, mutilIndex) in mutilTypeItems" :key="mutilIndex">
				<view class="swiper-item row">
					<view
						class="span-5 d-flex flex-column pl-3 mt-1 box-s"
						v-for="(item, index) in mutilTypeItem"
						@tap="_onSelctItem(item)"
						:key="index"
					>
						<image
							:src="item.productTypeUrl"
							class="rounded-circle"
							style="width:104rpx;height:104rpx;"
							lazy-load
							mode="scaleToFill"
						></image>
						<view>
							<text class="text-ellipsis d-inline-block" style="max-width: 150rpx;" :class="{ 'select-active': currentSelectItemId == item.id }">
								{{ item.productTypeName }}
							</text>
						</view>
					</view>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
export { default } from './yyt-product-type.js';
</script>

<style lang="less" scoped>
@import url('yyt-product-type.less');
</style>
