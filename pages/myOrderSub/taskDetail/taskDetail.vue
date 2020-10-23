<template>
	<view class="">
		<!-- ========================= uniapp-导航栏 START ========================= -->
		<!-- <uni-nav-bar
			left-icon="back"
			@clickLeft="tapLeftFromNav"
			title="任务详情"
			color="#fff"
			background-color="#0184f9"
			:fixed="true"
			:status-bar="true"
			ref="navbarRef"
		></uni-nav-bar> -->
		<!-- 档案内容 -->
		<view class="check-text">{{ taskDetail.taskConfName }}</view>
		<view class="task-detail">
			<!-- <view class="check-text">{{ taskDetail.taskConfName }}</view> -->
			<view class="task-list">
				<view class="line-title">任务类别</view>
				<view class="line-info">{{ taskDetail.bizOptionName }}</view>
			</view>
			<view class="task-list">
				<view class="line-title">执行人</view>
				<view class="line-info">
					<text>{{ taskDetail.banquetTaskExecutorNames }}</text>
				</view>
			</view>
			<view class="task-list">
				<view class="line-title">执行时间</view>
				<view class="line-info">{{ taskDetail.executeDate | parseShortDate }}</view>
			</view>
			<view class="task-list">
				<view class="line-title">所属项目</view>
				<view class="line-info">{{ taskDetail.projectConfName }}</view>
			</view>
			<view class="task-remark" v-show="taskDetail.isCanRemark == 1">
				<view class="line-title">备注</view>
				<view class="line-info">{{ taskDetail.banquetTaskRemark || '' }}</view>
			</view>
			<view class="remark" v-show="taskDetail.isCanCstRemark == 1" @tap="goPageEvaluate">
				<view class="remark-top">
					<view class="line-title">客户备注</view>
					<image class="arrowRight" src="https://pic.cwyyt.cn/upload/yyticons/1625432543_arrowRight.png"></image>
				</view>
				<view class="remark-placeholder" v-show="taskDetail.cstRemark == ''">请输入备注信息</view>
				<view class="remark-bot" v-show="taskDetail.cstRemark != ''">{{ taskDetail.cstRemark }}</view>
			</view>
			<view class="task-list" style="padding:20rpx 0;height:65rpx" v-if="taskDetail.isCanSign == 1">
				<view class="line-title">我的签名</view>
				<view class="line-sign" v-show="taskDetail.cstSignImgUrl == ''">暂未签名</view>
				<image v-show="taskDetail.cstSignImgUrl != ''" :src="taskDetail.cstSignImgUrl" mode="" class="line-image"></image>
			</view>
		</view>
		<!-- 上传文件图片内容 -->
		<view class="task-file">
			<view class="file-list" v-for="item in viewYHClueFileManages" :key="item.id">
				<image v-show="item.clueFileType == 2" class="file-icon" src="https://pic.cwyyt.cn/upload/yyticons/1552185218_files.pngg" mode=""></image>
				<image
					v-show="item.clueFileType == 1"
					class="file-img"
					@tap="previewImage(item.clueFileUrl)"
					:src="item.clueFileUrl"
					mode="aspectFit"
				></image>
				<!-- 图片 -->
				<view class="file-sec">
					<view class="file-title">{{ item.createdRemark }}</view>
					<view class="file-info">
						<text>{{ item.clueFileSize }}M</text>
						<text>{{ item.createTime }}</text>
						<text>来自{{ item.createdName }}</text>
					</view>
				</view>
				<image v-show="item.createGUID==userId" @tap="delFile(item.id)" class="del-file" src="https://pic.cwyyt.cn/upload/yyticons/1546524652_del.png" mode=""></image>
			</view>
		</view>
		<!-- 弹出确认提示框 -->
		<uni-popup ref="delPopup" type="center" class="del-popup">
			<view class="popup-top">
				<text>提示</text>
				<image class="popup-top-img" src="https://pic.cwyyt.cn/upload/yyticons/161400140_关闭.png" mode="" @tap="cancel()"></image>
			</view>
			<view class="popup-mid">
				<image class="popup-mid-img" src="https://pic.cwyyt.cn/upload/yyticons/1551305130_error.png" mode=""></image>
				<text>您确定要删除该文件？</text>
			</view>
			<view class="popup-bot">
				<view class="cancel" @tap="cancel()">取消</view>
				<view class="confirm" @tap="confirm()">确定</view>
			</view>
		</uni-popup>
		<!-- 底部弹出的操作项目popup -->
		<uni-popup ref="projPopupRef" type="bottom" class="bottom-popup" :custom="true" :maskClick="true">
			<view class="wrapper">
				<view class="pop-group">
					<view class="item" @tap="selCamera">拍照</view>
					<view class="item" @tap="selAlbum">从手机相册选择</view>
				</view>
				<view class="pop-group"><view class="item" @tap="closeProjPopup">取消</view></view>
			</view>
		</uni-popup>
		<view style="height: 88rpx;width: 100%;"></view>
		<!-- 底部按钮及提示 -->
		<view class="bottom-fixed">
			<view class="bottom-btn">
				<view class="btn file" v-if="taskDetail.isCanCstUploadFile == 1" @tap="upBottomPopup">上传图片</view>
				<navigator :url="`/pages/myOrderSub/taskSign/taskSign?id=${id}`" hover-class="none" class="btn file" v-if="taskDetail.isCanSign == 1">签名</navigator>
			</view>
		</view>
	</view>
</template>

<script src="./taskDetail.js"></script>

<style lang="less" scoped>
@import url('taskDetail.less');
</style>
