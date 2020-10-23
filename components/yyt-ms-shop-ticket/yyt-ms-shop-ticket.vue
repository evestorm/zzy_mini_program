<!--作者:于大明-->
<template>
	<block v-if="items.length > 0">
		<view class="yyt-ms-shop-ticket bg-white">
			<!-- 顶部的秒杀 -->
			<view class="ticket-top border-bottom-0 bg-gray">
				<scroll-view scroll-x scroll-with-animation class="scroll-row" :scroll-left="scrollLeft">
					<view
						class="top-box  scroll-row-item flex-column py-1"
						style="width: 174rpx;height: 84rpx;"
						v-for="(item, index) in items"
						:key="index"
						:class="{ 'select-active': item.id === currentSlectItem.id }"
						@tap="selctActiveTab(item)"
					>
						<view class="box-top text-center font-28">{{ item.msBeginTimeStr }}</view>
						<view class="box-bottom text-center" v-if="item.stateStr == '抢购中'">正在秒杀</view>
						<view class="box-bottom text-center" v-else-if="item.stateStr == '已售罄'">已售罄</view>
						<view class="box-bottom text-center" v-else-if="item.stateStr == '未开始'">即将开始</view>
						<view class="box-bottom text-center" v-else-if="item.stateStr == '已结束'">已结束</view>
					</view>
				</scroll-view>
			</view>

			<!-- 秒杀底部显示 -->
			<navigator :url="`/pages/indexSub/seckillInfo/seckillInfo?id=${currentSlectItem.id}`">
				<view class="ticket-bottom bg-primary d-flex j-center a-center" style="height: 194rpx;">
					<!-- 秒杀项 -->
					<view class="ticket-item d-flex" style="width: 650rpx;height: 156rpx;">
						<!-- 左边图片 -->
						<view class="box-s">
							<image
								:src="currentSlectItem.activeConfigPic||'https://pic.cwyyt.cn/upload/img/20200506/1912581258_deflutms.png'"
								mode="aspectFill"
								style="height:156rpx;width: 220rpx; border-radius:10rpx 0rpx 0rpx 10rpx;"
								lazy-load
							></image>
						</view>

						<!-- 右边内容 -->
						<view class="bg-white d-flex flex-column box-s p-1 pl-2" style="width: 430rpx; border-radius:0rpx 10rpx 10rpx 0rpx;">
							<view class="d-flex j-sb">
								<view class="font-weight font-md text-ellipsis" style="width: 300rpx;">
									{{ currentSlectItem.activeConfigName }}
								</view>
								<view
									class="bg-primary radius-20 font-sm p-1 text-white"
									v-if="currentSlectItem.stateStr == '抢购中'"
								>
									去开抢
								</view>
								<view
									class="bg-secondary radius-20 font-sm p-1 text-white"
									v-else-if="currentSlectItem.stateStr == '已售罄'"
								>
									已抢光
								</view>
								<view
									class="bg-primary radius-20 font-sm p-1 text-white"
									v-else-if="currentSlectItem.stateStr == '未开始'"
								>
									即将开始
								</view>
								<view
									class="bg-secondary radius-20 font-sm p-1 text-white"
									v-else-if="currentSlectItem.stateStr == '已结束'"
								>
									已结束
								</view>
							</view>
							<view class="d-flex">
								<view class="text-primary">￥{{ currentSlectItem.msGoodsPrice | formatMoney }}/张</view>
								<view class="ml-3 text-light-muted line-through">
									￥{{ currentSlectItem.msGoodOriginalPrice | formatMoney }}
								</view>
							</view>
							<view class="d-flex j-sb">
								<view
									class="d-flex"
									:style="{ display: currentSlectItem.stateStr == '未开始' ? 'flex' : 'none' }"
								>
									<view class="font-sm text-primary a-self-center">距开始</view>
									<yyt-countdown
										ref="YytCountdownNoBegin"
										:receiveTime="currentSlectItem.msBeginTime"
										@onStopTime="currentSlectItem.stateStr = '抢购中'"
									></yyt-countdown>
								</view>
								<view
									class="d-flex"
									:style="{ display: currentSlectItem.stateStr == '抢购中' ? 'flex' : 'none' }"
								>
									<text class="font-sm text-primary a-self-center">距结束</text>
									<yyt-countdown
										ref="YytCountdownAlreadyBegin"
										:receiveTime="currentSlectItem.msEndTime"
										@onStopTime="currentSlectItem.stateStr = '已结束'"
									></yyt-countdown>
								</view>
								<view class="text-light-muted">仅剩{{ currentSlectItem.remainingCount }}</view>
							</view>
						</view>
					</view>
				</view>
			</navigator>
		</view>
	</block>
</template>

<script>
export { default } from './yyt-ms-shop-ticket.js';
</script>

<style lang="less" scoped>
@import url('yyt-ms-shop-ticket.less');
</style>
