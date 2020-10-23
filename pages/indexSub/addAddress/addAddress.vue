<!-- 新增地址 -->
<template>
	<view class="">
		<view class="list">
			<view class="list-item">
				<view class="title">姓名</view>
				<input
					type="text"
					:value="addressData.userName"
					placeholder="请输入姓名"
					placeholder-style="fontSize:22rpx"
					placeholder-class="input-place"
					class="input-val"
					@input="editUserName"
				/>
			</view>
			<view class="list-item">
				<view class="title">电话</view>
				<input
					type="number"
					:value="addressData.telNumber"
					placeholder="请输入电话"
					placeholder-style="fontSize:22rpx"
					placeholder-class="input-place"
					class="input-val"
					@input="editTel"
				/>
			</view >
				<view class="list-item" @tap="chooseLocation">
				<view class="title">地址</view>
				<view class="input-val">
					{{addressData.detailInfo}}
				</view>
				<!-- <picker mode="region" @change="bindRegionChange" :value="region" class="">
					<view class="picker">
						<text>{{addressData.district}}</text>
						<text class="setTitle ">{{ region[0] || '省份城市' }}</text>
						<text class="setTitle ">{{ region[1] || '' }}</text>
						<text class="setTitle">{{ region[2] || '' }}</text>
					</view>
				</picker> -->
				<image src="https://pic.cwyyt.cn/upload/yyticons/1625432543_arrowRight.png" mode="" class="arrow-right"></image>
			</view>
			<!-- <view class="list-item">
				<view class="title">详细地址</view>
				<view class="flex-1 d-flex j-end ml-2 a-center">
					<view class="input-val">
						{{addressData.detailInfo}}
					</view>
					<navigator :url="`/pages/indexSub/addressMap/addressMap?location=${addressData.location}`" class="">
						<image src="https://pic.cwyyt.cn/upload/yyticons/1625432543_arrowRight.png" mode="" class="arrow-right"></image>
					</navigator>
				</view>
			</view> -->
			<view class="list-item">
				<view class="title">门牌号</view>
				<input
					type="text"
					:value="addressData.userAddressDoorNum"
					placeholder="详细地址,如1楼101室"
					placeholder-style="fontSize:22rpx"
					placeholder-class="input-place"
					class="input-val"
					@input="editDetailInfo"
				/>
				<navigator hover-class="none" :url="`/pages/indexSub/addressMap/addressMap?location=${addressData.location}`" class="">
					<image src="https://pic.cwyyt.cn/upload/yyticons/1625432543_arrowRight.png" mode="" class="arrow-right"></image>
				</navigator>
			</view>
		</view>
		<view class="bottom-btn">
			<view class="edit-flex" v-if="isEdit">
				<view class="del" @tap="openDelPopup">删除</view>
				<view class="btn" @tap="preserveAddress">保存并使用</view>
			</view>
			<view class="btn" @tap="preserveAddress" v-else>保存并使用</view>
		</view>
		<!-- 弹出取消订单提示框 -->
		<cover-view class="mask" catchtouchmove="preventTouchMove" v-if="showModal">
			<cover-view class="modalDlg" v-if="showModal">
				<cover-view class="bookingContent-title">提示</cover-view>
				<cover-view class="bookingContent_detailMsg_list_tab">
					<cover-image src="https://pic.cwyyt.cn/upload/yyticons/1551305130_error.png" class="mid-img"></cover-image>
					<cover-view class="mid-text">您确定要删该地址？</cover-view>
				</cover-view>
				<cover-view class="modalDlg_bottom">
					<cover-view @tap="cancel()" class="cancel handleBtn">取消</cover-view>
					<cover-view @tap="delAddress()" class="confirm handleBtn">确定</cover-view>
				</cover-view>
			</cover-view>
		</cover-view>
	</view>
</template>

<script>
export { default } from './addAddress.js';
</script>
<style lang="less" scoped>
@import './addAddress.less';
</style>
