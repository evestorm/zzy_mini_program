<template>
	<view class="huiyuan-fenxiao">
		<!-- 卡片 -->
		<view class="card">
			<view class="person-info">
				<view class="left"><image class="avatar" :src="userInfo.headImg" mode=""></image></view>
				<view class="right">
					<view class="type">{{ hyCardTitle }}</view>
					<view class="nickname">{{ userInfo.nickName }}</view>
					<view class="phone">{{ userInfo.phone }}</view>
				</view>
			</view>
			<view class="fenxiao-group">
				<navigator
					class="item left"
					hover-class="none"
					:url="`/pages/personalSub/memberRetail/memberRetail?id=${hyUserCardID}&index=0`"
				>
					<view class="title">已分销(个)</view>
					<view class="num">{{ alreadyFenxiao }}</view>
				</navigator>
				<navigator
					class="item"
					hover-class="none"
					:url="`/pages/personalSub/memberRetail/memberRetail?id=${hyUserCardID}&index=1`"
				>
					<view class="title">已核销(个)</view>
					<view class="num">{{ fenxiaoInfo.alreadyDisRecord }}</view>
				</navigator>
				<navigator
					class="item right"
					hover-class="none"
					:url="
						`/pages/personalSub/consumeRecord/consumeRecord?id=${hyUserCardID}&hyCardID=${hyCardID}&index=2`
					"
				>
					<view class="title">返现(¥)</view>
					<view class="num">{{ fenxiaoInfo.rebate | formatMoney }}</view>
				</navigator>
			</view>
		</view>
		<view class="info">
			<!-- 分销码区域 -->
			<view class="fenxiao-code-wrapper">
				<view class="banner">
					<!-- <image class="image" src="https://pic.cwyyt.cn/upload/img/20191107/1633593359_2019110759151.png" mode="widthFix"></image> -->
					<image
						class="image"
						:src="
							fenxiaoInfo.imgUrl ||
								'https://pic.cwyyt.cn/upload/img/20200321/1528332833_fx-bj.png'
						"
						mode="widthFix"
					></image>
				</view>
				<navigator hover-class="none" :url="`/pages/personalSub/fenxiaoCode/fenxiaoCode?hyUserCardID=${hyUserCardID}`">
					<button class="sw-btn">生成分销码</button>
				</navigator>
			</view>
			<!-- 底部提示 -->
			<!-- 警告区 -->
			<view class="warning-wrapper">
				<image class="warning-img" src="https://pic.cwyyt.cn/upload/yyticons/1553265326_info.png"></image>
				<text class="warning-info">
					生成的分销码图片保存至本地，到店出示图片即可参与分销活动，消费后即可返现。持卡人不可使用哦！
				</text>
			</view>
		</view>
	</view>
</template>

<script>
export { default } from './huiYuanFenXiao.js';
</script>

<style lang="less" scoped>
@import url('./huiYuanFenXiao.less');
</style>
