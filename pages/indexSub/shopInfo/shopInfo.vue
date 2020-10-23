<template>
	<!-- 宴会厅介绍 -->
	<!-- pages/hotel/shopInfo/shopInfo.wxml -->
	<view class="container" :style="{ paddingBottom: tabArr.currentTab == 1 ? '130rpx' : '130rpx' }">
		<!-- 主要信息 -->
		<view class="main">
			<!-- 画廊 -->
			<view class="gallery-wrapper">
				<!-- banner -->
				<swiper
					class="swiper"
					:indicator-dots="true"
					indicator-color="#F2F2F2"
					indicator-active-color="#0084F9"
					:autoplay="true"
					:interval="3000"
					:duration="1000"
				>
					<block v-for="(imgs, index) in shopInfo.photoList" :key="index">
						<swiper-item class="swiper-item">
							<image class="img" :src="imgs" mode="aspectFill"></image>
						</swiper-item>
					</block>
				</swiper>
				<!-- 收藏 -->
				<view class="collection" @tap="collectShop">
					<!-- <text :class="'icon iconfont icon-shoucang1 ' + (isCollect ? 'collectColor' : 'normal')"></text> -->
					<image class="img" v-show="isCollect" src="https://pic.cwyyt.cn/upload/yyticons/1728482848_collection_active.png"></image>
					<image class="img" v-show="!isCollect" src="https://pic.cwyyt.cn/upload/yyticons/170011011_zzy-收藏.png"></image>
				</view>
			</view>
			<!-- 基本信息 -->
			<view class="basic-wrapper">
				<view class="left">
					<view class="shop-title">
						<block v-if="shopInfo.storeName">{{ shopInfo.storeName }}</block>
					</view>
					<view class="shop-score">
						<view class="score-wrapper">
							<image
								:src="
									shopInfo.score >= 1
										? 'https://pic.cwyyt.cn/upload/yyticons/170023023_zzy-星级.png'
										: 'https://pic.cwyyt.cn/upload/yyticons/1616461646_star.png'
								"
								mode=""
							></image>
							<image
								:src="
									shopInfo.score >= 2
										? 'https://pic.cwyyt.cn/upload/yyticons/170023023_zzy-星级.png'
										: 'https://pic.cwyyt.cn/upload/yyticons/1616461646_star.png'
								"
								mode=""
							></image>
							<image
								:src="
									shopInfo.score >= 3
										? 'https://pic.cwyyt.cn/upload/yyticons/170023023_zzy-星级.png'
										: 'https://pic.cwyyt.cn/upload/yyticons/1616461646_star.png'
								"
								mode=""
							></image>
							<image
								:src="
									shopInfo.score >= 4
										? 'https://pic.cwyyt.cn/upload/yyticons/170023023_zzy-星级.png'
										: 'https://pic.cwyyt.cn/upload/yyticons/1616461646_star.png'
								"
								mode=""
							></image>
							<image
								:src="
									shopInfo.score >= 5
										? 'https://pic.cwyyt.cn/upload/yyticons/170023023_zzy-星级.png'
										: 'https://pic.cwyyt.cn/upload/yyticons/1616461646_star.png'
								"
								mode=""
							></image>
						</view>
						<view class="per-wrapper">
							<view class="unit">¥</view>
							<view class="num">
								<block v-if="shopInfo.avgPrice">{{ shopInfo.avgPrice }}</block>
							</view>
						</view>
					</view>
				</view>
				<view class="right">
					<view class="phone" @tap="callPhone"><image src="https://pic.cwyyt.cn/upload/yyticons/170111111_zzy-电话预定.png"></image></view>
				</view>
			</view>
			<!-- 更多信息 -->
			<view class="shop-item" @tap="goShopBusiness">
				<view class="left">
					<image
						class="img"
						src="https://pic.cwyyt.cn/upload/img/20200305/2031323132_shop.png"
						mode=""
					></image>
				</view>
				<view class="center">
					<view class="content">
						营业
						<text style="font-weight: 500; margin-left: 20rpx;">
							<block v-if="shopBusinessDtail.openTime">{{ shopBusinessDtail.openTime }}</block>
						</text>
					</view>
					<view class="tags-wrapper">
						<text
							class="tag-item"
							v-for="(featureItem, index) in shopBusinessDtail.special"
							:key="index"
						>
							{{ featureItem }}
						</text>
					</view>
				</view>
				<view class="right">
					<image
						class="img"
						src="https://pic.cwyyt.cn/upload/img/20200305/2034113411_next.png"
						mode=""
					></image>
				</view>
			</view>
			<navigator
				class="shop-item"
				v-if="shopBusinessDtail.isShowHall == '1'"
				hover-class="none"
				:url="
					`/pages/outUrl/outUrl?marketSetID=${shopIntroduceUrl}&paramValue=${
						shopBusinessDtail.banquetParame
					}`
				"
			>
				<view class="left">
					<image
						class="img"
						style="width: 36rpx; height: 32rpx;"
						src="https://pic.cwyyt.cn/upload/img/20200306/1818291829_ballroom.png"
						mode=""
					></image>
				</view>
				<view class="center">
					<view class="content">宴会厅介绍</view>
					<view class="intro-wrapper">
						<block v-if="shopLocationInfo.introducition">
							{{ shopLocationInfo.introducition }}
						</block>
					</view>
				</view>
				<view class="right">
					<image
						class="img"
						src="https://pic.cwyyt.cn/upload/img/20200305/2034113411_next.png"
						mode=""
					></image>
				</view>
			</navigator>
			<view class="shop-item" @tap="btnMap">
				<view class="left">
					<image
						class="img"
						style="width: 30rpx; height: 36rpx;"
						src="https://pic.cwyyt.cn/upload/img/20200306/1819331933_postion.png"
						mode=""
					></image>
				</view>
				<view class="center">
					<view class="content">
						<block v-if="shopLocationInfo.address">{{ shopLocationInfo.address }}</block>
					</view>
				</view>
				<view class="right">
					<image
						class="img"
						src="https://pic.cwyyt.cn/upload/img/20200305/2034113411_next.png"
						mode=""
					></image>
				</view>
			</view>
		</view>
		<!-- 线上商城 -->
		<!-- <view class="online-mall" @tap="goOnlineMall">
			<image src="https://pic.cwyyt.cn/upload/img/20200331/1617451745_online-shopping.png" class="img" mode="aspectFill"></image>
		</view> -->
		<!-- 次要信息 -->
		<view class="yyt_shopContent">
			<view class="yyt_shopContent_title">
				<!-- <view class data-current="0" @tap="clickTab">
					<text :class="' ' + (tabArr.currentTab == 0 ? 'active' : '')" data-current="0">优惠信息</text>
				</view> -->
				<view class="userComment" data-current="1" @tap="clickTab">
					<text :class="'userCommentTip ' + (tabArr.currentTab == 1 ? '' : '')" data-current="1">
						用户评价
					</text>
					<!-- <text :class="'userCommentTip ' + (tabArr.currentTab == 1 ? 'active' : '')" data-current="1">用户评价</text> -->
					<text :class="'userCommentName ' + (tabArr.currentTab == 1 ? '' : '')" data-current="1">
						({{ goodCount + badCount }}人评价)
					</text>
					<!-- <text :class="'userCommentName ' + (tabArr.currentTab == 1 ? 'active' : '')" data-current="1">({{ goodCount + badCount }}人评价)</text> -->
				</view>
			</view>
			<view class="yyt_shopContent_content_content">
				<!-- <view :class="'shopInfo_content yyt_shopContent_content_Item ' + (tabArr.currentContent == 0 ? 'isShow' : '')">
					<view class="yyt_shopContent_coupon" v-if="shopInfo.isSucceed == 1 && cardInfos.length > 0">
						<view class="yyt_shopContent_coupon_title" @tap="getMoreCoupon">
							<view class=" yyt_shopContent_coupon_title_l">
								<image src="https://pic.cwyyt.cn/upload/img/20200326/1110141014_ticket-icon.png"></image>
								<text class="yyt_shopContent_coupon_title_l_title">优惠券</text>
							</view>
							<view class="yyt_shopContent_coupon_title_r"><image class="img" src="https://pic.cwyyt.cn/upload/img/20200305/2034113411_next.png" mode=""></image></view>
						</view>
						<view class="coupon_item" style="padding-bottom: 10rpx;" v-for="(item, index) in cardInfos" :key="index">
							<view class="coupon_name" @tap="goDetail" :data-couponId="item.smallProgramCardID">{{ item.cardName }}</view>
							<view class="coupon_tip">
								<view class="tip_time" @tap="goDetail" :data-couponId="item.smallProgramCardID">
									<text class="tip_time_date">{{ item.effectiveRemark }}</text>
									<text class="tip_time_useTime">{{ item.useRangRemark }}可用</text>
								</view>
								<view class="tip_handle">
									<view
										class="tip_handleBtn"
										v-if="item.restrictionPerPerson > 0 && item.surplusCount > 0 && item.isNeedBuy"
										@tap.stop="goBuy"
										:data-index="index"
									>
										购买
									</view>
									<view
										class="tip_handleBtn disable_button"
										v-if="item.restrictionPerPerson <= 0 && item.surplusCount > 0 && item.isNeedBuy"
									>
										已购买
									</view>
									<view
										class="tip_handleBtn disable_button"
										v-if="item.restrictionPerPerson <= 0 && item.surplusCount <= 0 && item.isNeedBuy"
									>
										已购完
									</view>
									<view
										class="tip_handleBtn"
										v-if="item.restrictionPerPerson > 0 && item.surplusCount > 0 && !item.isNeedBuy"
										@tap.stop="goGet"
										:data-index="index"
									>
										领取
									</view>
									<view
										class="tip_handleBtn"
										v-if="item.restrictionPerPerson <= 0 && item.surplusCount > 0 && !item.isNeedBuy"
									>
										已领取
									</view>
									<view
										class="tip_handleBtn disable_button"
										v-if="item.restrictionPerPerson <= 0 && item.surplusCount <= 0 && !item.isNeedBuy"
									>
										已领完
									</view>
								</view>
							</view>
							<view class="coupon_salseInfo" @tap="goDetail" :data-couponId="item.smallProgramCardID">
								<view class="salseInfo_money" v-if="item.isNeedBuy">¥{{ item.buyAmount | formatMoney }}</view>
								<view class="salseInfo_desc" v-else>{{ item.cardUseRemark }}</view>
								<view class="salseInfo_num" v-if="item.isNeedBuy">销量<text>{{ item.salesCount }}</text></view>
								<view class="salseInfo_num" v-else>剩余<text>{{ item.surplusCount }}</text>张</view>
							</view>
						</view>
					</view>
					<view class="membership_card" v-if="shopInfo.isSucceed == 1 && unclaimed.hyCardTitle">
						<view class="membership_card_top" @tap="getMoreCard">
							<view class="membership_card_top_l">
								<image src="https://pic.cwyyt.cn/upload/img/20200326/1157235723_vip.png"></image>
								<text>会员卡</text>
							</view>
							<view class="membership_card_top_r"><image class="img" src="https://pic.cwyyt.cn/upload/img/20200305/2034113411_next.png"></image></view>
						</view>
						<view class="membership_card_bottom" @tap="goMemberCenter">
							<view class="membership_card_bottom_l" >
								<image :src="unclaimed.cardLogoUrl" mode="aspectFill"></image>
								<text>{{ unclaimed.hyCardTitle }}</text>
							</view>
							<view class="membership_card_bottom_r">
								<view class="getMemCard" @tap="getMemberCardInfo">{{ unclaimed.isGet ? '已领取' : '领取' }}</view>
							</view>
						</view>
					</view>
					<view class="user-defined" @tap="goUserDefined" v-if="shopBusinessDtail.busGuideUrl">
						<image mode="aspectFill" :src="weburl + '' + shopBusinessDtail.busGuideUrl"></image>
					</view>
					
				</view> -->
				<view
					:class="
						'userComment_content shopInfo_content yyt_shopContent_content_Item ' +
							(tabArr.currentContent == 1 ? 'isShow' : '')
					"
				>
					<view class="userComment_content_content">
						<view class="userComment_content_top">
							<!-- <view class="userComment_content_top_title">用户评价</view> -->
							<view class="userComment_content_top_content">
								<!-- <ul>
									<li :class="(isChecked==0?'is_checked':'normal')" data-index="0" @tap="selectItem">
										全部
										<text>({{goodCount+badCount}})</text>
									</li>
									<li :class="(isChecked==1?'is_checked':'normal')" data-index="1" @tap="selectItem">
										好评
										<text>({{goodCount}})</text>
									</li>
									<li :class="(isChecked==2?'is_checked':'normal')" data-index="2" @tap="selectItem"
										style="margin-right: 52rpx;">
										差评
										<text>({{badCount}})</text>
									</li>
									<li :class="(isChecked==3?'is_checked':'normal')" data-index="3" @tap="selectItem">
										图片
										<text>({{haveImgCount}})</text>
									</li>
								</ul> -->
								<view
									class="item"
									:class="isChecked == 0 ? 'is_checked' : 'normal'"
									data-index="0"
									@tap="selectItem"
								>
									全部
									<text>({{ goodCount + badCount }})</text>
								</view>
								<view
									class="item"
									:class="isChecked == 1 ? 'is_checked' : 'normal'"
									data-index="1"
									@tap="selectItem"
								>
									好评
									<text>({{ goodCount }})</text>
								</view>
								<view
									class="item"
									:class="isChecked == 2 ? 'is_checked' : 'normal'"
									data-index="2"
									@tap="selectItem"
								>
									差评
									<text>({{ badCount }})</text>
								</view>
								<view
									class="item"
									:class="isChecked == 3 ? 'is_checked' : 'normal'"
									data-index="3"
									@tap="selectItem"
								>
									图片
									<text>({{ haveImgCount }})</text>
								</view>
							</view>
						</view>
						<view class="userComment_content_main">
							<view
								class="userComment_list"
								v-if="commentList.length"
								v-for="(item, index) in commentList"
								:key="index"
							>
								<view class="userComment_pic">
									<image :src="item.headImg" mode="aspectFill"></image>
								</view>
								<view class="userComment_msg">
									<view class="userComment_msg_top">
										<text class="userComment_msg_userName">{{ item.nickName }}</text>
										<text class="userComment_msg_commentTime">{{ item.time }}</text>
									</view>
									<view class="userComment_msg_grade">
										<!-- <text class="userComment_msg_grade_name">打分</text> -->
										<view class="userComment_msg_grade_rating_stars">
											<!-- <text
												class="icon iconfont icon-shoucang1"
												:style="item == '1' ? 'color:#f6b925' : 'color:#e8e8e8'"
												v-for="(item, index) in item.score"
												:key="index"
											></text> -->
											<image
												v-for="(item, index) in item.score"
												:key="index"
												:src="
													item == '1'
														? 'https://pic.cwyyt.cn/upload/yyticons/170023023_zzy-星级.png'
														: 'https://pic.cwyyt.cn/upload/yyticons/1616461646_star.png'
												"
												mode=""
											></image>
											<!-- <image :src="shopInfo.score >= 2 ? 'https://pic.cwyyt.cn/upload/yyticons/170023023_zzy-星级.png' : 'https://pic.cwyyt.cn/upload/yyticons/1616461646_star.png'" mode=""></image>
											<image :src="shopInfo.score >= 3 ? 'https://pic.cwyyt.cn/upload/yyticons/170023023_zzy-星级.png' : 'https://pic.cwyyt.cn/upload/yyticons/1616461646_star.png'" mode=""></image>
											<image :src="shopInfo.score >= 4 ? 'https://pic.cwyyt.cn/upload/yyticons/170023023_zzy-星级.png' : 'https://pic.cwyyt.cn/upload/yyticons/1616461646_star.png'" mode=""></image>
											<image :src="shopInfo.score >= 5 ? 'https://pic.cwyyt.cn/upload/yyticons/170023023_zzy-星级.png' : 'https://pic.cwyyt.cn/upload/yyticons/1616461646_star.png'" mode=""></image> -->
										</view>
									</view>
									<view class="userComment_msg_Info">
										<text class="userComment_msg_Info_commentContent">
											{{ item.description }}
										</text>
									</view>
									<view class="userComment_msg_pic">
										<block v-for="(images, index) in item.photos" :key="index">
											<image
												:src="images"
												mode="aspectFill"
												@tap="previewImage"
												:data-num="num"
												:data-url="images"
												:data-index="index"
											></image>
										</block>
									</view>
									<view class="shopReply" v-if="item.reply">
										<view class="title">商家回复</view>
										<view class="content">{{ item.reply }}</view>
									</view>
								</view>
							</view>
							<view class="page__bd1" v-if="commentList.length != 0 && !hasMore">
								<view class="weui-loadmore weui-loadmore_line">
									<view class="weui-loadmore__tips weui-loadmore__tips_in-line">
										我也是有底线的
									</view>
								</view>
							</view>
						</view>
					</view>
					<view v-if="commentList.length == 0" class="NoComment">暂无评论</view>
				</view>
			</view>
		</view>
		<!-- 立即预定 -->
		<view class="book">
			<view class="weui-btn-area " v-if="shopInfo.isSucceed == 1">
				<!-- <form report-submit="true" @submit="goHome"><button class="goHome" formType="submit">去首页</button></form> -->
				<form report-submit="true" @submit="nowBook">
					<button class="weui-btn" formType="submit">立即预定</button>
				</form>
			</view>
			<view class="weui-btn-area" v-else><view class="weui-btn" type>该门店已下线</view></view>
		</view>
	</view>
</template>

<script>
export { default } from './shopInfo.js';
</script>
<style lang="less" scoped>
@import url('shopInfo.less');
</style>
