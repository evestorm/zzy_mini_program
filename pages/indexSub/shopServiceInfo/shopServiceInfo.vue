<template>
	<!-- pages/hotel/shopServiceInfo/shopServiceInfo.wxml -->
	<!-- 商户信息 -->
	<view class="container">
		<view class="shopServiceInfo">
			<view class="shop_hours">
				<view class="title">营业时间</view>
				<view class="content">
					<image src="https://pic.cwyyt.cn/upload/yyticons/1621572157_time.png" class="timePic"></image>
					<text>{{ shopBusinessDtail.openTime }}</text>
				</view>
			</view>
			<view class="shopService_content">
				<view class="title">设施及服务</view>
				<view class="content">
					<view class="service_item" v-if="shopBusinessDtail.serviceFacility">
						<view class="service_item_title">
							<image src="https://pic.cwyyt.cn/upload/yyticons/1638273827_zan.png" class="menuPic"></image>
							<text>服务设施</text>
						</view>
						<view class="service_item_content">
							<!-- <text class="service_item_name">{{shopServiceInfo.shopServiceFacilities.name}}</text>
						<text class="service_item_desc">{{shopServiceInfo.shopServiceFacilities.desc}}</text> -->
							<view class="service_item_feature">
								<text v-for="(featureItem, index) in shopBusinessDtail.serviceFacility" :key="index">{{ featureItem }}</text>
							</view>
						</view>
					</view>
					<view class="service_item">
						<view class="service_item_title">
							<image src="https://pic.cwyyt.cn/upload/yyticons/1638273827_zan.png" class="featurePic"></image>
							<text>特色服务</text>
						</view>
						<view class="service_item_content">
							<view class="service_item_feature">
								<text v-for="(special, index) in shopBusinessDtail.special" :key="index">{{ special }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="shopAddress">
				<view class="title">地址坐标</view>
				<view class="content">
					<view class="address_l"><image src="https://pic.cwyyt.cn/upload/yyticons/1634193419_map.png" class="locationPic"></image></view>
					<view class="address_Info">
						<text class="address_location">{{ shopBusinessDtail.address }}</text>
						<!-- <text class="address_direction">{{shopBusinessDtail.addressDtail}}</text> -->
					</view>
				</view>
			</view>
		</view>
		<navigator class="jump-booking" hover-class="none" :url="`/pages/indexSub/goBooking/goBooking?id=${shopId}`">
			<button type="primary" class="btn">立即预定</button>
		</navigator>
		
	</view>
</template>

<script>
export { default } from './shopServiceInfo.js';
</script>
<style lang="less" scoped>
	@import url('shopServiceInfo.less');
</style>
