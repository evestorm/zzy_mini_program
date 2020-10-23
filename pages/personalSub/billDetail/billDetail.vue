<template>
	<view class="bill-detail">
		<!-- 头部 -->
		<view class="header">
			<view class="left">
				<view class="title">{{ header.typeName }}</view>
				<view class="desc" v-if="header.desc" :style="{ color: header.descColor }">{{ header.desc }}</view>
			</view>
			<view class="right">
				<view class="money">{{ info.changesAmount | formatPrice | formatChangesAmount }}</view>
				<view class="unit">¥</view>
			</view>
		</view>
		<!-- 列表详情 -->
		<view class="list">
			<view class="item">
				<view class="title">交易类型</view>
				<view class="desc">{{ feeType[info.feeType].name }}</view>
			</view>

			<!-- 消费独有 -->
			<view class="item" v-if="feeType[info.feeType].name === '消费'">
				<view class="title">商家</view>
				<view class="desc">{{ info.businessName+'-'+info.branchName }}</view>
			</view>
			<view class="item" v-if="feeType[info.feeType].name === '消费'">
				<view class="title">餐别</view>
				<view class="desc">{{ info.diningTypeName || '' }}</view>
			</view>
			<view class="item" v-if="feeType[info.feeType].name === '消费'">
				<view class="title">消费人数</view>
				<view class="desc">{{ info.bookNums ? info.bookNums + '人' : '' }}</view>
			</view>
			<view class="item" v-if="feeType[info.feeType].name === '消费'">
				<view class="title">消费时间</view>
				<view class="desc">{{ info.chgTime }}</view>
			</view>

			<!-- 充值，返现独有 -->
			<view class="item" v-if="feeType[info.feeType].name === '充值' || feeType[info.feeType].name === '返现'">
				<view class="title">面值</view>
				<view class="desc money">
					<text class="unit">¥</text> 
					<text cliss='num'>{{ info.changesAmount | formatPrice }}</text>
				</view>
			</view>
			<view class="item" v-if="feeType[info.feeType].name === '充值' || feeType[info.feeType].name === '返现'">
				<view class="title">操作时间</view>
				<view class="desc">{{ info.chgTime }}</view>
			</view>

			<!-- 提现独有 -->
			<view class="item" v-if="feeType[info.feeType].name === '提现'">
				<view class="title">当前状态</view>
				<view class="desc">
					<text class="unit"></text>
					{{ info.takeMoneyState }}
				</view>
			</view>
			<view class="item" v-if="feeType[info.feeType].name === '提现'">
				<view class="title">提现金额</view>
				<view class="desc money">
					<text class="unit">¥</text>
					<text cliss='num'>{{ info.payload | formatPrice }}</text>
				</view>
			</view>
			<view class="item" v-if="feeType[info.feeType].name === '提现'">
				<view class="title">服务费</view>
				<view class="desc money">
					<text class="unit">¥</text>
					<text cliss='num'>{{ (info.chgValue - info.payload) | formatPrice }}</text>
				</view>
			</view>
			<view class="item" v-if="feeType[info.feeType].name === '提现'">
				<view class="title">申请时间</view>
				<view class="desc">{{ info.takeMoneyTime || '' }}</view>
			</view>
			<view class="item" v-if="feeType[info.feeType].name === '提现'">
				<view class="title">到账时间</view>
				<view class="desc">
					<text class="unit"></text>
					{{ info.takeMoneyToTime || '' }}
				</view>
			</view>

			<view class="item">
				<view class="title">订单号</view>
				<view class="desc">{{ info.hyFeeChgID }}</view>
			</view>
		</view>
	</view>
</template>

<script>
export { default } from './billDetail.js';
</script>
<style lang="less">
@import url('./billDetail.less');
</style>
