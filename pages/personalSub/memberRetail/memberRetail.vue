<template>
	<view>
		<view class="retail-top">
			<view :class="[retailIndex == 0 ? 'retail-sel' : '']" @tap="selectRetail(0)">分销记录</view>
			<view :class="[retailIndex == 1 ? 'retail-sel' : '']" @tap="selectRetail(1)">核销记录</view>
		</view>
		<view class="top">
			<picker mode="date" fields="month" @change="getDate">
				<view class="member_filter">
					<text>{{ curDate }}</text>
					<!-- <view class="triangle"></view> -->
					<image class='member_filter_img' src="https://pic.cwyyt.cn/upload/yyticons/160321321_arrow-down.png" mode=""></image>
				</view>
			</picker>
		</view>
		<view class="retail-box" v-if="retailIndex == 0">
			<view class="hexiaojilu" v-for="(item, index) in record" :key="index" @tap="gotoFenxiaoCode(item, 0)">
				<image src="https://pic.cwyyt.cn/upload/yyticons/1629162916_catalog.png" class='img' mode=""></image>
				<view class='date'>{{ item.createTime }}</view>
				<!-- <view>{{ item.disRecordCode }}</view> -->
				<view class="right">{{ item.isVerification ? '已核销' : '未核销' }}</view>
			</view>
		</view>
		<view class="retail-box" v-if="retailIndex == 1"> <!--  -->
			<view v-for="(item, index) in record" :key="index" class="yihexiao">
				<view class="left">
					<view class="">
						<image src="https://pic.cwyyt.cn/upload/yyticons/1629162916_catalog.png" class='img' mode=""></image>
						<text class="time">{{ item.disRecordUseTime }}</text>
					</view>
					<view class="desc">
						<text class="name">{{ item.bookerName }}</text>
						<text>{{ item.bookerPhone }}</text>
					</view>
				</view>
				<view class="right">{{ item.branchName }}</view>
				<!-- 滚动 -->
				<!-- <view style="margin-top: 5px; max-width: 30%;">
					<uni-notice-bar
					:scrollable="true"
					:single="true"
					background-color='white'
					color="black"
					:text="item.businessName + '-' + item.branchName + '-' + item.bookerName" />
				</view> -->
			</view>
		</view>
	</view>
</template>

<script src="./memberRetail.js"></script>

<style lang="less" scoped>
@import './memberRetail.less';
</style>
