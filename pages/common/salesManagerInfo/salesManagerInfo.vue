<!-- 客服经理详情 -->
<template>
	<view class="container cs-detail">
		<!-- 顶部 -->
		<navigator :url="`/pages/indexSub/shopInfo/shopInfo?id=${shopID}`" hover-class="none"  class="yyt-list cs-top">
			<view class="yyt-list-row yyt-margin-top-bg yyt-margin-bottom-bg">
			  <view class="left">
					<image class="icon" :src="shopInfo.imgUrl" mode=""></image>
					<view class="title">{{ shopInfo.storeName }}</view>
			  </view>
			  <view class="right">
				<image class="icon" src="https://pic.cwyyt.cn/upload/yyticons/1625432543_arrowRight.png" mode=""></image>
			  </view>
			</view>
		</navigator>
		<!-- 主体 -->
		<block v-if="userInfo">
			<view class="main">
				<view class="cs-info">
					<image class="avatar" :src="userInfo.imgUrl"></image>
					<view class="info-center">
						<view class="name-wrapper">
							<view class="name">
								{{ userInfo.name }}
							</view>
							<!-- <view class="detail" @tap="goDetail">
								详情>>
							</view> -->
						</view>
						<view class="phone">
							{{ userInfo.phone }}
						</view>
					</view>
					<view class="phone-wrapper" @tap="callPhone">
						<image class="img" src="https://pic.cwyyt.cn/upload/yyticons/170111111_zzy-电话预定.png" mode=""></image>
					</view>
				</view>
				<view class="yyt-list-item">
				  <view class="title">职位</view>
				  <view class="content">客户经理</view>
				</view>
				<view class="yyt-list-item">
				  <view class="title">服务</view>
				  <view class="content shopInfo_list_content_rating_stars">
					  <text
					    class="icon iconfont icon-shoucang1"
					    :style="userInfo.score >= 1 ? 'color:#FF550B' : 'color:#e8e8e8'"
					  ></text>
					  <text
					    class="icon iconfont icon-shoucang1"
					    :style="userInfo.score >= 2 ? 'color:#FF550B' : 'color:#e8e8e8'"
					  ></text>
					  <text
					    class="icon iconfont icon-shoucang1"
					    :style="userInfo.score >= 3 ? 'color:#FF550B' : 'color:#e8e8e8'"
					  ></text>
					  <text
					    class="icon iconfont icon-shoucang1"
					    :style="userInfo.score >= 4 ? 'color:#FF550B' : 'color:#e8e8e8'"
					  ></text>
					  <text
					    class="icon iconfont icon-shoucang1"
					    :style="userInfo.score >= 5 ? 'color:#FF550B' : 'color:#e8e8e8'"
					  ></text>
				  </view>
				</view>
			</view>
			<!-- 底部 -->
			<view class="bottom">
				<view class="title">
					简介
				</view>
				<view class="desc">
					{{ userInfo.desc }}
				</view>
			</view>
			
			<!-- 固定 -->
			<view class="fix-bottom">
			  <form report-submit="true" @submit="goSubmit" style="width:100%;">
			    <button
			      class="btn"
			      formType="submit"
			      style="width: auto;"
			    >
			      找他预定
			    </button>
			  </form>
			</view>
				
		</block>

	</view>
</template>

<script src="./salesManagerInfo.js"></script>
<style lang="less" scoped>
@import '../../../common/yyt-common.less';
@import './salesManagerInfo.less';
</style>