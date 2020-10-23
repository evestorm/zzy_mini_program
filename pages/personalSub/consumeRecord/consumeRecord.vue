<template>
	<view>
		<!-- 余额 -->
		<view class="cunsume-top">
			<view class="constom-info">
				<image :src="userInfo.headImg"></image>
				<view class="constom-right">
					<view>{{ cardInfo.hyCardTitle }}</view>
					<view>{{ userInfo.nickName }}</view>
					<view>手机号：{{ cardInfo.hyUserTel }}</view>
				</view>
			</view>
			<view class="cunsume-Tbottom">
				<view class="consume-num">
					<view>余额(￥)</view>
					<view>{{ cardInfo.hyUserAmount | formatMoney }}</view>
				</view>
				<view class="consume-btn">
					<navigator
						hover-class="none"
						class="deposit btn"
						v-if="isEnableStore"
						:url="`/pages/personalSub/prePay/prePay?id=${id}`"
					>
						充值
					</navigator>
					<navigator
						class="btn"
						hover-class="none"
						v-if="isCanTakeMoney"
						:url="`/pages/personalSub/cashOut/cashOut?id=${id}&hyCardID=${hyCardID}`"
					>
						提现
					</navigator>
				</view>
			</view>
		</view>
		<view class="top">
			<view class="top-com" @tap="classifyShow = true">
				<view>{{ curClassify.text }}</view>
				<!-- <view class="triangle"></view> -->
				<image src="https://pic.cwyyt.cn/upload/yyticons/160321321_arrow-down.png" class="down-img" mode=""></image>
			</view>
			<picker mode="date" fields="month" @change="getDate">
				<view class="member_filter">
					<text>{{ curDate }}</text>
					<!-- <view class="triangle"></view> -->
					<image src="https://pic.cwyyt.cn/upload/yyticons/160321321_arrow-down.png" class="down-img" mode=""></image>
				</view>
			</picker>
			<!-- <view class="btn" @tap="goPrepay">预付</view> -->
		</view>
		<view class="main">
			<navigator
				class="record_item"
				v-for="(item, index) in record"
				:key="index"
				:url="`/pages/personalSub/billDetail/billDetail?hyFeeChgID=${item.hyFeeChgID}`"
			>
				<text
					class="record-status"
					v-if="item.feeType === 4"
					:style="{ color: item.takeMoneyState === '已到账' ? '#7ed321' : '#d0021b' }"
				>
					{{ item.takeMoneyState || '' }}
				</text>
				<view class="flex between">
					<text class="record_item_title">
						{{ item.businessName }}{{ item.branchName ? '-' : '' }}{{ item.branchName }}
					</text>
					<view class="record_itemr d-flex a-center flex-nowrap line-h text-primary">
						<text>{{ item | feeTypeText }}</text>
						<text>{{ item.oldValue > 0 ? '+' : '' }}{{ item.changesAmount | formatMoney }}</text>
					</view>
				</view>
				<view>
					<view class="record_item_topl flex">
						<image src="https://pic.cwyyt.cn/upload/yyticons/1636343634_rmb.png" class="record_item_topl-img" mode=""></image>
						<!-- <text v-if="item.chgRemark">{{ item.chgRemark }}</text> -->
						<!-- 消费 -->
						<view v-if="item.feeType == 1">
							<text class="right-margin" v-if="item.diningTypeName">
								{{ item.diningTypeName }}
							</text>
							<!-- 晚餐 -->
							<text class="right-margin" v-if="item.bookOrderTypeName">
								{{ item.bookOrderTypeName }}
							</text>
							<!-- 客户 -->
							<text class="right-margin" v-if="item.bookNums">{{ item.bookNums }}人</text>
							<!-- 10人 -->
							<text>消费:</text>
							<!-- 消费 -->
							<text class="rmb">￥</text>
							<!-- 消费 -->
							<text class="money">{{ item.chgValue | formatMoney }}</text>
						</view>
						<!-- 返现 -->
						<view v-if="item.feeType == 2">
							<text>分销返现:</text>
							<!-- 暂时只有一种，写死了 -->
							<text class="rmb">￥</text>
							<text class="money">{{ item.changesAmount | formatMoney }}</text>
						</view>
						<!-- 充值 -->
						<view v-if="item.feeType == 3">
							<text>充值:</text>
							<text class="rmb">￥</text>
							<text class="money">{{ item.changesAmount | formatMoney }}</text>
						</view>
						<!-- 提现 -->
						<view v-if="item.feeType == 4">
							<text>提现:</text>
							<text class="rmb">￥</text>
							<text class="money">{{ item.chgValue | formatMoney }}</text>
						</view>
					</view>
					<view class="record_item_bottoml flex">
						<image src="https://pic.cwyyt.cn/upload/yyticons/1630543054_date.png" class="record_item_bottoml-img" mode=""></image>
						<text v-for="(innerItem, innerIndex) in item.chgTime" :key="innerIndex">
							{{ innerItem }}
						</text>
					</view>
				</view>
			</navigator>
		</view>
		<view class="record-classify" v-if="classifyShow" @tap="classifyShow = false">
			<view class="classify-box" @tap.stop="">
				<view class="classify-top">选择筛选条件</view>
				<view class="classify-main">
					<view
						v-for="(item, index) in classify"
						:key="index"
						:class="item.select ? 'classify-sel' : ''"
						@tap.stop="selClassify(item)"
					>
						{{ item.text }}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export { default } from './consumeRecord.js';
</script>
<style lang="less" scoped>
@import './consumeRecord.less';
</style>
