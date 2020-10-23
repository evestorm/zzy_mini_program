<!-- 于大明 -->
<template>
	<view class="order-food-page" :class="{ prevent: isShowPop }">
		<!-- ==========================================顶部======================================== -->
		<view class="top d-flex j-sb a-center px-3 py-2 bg-white j-center">
			<navigator :url="`/pages/indexSub/changeStoreList/changeStoreList?storeId=${storeId}&cWCompanyID=${conmpanyInfo.cwCompanyID}`">
				<view class="font-24 d-flex j-center a-center">
					<view class="text-ellipsis" style="width: 232rpx;">{{ fullShopName }}</view>
					<uni-icons type="arrowdown"></uni-icons>
				</view>
			</navigator>

			<view class="top-btn d-flex a-center" @tap="isShowPop = true">
				<image class="radius-100" :src="sendPeoplePicUrl" style="height: 64rpx;width: 64rpx;"></image>
				<view class="font-28 bg-gray  radius-20">{{ sendPeopleName }}</view>
			</view>

			<navigator :url="`/pages/myOrder/myOrderStore?storeID=${storeId}&tabIdx=3`">
				<view class="top-btn d-flex a-center">
					<image style="width: 54rpx;height: 54rpx;" class="rounded-circle" src="https://pic.cwyyt.cn/upload/yyticons/120016016_我的订单.png"></image>
					<view class="font-28 bg-gray radius-10">订单</view>
				</view>
			</navigator>
		</view>
		<!-- ==========================================轮播======================================== -->
		<yyt-head-banner :storeid="storeId" v-if="storeId"></yyt-head-banner>

		<!-- ==========================================通知组件======================================== -->
		<yyt-tuxedo v-if="contentList.length > 0" :contentList="contentList" :orderPeopleImgList="orderPeopleImgList" @onclick="isShowPop = true"></yyt-tuxedo>

		<!-- 顶部通知 体验不太好先去掉 ydm --> 
		<!-- <yyt-tuxedo
			v-if="contentList.length > 0"
			style=" position: fixed; width: 100vw; z-index:999;top:-8rpx"
			:style="{ display: isShowTopProductType ? 'block' : 'none' }"
			:contentList="contentList"
			:orderPeopleImgList="orderPeopleImgList"
			@onclick="isShowPop = true"
		></yyt-tuxedo> -->

		<!-- ==========================================tab九宫格选择======================================== -->
		<yyt-product-type
			v-if="productTypeInfos.length > 0"
			:typeItems="productTypeInfos"
			:selectItem="selectproductTypeItem"
			@onSelctItem="onSelctItem"
			ref="productType"
			id="ProductTypeMenu"
		></yyt-product-type>

		<!-- ==========================================tab 顶部x抽选择======================================== -->
		<!-- 体验不太好先去掉 ydm -->
		<!-- 	<yyt-product-type-x
			v-if="productTypeInfos.length > 0"
			:style="{ display: isShowTopProductType ? 'block' : 'none' }"
			:typeItems="productTypeInfos"
			:selectItem="selectproductTypeItem"
			@onSelctItem="onSelctItem"
			ref="productTypeX"
			id="ProductTypeTopX"
		></yyt-product-type-x> -->

		<!-- ==========================================秒杀======================================== -->
		<view class="bg-white px-2 py-3"><yyt-ms-shop-ticket :inputItems="msItems" v-if="msItems.length > 0"></yyt-ms-shop-ticket></view>

		<!-- ==========================================菜单======================================== -->
		<view class="d-flex a-center  j-center bg-white pt-1" id="PageTjMenu" v-if="conmpanyInfo.isEnableWxShop">
			<view class="rounded-circle bg-primary mr-1" style="width: 8rpx;height: 8rpx;"></view>
			<view class="rounded-circle bg-primary mr-1" style="width: 16rpx;height: 16rpx;"></view>
			<view class="font-weight font-28">为您推荐</view>
			<view class="rounded-circle bg-primary ml-1" style="width: 8rpx;height: 8rpx;"></view>
			<view class="rounded-circle bg-primary ml-1" style="width: 16rpx;height: 16rpx;"></view>
		</view>

		<!-- ==========================================产品======================================== -->
		<view class="food-menu bg-white" style="padding-bottom: 180rpx;">
			<yyt-food-menu
				v-if="conmpanyInfo.isEnableWxShop && currentGroupProducts.length > 0"
				:foodGroupList="currentGroupProducts"
				:minCount="conmpanyInfo.orderSendUpAmount"
				@onGetProductTypeTop="onGetProductTypeTop"
				ref="YytFoodMenu"
			></yyt-food-menu>
			<!-- 没有开通线上商城提示 -->
			<view v-if="!conmpanyInfo.isEnableWxShop" class="no-wx-shop d-flex flex-column a-center">
				<image src="https://pic.cwyyt.cn/upload/img/20200513/11000909_暂未开通商城@2x.png" class="img mb-4"></image>
				<view class="text font-28">抱歉，该门店还未开通线上商城</view>
			</view>
		</view>

		<!-- ==========================================弹出层======================================== -->
		<yyt-dialog-detail
			v-if="shopStoreDetail"
			:isSendPeople="sendPeopleInfo.id ? true : false"
			:shopStoreDetail="shopStoreDetail"
			:isShowDialog="isShowPop"
			@onClose="isShowPop = false"
			@onAreaClick="goArea"
			@onStoreRedirectTo="goStore"
		></yyt-dialog-detail>
	</view>
</template>

<script>
export { default } from './orderFood.js';
</script>
<style lang="less" scoped>
@import './orderFood.less';
</style>
