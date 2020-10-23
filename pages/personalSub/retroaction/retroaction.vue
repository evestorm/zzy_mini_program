<!--反馈-->
<template>
	<view class="container">
		<view class="yyt-list yyt-radius-10" style="margin-top: 30rpx;">
			<view class="yyt-list-row">
				<view class="left">
					<image class="icon" src="https://pic.cwyyt.cn/upload/img/20200322/1427582758_username.png" mode=""></image>
					<input type="text" placeholder="请输入您的姓名" @input="getName" placeholder-class="placeholder" :value="name" />
				</view>
			</view>
			<view class="yyt-list-row">
				<view class="left">
					<image class="icon" src="https://pic.cwyyt.cn/upload/img/20200322/1428462846_phone.png" mode=""></image>
					<input
						class="weui-input"
						type="number"
						placeholder="请输入您的电话"
						@input="getPhone"
						placeholder-class="placeholder"
						:value="phone"
					/>
				</view>
			</view>
		</view>
		<view class="yyt-list yyt-radius-10" style="margin-top: 10rpx;">
			<view class="yyt-list-item yyt-list-item-column">
				<view class="title-wrapper" style="margin-bottom: 20rpx;">
					<view class="title">
						<image style="width: 36rpx; height: 36rpx;" src="https://pic.cwyyt.cn/upload/img/20200322/1429302930_desc.png"></image>
					</view>
				</view>
				<view class="uni-textarea" style="width: 100%;">
					<!-- @blur输入框失去焦点时触发，不加style高度自定撑开，value为输入框的内容，disabled为是否可输入 -->
					<textarea
						style="width: 100%;"
						placeholder="写下您的反馈信息,我们将给您带来更好的体验~"
						:style="{fontSize: '28rpx', height: desc.length == 0 ? '60rpx' : '120rpx', transition: 'all .2s ease'}"
						placeholder-class="placeholder"
						@input="getDesc"
						:value="desc"
					/>
				</view>
			</view>
		</view>
		
		<view class="yyt-list yyt-radius-10 commentsHeader_shop_photos" style="margin-top: 20rpx;">
			<view class="commentsHeader_shop_photos_content" v-if="isShowPhoto">
				<view class="weui-uploader__bd">
					<view class="weui-uploader__files" id="uploaderFiles">
						<block v-for="(item, index) in files" :key="index">
							<view class="weui-uploader__file ">
								<!-- <image class="weui-uploader__img" src="{{item}}" mode="aspectFill" />
			<view class="weui-uploader__file-content" wx:if="{{status}}">{{item.uploadProgress}}%</view> -->
								<image
									class="weui-uploader__img"
									v-if="item.uploadProgress < 100"
									:src="item.path"
									mode="aspectFill"
									@tap="previewImage"
									:id="item.path"
								></image>
								<!-- <text class="icon iconfont icon-jianhao delIcon" @tap="delFile" :data-path="item.path"></text> -->
								<image class="delIcon" src="https://pic.cwyyt.cn/upload/img/20200322/1555165516_del.png" @tap="delFile" :data-path="item.path"></image>
								<image class="weui-uploader__img" v-if="item.uploadProgress == 100" :src="item.path_server" mode="aspectFill"></image>
							</view>
						</block>
					</view>
					<view class="weui-uploader__input-box" v-if="uploadImgNum < maxNum">
						<view class="weui-uploader__input" @tap="chooseImage"></view>
						<text class="icon iconfont icon-xiangji uploadPic"></text>
					</view>
				</view>
			</view>
			<view class="commentsHeader_shop_photos_desc" v-else>
				<view class="commentsHeader_shop_photos_l" @tap="chooseImage"><text class="icon iconfont icon-xiangji"></text></view>
				<view class="commentsHeader_shop_photos_r">
					<text class="commentsHeader_shop_photos_r_title" style="margin-bottom: 10rpx;">上传图片</text>
					<text class="commentsHeader_shop_photos_r_content">
						最多可以上传6张哦
					</text>
				</view>
			</view>
		</view>
		
		<!-- 提交 -->
		<view class="save-wrapper">
			<form report-submit="true" @submit="goSubmit"><button class="weui-btn" formType="submit">提交</button></form>
		</view>
	</view>
</template>

<script>
export { default } from './retroaction.js';
</script>
<style lang="less" scoped>
@import './retroaction.less';
@import '../../../common/yyt-common.less';
@import '../../myOrderSub/commentsDetail/commentsDetail.less';
</style>
