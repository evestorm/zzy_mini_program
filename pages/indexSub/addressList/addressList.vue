<!-- 新增地址 -->
<template>
	<view class="">
		<view class="address">
			<view class="address-list" v-for="(item, index) in addressList" :key="index" @tap="selAddress(item)">
				<image :src="item.isDefault == 1 ? 'https://pic.cwyyt.cn/upload/yyticons/1451265126_address-sel.png' : 'https://pic.cwyyt.cn/upload/yyticons/1451345134_address-unsel.png'" class="left-icon" mode=""></image>
				<view class="list-item">
					<view class="">
						<text class="name">{{ item.userName }}</text>
						<text class="tel">{{ item.telNumber }}</text>
					</view>
					<view class="address-text">{{ item.detailInfo }}{{ item.userAddressDoorNum||"" }}</view>
				</view>
				<image src="https://pic.cwyyt.cn/upload/yyticons/1623222322_address-edit.png" class="edit" mode="" @tap.stop="goEdit(item)"></image>
			</view>
			<view class="no-address" v-if="addressList.length == 0">暂无地址，请新增地址</view>
		</view>
		<view class="bottom-btn j-center">
			<!-- <view class="btn" @tap="chooseWXAddress">选择微信地址</view> -->
			<navigator hover-class="none" url="/pages/indexSub/addAddress/addAddress" class="btn">新增收货地址</navigator>
		</view>
	</view>
</template>

<script>
export { default } from './addressList.js';
</script>
<style lang="less" scoped>
@import './addressList.less';
</style>
