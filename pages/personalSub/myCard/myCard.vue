<!--我的卡包-->
<template>
	<view class="container">
		<view class="noCollect" :style="loaded ? '' : 'display:none;'" v-if="!cardInfo || cardInfo.length == 0">
			<image src="https://pic.cwyyt.cn/upload/img/20191106/1623532353_no_memberCard.png" role="img"></image>
		</view>
		<view class="myCard" v-if="cardInfo && cardInfo.length != 0">
			<view
				class="card_list"
				v-for="(item, index) in cardInfo"
				:key="index"
				:style="'background: url(' + (item.hyLevelBgUrl ? item.hyLevelBgUrl : item.cardImgUrl) + ') 0 0/100% 100% no-repeat'"
				:data-id="item.hyCardID"
				@tap="goMemberCenter"
			>
				<view class="card_Info">
					<view class="left">
						<view class="image" :style="'background: url(' + item.cardLogoUrl + ') 0 0/100% 100% no-repeat'"></view>
						<text :style="'color: #' + item.hyCardTitleColor">{{ item.hyCardTitle }}</text>
					</view>
					<text class="right" :style="'color: #' + item.hyCardTitleColor">{{ item.hyLevelName }}</text>
				</view>
				<view class="card_bottom" :style="'color: #' + item.hyCardCodeColor">
					<text v-for="(innerItem, index2) in item.hyUserCode" :key="index2">{{ innerItem }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export { default } from './myCard.js';
</script>
<style lang="less" scoped>
@import './myCard.less';
</style>
