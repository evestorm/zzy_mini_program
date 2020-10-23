<template>
	<view>
		<!--头部-->
		<!-- <view id="PageHeader"><page-head :title="title" name='name'>评价</page-head></view>
 -->
		<!--内容-->
		<view id="PageContent"></view>
		<view class="head">
			<view class="head-left">{{ into.name }}</view>
			<view class="head-right">
				<view class="right-son">{{ into.type }}</view>
				<view class="right-son">{{ into.date }}</view>
			</view>
		</view>
		<view class="bodycontent" style="height: 400rpx;">
			<view class="item" style="height: 100rpx;">
				<view class="left">评分:</view>
				<view class="right" style="margin-left: -45rpx;">
					<sx-rate
						value="0"
						:default-color="'#e1e1e1'"
						:active-color="'#FF4732'"
					     @change="change"
					></sx-rate>
				</view>
			</view>

			<br />
			<br />
			<view class="my-reply">
				<view class="left" style="margin-left: -8rpx;">评价:</view>
				<textarea
					v-model="data.cstComment"
					class="textarea-text"
					maxlength="300"
					placeholder-style="font-size:22rpx"
					placeholder="请输入评价"
				/>
				<text class="textarea-length">{{ data.cstComment.length }}/300</text>
			</view>
			<br />
		</view>
		<!--底部-->
		<view class="weui-btn-area"><button class="weui-btn" @tap="updateFile">提交</button></view>
	</view>
</template>

<!-- <script>
    export { default } from './estimate.js';
	
	
</script> -->
<script src="./estimate.js"></script>

<style lang="less" scoped>
@import url('estimate.less');
</style>
