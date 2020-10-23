<template>
	<view>
		<view class="top">
			<picker mode="date" fields="month" @change="getDate">
				<view class="member_filter">
					<text>{{ curDate }}</text>
					<image src="https://pic.cwyyt.cn/upload/yyticons/160321321_arrow-down.png" class="member_filter_img"></image>
					<!-- <view class="iconfont icon-shaixuan"></view> -->
				</view>
			</picker>
		</view>
		<view class="main">
			<view class="record_item" v-for="(item, index) in record" :key="index">
				<view class="record_item-top">
					<text class="name">{{ item.businessName }}</text>
					<!-- <text>{{ item.businessName }}-{{ item.branchName }}</text> -->
					<view class="record_itemr">
						<text>本次积分</text>
						<text v-if="item.oldValue">+{{ item.oldValue }}</text>
						<text v-if="item.chgValue">-{{ item.chgValue }}</text>
					</view>
				</view>
				<view>
					<view class="record_item_topl">
						<image src="https://pic.cwyyt.cn/upload/yyticons/1636343634_rmb.png" class="img" mode=""></image>
						<text v-if="item.chgRemark">{{ item.chgRemark }}</text>
						<!-- <text wx:if="{{item.realAmount}}">消费(￥)：{{item.realAmount | formatMoney}}</text> -->
					</view>
					<view class="record_item_bottoml">
						<image src="https://pic.cwyyt.cn/upload/yyticons/1630543054_date.png" class="img" mode=""></image>
						<text v-for="(innerItem, innerIndex) in item.chgTime" :key="innerIndex">{{ innerItem }}</text>
					</view>
				</view>
				
			</view>
		</view>
		<!-- <view>暂无记录</view> -->
	</view>
</template>

<script>
export { default } from './pointsRecord.js';
</script>
<style lang="less" scoped>
@import './pointsRecord.less';
</style>
