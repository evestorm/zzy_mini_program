<!-- 作者:覃彬 -->
<template>
	<view class="pt-3">
		<!--顶部兑换券信息-->
		<view class="page-header">
			<view class="top-shopname">
				<image class="shop-img" :src="msInfo.imgUrl"></image>
				<view class="text">{{ msInfo.businessName }}({{ msInfo.branchName }})</view>
				<view class="num">销量：{{ msInfo.buyCount }}张</view>
			</view>
			<view class="bottom">
				<view class="ticket-name">{{ msInfo.activeConfigName }}</view>
				<view class="ticket-right">
					<text>可用时日：</text>
					<text>{{ msInfo.useRangRemark }}</text>
				</view>
			</view>
		</view>

		<!--内容-->
		<view class="page-content">
			<!-- ====================================计时器+剩余数量卡片================================= -->
			<view class="timer">
				<view class="left line-h">
					<view class="top-price">
						<view class="pay">
							<text class="rmb">￥</text>
							<text class="num">{{ msInfo.msGoodsPrice }}</text>
							<text class="unit">/张</text>
						</view>
						<view class="meet">
							￥
							<text class="num">{{ msInfo.buyAmount }}</text>
							/张
						</view>
					</view>
					<view class="bottom-time">
						<image class="img" src="https://pic.cwyyt.cn/upload/yyticons/1621572157_time.png"></image>
						<view :class="msInfo.stateCode == 2 || msInfo.stateCode == 5 ? 'no-count' : 'text'">
							{{ msInfo.stateCode | formatCardCode }}
						</view>
						<yyt-countdown
							transform='scale(1.1,1.2)'
							v-if="msInfo.stateCode == 3"
							:receiveTime="msInfo.msBeginTime"
							@onStopTime="msInfo.stateCode=4"
						></yyt-countdown>
						<yyt-countdown
							transform='scale(1.1,1.2)'
							v-if="msInfo.stateCode == 4"
							:receiveTime="msInfo.msEndTime"
							@onStopTime="msInfo.stateCode=5"
						></yyt-countdown>
					</view>
				</view>
				<view class="right">
					仅剩
					<text class="num">{{ msGoodsSurplus }}</text>
					张
				</view>
			</view>
			<!-- ====================================购买须知===================================== -->
			<view class="need-konw">
				<view class="top-title">购买须知</view>
				<view class="know-list" v-if="msInfo.productName">
					<view class="title">适用菜品</view>
					<view class="info">{{ msInfo.productName }}</view>
				</view>
				<view class="know-list">
					<view class="title">有限期</view>
					<view class="info">{{ msInfo.effectiveRemark }}</view>
				</view>
				<view class="know-list">
					<view class="title">使用时间</view>
					<view class="info">{{ msInfo.useRangRemark }}</view>
				</view>
				<view class="title">使用规则</view>
				<view class="left-20 rule">{{ msInfo.useRemark }}</view>
			</view>
			<!-- ====================================适用门店===================================== -->
			<view class="apply-shop">
				<view class="top-title">适用门店</view>
				<navigator
					hover-class="none"
					:url="'/pages/indexSub/shopIntroduce/shopIntroduce?id=' + item.storeId"
					class="shop-list"
					v-for="(item, index) in msInfo.canUseStores"
					:key="index"
				>
					<view class="shop-name">{{ item.storeName }}</view>
					<image
						src="https://pic.cwyyt.cn/upload/img/20200305/2034113411_next.png"
						mode=""
						class="img"
					></image>
				</navigator>
			</view>
		</view>

		<!--底部-->
		<view style="width: 100%;height: 110rpx;box-sizing: border-box;"></view>
		<view class="page-bottom">
			<view class="left">
				<text class="meet">￥</text>
				<text class="num">{{ msInfo.msGoodsPrice }}</text>
				<text class="unit">/张</text>
			</view>
			<view
				class="mid"
				v-if="msInfo.msPeopleCount > 1 && (msInfo.stateCode == 3 || msInfo.stateCode == 4)"
			>
				<view class="img-area" @tap="msNum=msNum>1?--msNum:msNum">
					<image
						class="img"
						:src="msNum == 1 ? 'https://pic.cwyyt.cn/upload/yyticons/160731731_not-reduce.png' : 'https://pic.cwyyt.cn/upload/yyticons/160643643_subtract.png'"
					></image>
				</view>
				<view class="num">{{ msNum }}</view>
				<view class="img-area" @tap="msNumAdd">
					<image class="img" src="https://pic.cwyyt.cn/upload/yyticons/160632632_add.png"></image>
				</view>
			</view>
			<view class="right w-blue" v-if="msInfo.stateCode == 2">
				<text>已售罄，下次加油</text>
				<image src="https://pic.cwyyt.cn/upload/yyticons/1615371537_small.png" mode="" class="small-icon"></image>
			</view>
			<view class="right w-blue" v-if="msInfo.stateCode == 3">即将开抢</view>
			<view class="right blue" v-if="msInfo.stateCode == 4" @tap="buyCard">立即抢购</view>
			<view class="right w-blue" v-if="msInfo.stateCode == 5">
				<text>已经结束，下次加油</text>
				<image src="https://pic.cwyyt.cn/upload/yyticons/1615371537_small.pngg" mode="" class="small-icon"></image>
			</view>
		</view>
	</view>
</template>

<script>
export { default } from './seckillInfo.js';
</script>

<style lang="less" scoped>
@import url('seckillInfo.less');
</style>
