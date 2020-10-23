<template>
	<!--pages/personal/personal.wxml-->
	<view class="container">
		<!-- 顶部面板 -->
		<view class="panel">
			<!-- 头像 名称 完善资料 -->
			<view class="basic-wrapper">
				<navigator
					class="avatar"
					hover-class="none"
					url="/pages/personalSub/memberMaterial/memberMaterial?materialType=1"
				>
					<image class="img" :src="userInfo.headImg"></image>
				</navigator>
				<view class="username">{{ userInfo.nickName ? userInfo.nickName : '' }}</view>
				<navigator
					class="edit-btn"
					hover-class="none"
					url="/pages/personalSub/memberMaterial/memberMaterial?materialType=1"
				>
					完善资料
				</navigator>
			</view>
			<!-- 卡包 - 优惠券 -->
			<view class="function-wrapper">
				<navigator
					class="item"
					hover-class="none"
					:url="`/pages/personalSub/myCard/myCard?openId=${userInfo.openId}`"
				>
					<image src="https://pic.cwyyt.cn/upload/yyticons/1713351335_my-wallet.png"></image>
					<text>我的卡包</text>
				</navigator>
				<navigator class="item" hover-class="none" url="/pages/personalSub/myCoupon/myCoupon">
					<image src="https://pic.cwyyt.cn/upload/yyticons/1712491249_my-coupons.png"></image>
					<text>优惠券</text>
				</navigator>
			</view>
		</view>
		<!-- 列表 -->
		<view class="yyt-list">
			<navigator
				class="yyt-list-row"
				hover-class="none"
				:url="`/pages/personalSub/commission/commission?openId=${userInfo.spOpenId}`"
			>
				<view class="left">
					<image class="icon" src="https://pic.cwyyt.cn/upload/yyticons/1713421342_yj.png"></image>
					<view class="title">我的佣金</view>
				</view>
				<view class="right">
					<image
						class="icon"
						src="https://pic.cwyyt.cn/upload/img/20200318/1841184118_arrow-right.png"
						mode=""
					></image>
				</view>
			</navigator>
		</view>
		<view class="yyt-list">
			<navigator class="yyt-list-row" hover-class="none" url="/pages/personalSub/myCollect/myCollect">
				<view class="left">
					<image
						class="icon"
						src="https://pic.cwyyt.cn/upload/img/20200318/183808388_star.png"
					></image>
					<view class="title">收藏</view>
				</view>
				<view class="right">
					<image
						class="icon"
						src="https://pic.cwyyt.cn/upload/img/20200318/1841184118_arrow-right.png"
						mode=""
					></image>
				</view>
			</navigator>
		</view>
		<view class="yyt-list">
			<navigator
				class="yyt-list-row"
				hover-class="none"
				url="/pages/personalSub/retroaction/retroaction"
			>
				<view class="left">
					<image
						class="icon"
						src="https://pic.cwyyt.cn/upload/img/20200318/1839133913_feedback.png"
					></image>
					<view class="title">意见反馈</view>
				</view>
				<view class="right">
					<image
						class="icon"
						src="https://pic.cwyyt.cn/upload/img/20200318/1841184118_arrow-right.png"
						mode=""
					></image>
				</view>
			</navigator>
			<navigator
				class="yyt-list-row"
				hover-class="none"
				url="/pages/personalSub/contactService/contactService"
			>
				<view class="left">
					<image
						class="icon"
						src="https://pic.cwyyt.cn/upload/img/20200318/1842174217_service.png"
					></image>
					<view class="title">联系我们</view>
				</view>
				<view class="right">
					<image
						class="icon"
						src="https://pic.cwyyt.cn/upload/img/20200318/1841184118_arrow-right.png"
						mode=""
					></image>
				</view>
			</navigator>
		</view>
	</view>
</template>

<script>
export { default } from './personal.js';
</script>
<style lang="less" scoped>
@import './personal.less';
@import '../../common/yyt-common.less';
</style>
