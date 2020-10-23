<!--作者:覃彬-->
<template>
	<view class="yyt-food-menu" > 
	<!-- style="min-height:calc(100vh - 240upx)" -->
		<!-- 商品类型 -->
		<!-- <view class="groupTitle" v-for="(groupItem, index) in calFoodGroupList" :key="index">
		</view> -->

		<!-- 商品列表 -->
		<view class="yyt-food-menu-list pt-3" v-for="(item, index) in foodList" :key="item.id">
			<view
				class="section mb-1"
				:id="`group-section${item.productTypeGUID}`"
				v-if="
					index== foodList.length ||
						index == 0 ||
						foodList[index - 1].productTypeGUID != foodList[index].productTypeGUID
				"
			>
			
				<uni-section :title="item.productTypeName" type="line" sectionCls="bg-white border-bottom-0"></uni-section>
			</view>

			<view class="yyt-food-menu-item d-flex pl-3 a-center bg-white" v-if="item.id">
				<view class="item-img">
					<image
						class="radius-10"
						:src="item.productUrl"
						mode="aspectFill"
						@tap="previewImg(item.productUrl)"
					></image>
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
						<view class="food-ago-price" v-if="item.originalPrice">￥{{ item.originalPrice }}</view>
						<view class="font-22 ml-1 text-warning" v-if="item.buyMuchCount">限购 {{ item.buyMuchCount }}</view>
					</view>
				</view>

				<view class="item-by-count ml-auto">
					<view class="food-is-sel" :style="{ display: item.selected ? 'flex' : 'none' }">
						<image
							src="https://pic.cwyyt.cn/upload/yyticons/160643643_subtract.png"
							class="sel-icon left-icon"
							mode=""
							@tap="sub(item)"
						></image>
						<text class="num">{{ item.num }}</text>
						<image
							src="https://pic.cwyyt.cn/upload/yyticons/160632632_add.png"
							class="sel-icon right-icon"
							mode=""
							@tap="add(item)"
						></image>
					</view>
					<image
						src="https://pic.cwyyt.cn/upload/yyticons/16070272_sel.png"
						class="sel-icon is-unsel"
						:style="{ display: !item.selected ? 'flex' : 'none' }"
						@tap="isSelect(item)"
					></image>
				</view>
			</view>
		</view>

		<!-- 底部购物车 + 固定栏-->
		<view>
			<view
				class="mengban"
				:style="{ display: isShowShoppingCart && shoppingCartList.length != 0 ? 'block' : 'none' }"
				@tap="isShowShoppingCart = !isShowShoppingCart"
			></view>
			<scroll-view
				class="shopping-cart"
				scroll-y
				:style="{ display: isShowShoppingCart ? 'block' : 'none' }"
			>
				<view class="foot-list" v-for="(item, indexCart) in shoppingCartList" :key="indexCart">
					<view class="foot-name">{{ item.productName }}</view>
					<view class="item-price">
						<text>￥</text>
						<text class="price">{{ item.productPrice }}</text>
						<text class="except">/</text>
						<text>{{ item.productUnit }}</text>
					</view>
					<view class="foot-num" v-if="item.id">
						<image
							src="https://pic.cwyyt.cn/upload/yyticons/160643643_subtract.png"
							class="sel-icon"
							mode=""
							@tap="sub(item)"
						></image>
						<text class="num">{{ item.num }}</text>
						<image src="https://pic.cwyyt.cn/upload/yyticons/160632632_add.png" class="sel-icon" mode="" @tap="add(item)"></image>
					</view>
				</view>
			</scroll-view>
			<view class="position-fixed bottom-0 w-100" v-if="shoppingCartList.length > 0">
				<view class="bottom-fixed d-flex a-center w-100">
					<view class="d-flex a-center flex-nowrap span-10"  @tap="isShowShoppingCart = !isShowShoppingCart">
						<view class="bottom-left">
							<image src="https://pic.cwyyt.cn/upload/yyticons/1614181418_shopping-cart.png" class="shopping-img" mode=""></image>
							<text class="badge">{{ _(shoppingCartList).sumBy('num') }}</text>
						</view>
						<view class="total">
							<text>￥</text>
							<text class="num">{{ totalCount | formatMoney }}</text>
						</view>
					</view>
					<view class="disbtn" :style="{ display: totalCount < minCount ? 'block' : 'none' }">
						<view class="btn">差{{ minCount - totalCount }}元起送</view>
					</view>
					<view
						class="btn"
						@tap="goConfirmOrder"
						:style="{ display: totalCount >= minCount ? 'block' : 'none' }"
					>
						去结算
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export { default } from './yyt-food-menu.js';
</script>

<style lang="less" scoped>
@import url('yyt-food-menu.less');
</style>
