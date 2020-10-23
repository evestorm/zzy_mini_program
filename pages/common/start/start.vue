<template>
	<view class="start-page">
		<view class="container">
			<view class="start"><image :src="bgImg" mode="aspectFit"></image></view>
			<view class="start_bottom">
				<view class="setCarStyle" @tap="goIndex" v-if="!showNickName && !showTel">
					<text>开启您的方便之旅>></text>
				</view>
				<view class="getTip" v-if="showNickName">掌中宴需要获取您的微信授权</view>
				<view class="getTip" v-if="showTel">掌中宴需要获得您的手机号授权</view>

				<button class=" tel_button" @tap="showAuthDialog" v-if="showNickName">点我授权</button>
				<button v-if="showTel" class="tel_button" open-type="getPhoneNumber" @getphonenumber="getTel">点我授权手机</button>
			</view>

			<!-- 确认登录弹窗 -->
			<!-- 弹出取消订单提示框 -->
			<uni-popup ref="authPopup" type="center" class="tip-popup" :custom="true">
				<view class="wrapper">
					<view class="popup-top">
						<text>提示</text>
						<image class="popup-top-img" src="https://pic.cwyyt.cn/upload/yyticons/161400140_关闭.png" mode="" @tap="cancelAuth()"></image>
					</view>
					<view class="popup-mid">
						<image class="popup-mid-img" src="https://pic.cwyyt.cn/upload/yyticons/1551305130_error.png" mode=""></image>
						<text>访问该页面需要进行微信授权</text>
					</view>
					<view class="popup-bot">
						<view class="cancel" @tap="cancelAuth()">取消</view>
						<button class="confirm" open-type="getUserInfo" @getuserinfo="bindGetUserInfo">点我授权</button>
					</view>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script src="./start.js"></script>
<style lang="less" scoped>
@import './start.less';
@import '../../../common/yyt-common.less';
</style>
