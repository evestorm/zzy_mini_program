<!--作者:李彦熹-->
<template>
	<view class="cu-modal" :class="isShowDialog ? 'show' : ''" @tap="_onClose">
		<view class="cu-dialog" @tap.stop="">
			<view class="cu-bar bg-white justify-end">
				<view class="content">详情</view>
				<view class="action" @tap="_onClose"><text class="cuIcon-close text-cc"></text></view>
			</view>
			<view class="px-3 pb-1">
				<view class="data-wrapper">
					<view class="data-item">
						<view class="title">
							<image :src="shopStoreDetail.storeImgUrl"></image>
							<text>商家</text>
						</view>
						<view class="content" @tap="_onStoreRedirectTo">
							<text class="mr-3">{{ shopStoreDetail.storeName }}</text>
							<image src="https://pic.cwyyt.cn/upload/yyticons/160957957_%E4%B8%8B%E4%B8%80%E6%AD%A5@2x.png"></image>
						</view>
					</view>
					<block v-if="isSendPeople">
						<view class="data-item" v-if="shopStoreDetail.sendPeopleName">
							<view class="title">
								<image :src="shopStoreDetail.headImgUrl"></image>
								<text>负责人</text>
							</view>
							<view class="content">
								<text class="margin-right">{{ shopStoreDetail.sendPeopleName }}</text>
								<text>{{ shopStoreDetail.sendPeoplePhone }}</text>
							</view>
						</view>
						<view class="data-item" v-if="shopStoreDetail.sendPeopleArea">
							<view class="title"><text>区域</text></view>
							<view class="content">
								<text>{{ shopStoreDetail.sendPeopleArea }}</text>
							</view>
						</view>
					</block>
					<block v-else>
						<view class="data-item">
							<view class="title"><text>商家电话</text></view>
							<view class="content">
								<text>{{ shopStoreDetail.storePhone }}</text>
							</view>
						</view>
					</block>
					<view class="data-item data-item-rich" v-if="shopStoreDetail.noticeRemark">
						<view class="item-rich-title"><text>公告</text></view>
						<view class="item-rich-content"><rich-text class="item-rich-text" :nodes="shopStoreDetail.noticeRemark"></rich-text></view>
					</view>
				</view>
			</view>
			<view class="cu-bar bg-white justify-center">
				<view class="action"><button class="cu-btn btn-cst" @tap="_onAreaClick">其它区域</button></view>
			</view>
		</view>
	</view>
</template>

<script>
export { default } from './yyt-dialog-detail.js';
</script>

<style lang="less" scoped>
@import '/lib/colorui/main.css';
@import '/lib/colorui/icon.css';
@import url('yyt-dialog-detail.less');
</style>
