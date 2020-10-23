<template>
	<view class="my-banquet">
		<!-- <view class="bookings-top"></view> -->
		<!-- 列表 -->
		<view class="list-wrapper" @touchmove.stop.prevent="() => {}">
			<mescroll-uni
				:topbar="true"
				:down="downOption"
				@down="downCallback"
				:up="upOption"
				@up="upCallback"
				:top="navFilterBottom"
				:bottom="swBottom"
			>
				<view class="empty-wrapper" v-if="dataList.length == 0">
					<view class="empty-tip">
						<image
							class="img"
							src="https://pic.cwyyt.cn/upload/img/20200310/2017571757_empty-order.png"
							mode=""
						></image>
						<view class="text">您还没有订单哦</view>
					</view>
					<navigator
						open-type="switchTab"
						class="btn d-flex a-center j-center"
						hover-class="none"
						url="/pages/index/index"
					>
						去预订
					</navigator>
				</view>
				<navigator
					class="item"
					v-for="(item, index) in dataList"
					:key="index"
					:url="`/pages/myOrderSub/banquetDetail/banquetDetail?banquetId=${item.id}`"
				>
					<!-- 简介 -->
					<view class="intro">
						<view class="banquet-name">{{ item.banquetThemeTypeName }}</view>
						<view class="banquet-sub-name">{{ item.businessName }}({{ item.branchName }})</view>
						<view class="see-more">
							<image class="img" src="https://pic.cwyyt.cn/upload/yyticons/160957957_下一步@2x.png" mode=""></image>
						</view>
					</view>
					<!-- 详情 -->
					<view class="desc">
						<image
							class="img"
							:src="
								item.imgUrl_Server
									? item.imgUrl_Server
									: 'https://pic.cwyyt.cn/upload/img/20200113/1054155415_酒店图片.png'
							"
							mode=""
						></image>
						<view class="order-info">
							<view class="time">
								<image class="img" src="https://pic.cwyyt.cn/upload/yyticons/1651175117_宴会时间@2x.png" mode=""></image>
								<view class="date red">{{ item.banquetDate | parseShortDate }}</view>
							</view>
							<view class="type">
								<image class="img" src="https://pic.cwyyt.cn/upload/yyticons/1657425742_banquet.png" mode=""></image>
								<!-- 宴会主题名称 -->
								<view class="banquet-type-name">{{ item.themeConfName }}</view>
								<!-- 餐别 -->
								<view class="banquet-type-name">{{ item.diningTypeName }}</view>
								<!-- 套餐 -->
								<view class="banquet-type-name">{{ item.banquetPackageName }}</view>
							</view>
							<view class="other">
								<view>
									<image class="img" src="https://pic.cwyyt.cn/upload/yyticons/160134134_tongchou.png" mode=""></image>
									<view class="title">统筹人：</view>
									<view class="name">{{ item.coordinatorName || '无' }}</view>
								</view>
								<view>
									<image class="img" src="https://pic.cwyyt.cn/upload/yyticons/1555415541_kefujingli.png" mode=""></image>
									<view class="title">客服经理：</view>
									<view class="name">{{ item.marketerName || '无' }}</view>
								</view>
							</view>
						</view>
					</view>
				</navigator>
			</mescroll-uni>
		</view>
	</view>
</template>

<script>
export { default } from './myBanquet.js';
</script>

<style lang="less" scoped>
@import url('myBanquet.less');
@import url('../orderCard.less');
</style>
