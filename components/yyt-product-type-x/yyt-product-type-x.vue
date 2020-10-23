<!--作者:于大明-->
<template>
	<view class="yyt-product-type-x font-24 position-fixed" style="width: 100vw; z-index:999;top:70rpx">
		<scroll-view scroll-x scroll-with-animation class="scroll-row row bg-white"  :scroll-left="scrollLeft">
			<view class="scroll-row-item row flex-nowrap">
				<view
					class="span-5 d-flex flex-column px-2 mt-1"
					v-for="(item, index) in typeItems"
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
		</scroll-view>
	</view>
</template>

<script>
export { default } from './yyt-product-type-x.js';
</script>

<style lang="less" scoped>
@import url('yyt-product-type-x.less');
</style>
