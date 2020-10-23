<!--作者:覃彬-->
<template>
	<view class="yyt-steps">
		<cover-view class="bg-cove w-100  position-fixed top-0 left-0" style="height: calc(100vh);" @tap="_onClick">
			<cover-view class="step-list position-fixed bottom-0 left-0 bg-white p-3 w-100 box-s" @tap.stop=''>
				<!-- 标题 -->
				<cover-view class="position-relative mb-4">
					<cover-view class="text-center font-30 font-weight title ">{{title}}</cover-view>
					<cover-image @tap="_onClick" class="icon-img position-absolute right-0 top-0" src="https://pic.cwyyt.cn/upload/yyticons/161400140_关闭.png"></cover-image>
				</cover-view>
				<!-- 时间轴内容 -->
				<cover-view class="time-content">
					<cover-view class="time-list " v-for="(item,index) in stepsLiat" :key="index">
						<cover-view class="time-left-border"></cover-view>
						<cover-view class="time-item d-flex a-center font-md">
							<cover-view class="icon-view d-flex align-center j-center">
								<cover-view class="left-icon"></cover-view>
							</cover-view>
							<cover-view class="">{{item.eventName}}</cover-view>
							<cover-view class="ml-auto">{{item.eventDateTime}}</cover-view>
						</cover-view>
						<cover-view class="time-left-border"></cover-view>
					</cover-view>
				</cover-view>
			</cover-view>
		</cover-view>
	</view>
</template>

<script>
 export { default } from './yyt-steps.js';
</script>

<style lang="less" scoped>
@import url('yyt-steps.less');
</style>
