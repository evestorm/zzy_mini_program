<template>
	<!-- page：完善资料 -->
	<view class="my-profile container">
		<view class="panel">
			<!-- 头像昵称 -->
			<view class="header">
				<view class="avatar-wrapper">
					<image :src="userInfo.headImg" mode="aspectFill"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export { default } from './myProfile.js';
</script>

<style lang="less" scoped>
@import './myProfile.less';
</style>
