<!--作者:覃彬-->
<template>
	<view class="">
			<!-- 商品列表 -->
		<view class="yyt-food-menu-list pt-3" v-for="(item, index) in calFoodList" :key="item.id">
			<view class="yyt-food-menu-item d-flex pl-3 a-center bg-white">
				<view class="item-img">
					<image :src="item.productUrl" mode="" @tap="previewImg(item.productUrl)"></image>
				</view>
				<view class="item-mid">
					<view class="food-name font-weight">{{ item.productName }}</view>
					<view class="food-sale-count">月售{{ item.monthSaleCount || 0 }}</view>
					<view class="food-price d-flex a-center">
						<view class="food-now-price line-h">
							<text>￥</text>
							<text class="price">{{ item.productPrice | formatMoney }}</text>
							<text class="except">/</text>
							<text>{{ item.productUnit }}</text>
						</view>
						<view class="food-ago-price">￥{{ item.originalPrice }}</view>
					</view>
				</view>
				<view class="item-by-count ml-auto">
					<view
						class="food-is-sel"
						:style="{ diaplay: item.selected ? 'block' : 'none' }"
						v-if="item.selected == true"
					>
						<image
							src="https://pic.cwyyt.cn/upload/yyticons/160643643_subtract.png"
							class="sel-icon left-icon"
							mode=""
							@tap="_onsub(item)"
						></image>
						<text class="num">{{ item.num }}</text>
						<image
							src="https://pic.cwyyt.cn/upload/yyticons/160632632_add.png"
							class="sel-icon right-icon"
							mode=""
							@tap="_onadd(item)"
						></image>
					</view>
					<image
						src="https://pic.cwyyt.cn/upload/yyticons/16070272_sel.png"
						class="sel-icon is-unsel"
						mode=""
						v-else
						@tap="isSelect(item)"
					></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export { default } from './yyt-food-menu-list.js';
</script>

<style lang="less" scoped>
@import url('yyt-food-menu-list.less');
</style>
