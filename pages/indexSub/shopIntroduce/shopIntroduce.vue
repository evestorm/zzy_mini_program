<!-- 作者:覃彬 -->
<template>
	<view>
		<!--内容-->
		<view class="page-content bg-white">
			<!-- ===============================================顶部店铺信息======================================== -->
			<view class="top-shop-info">
				<view class="top-swiper">
					<yyt-head-banner :storeid="shopId" v-if="shopId"></yyt-head-banner>
					
					<!-- <swiper
						class="swiper"
						:indicator-dots="false"
						autoplay="true"
						interval="3000"
						duration="1000"
						:current="swiperCurrent"
						@change="changeSwiper"
					>
						<block v-for="(imgs, index) in shopInfo.photoList" :key="index">
							<swiper-item @tap="redirectoutUrl(imgs.marketSetID,imgs.marketSetName,imgs.marketSetParam)">
								<image :src="basUrl + imgs.imgUrl" class="slide-image" mode="aspectFill" />
							</swiper-item>
						</block>
					</swiper>
					<view class="dots">
						<block v-for="(item, index) in shopInfo.photoList" :key="index">
							<view
								class="dot"
								:class="index == swiperCurrent ? ' active' : ''"
								@tap="changeSwiper($event, index)"
							></view>
						</block>
					</view> -->
					<view class="collection flex" @tap="changeScState">
						<image
							:src="
								shopInfo.isCollection == true
									? 'https://pic.cwyyt.cn/upload/yyticons/1728482848_collection_active.png'
									: 'https://pic.cwyyt.cn/upload/yyticons/170011011_zzy-收藏.png'
							"
							mode=""
						></image>
					</view>
				</view>
				<!-- =====店铺详情====== -->
				<view class="top-sec">
					<view class="flex">
						<view class="top-sec-left">
							<view class="shop-name">
								<block v-if="shopInfo.storeName">{{ shopInfo.storeName }}</block>
							</view>
							<view class="shop-score flex line-h0">
								<yyt-rate :score="shopInfo.score"></yyt-rate>
								<view class="per-wrapper flex">
									<view class="unit">¥</view>
									<view class="font-md">
										<block v-if="shopInfo.avgPrice">{{ shopInfo.avgPrice }}/人</block>
									</view>
								</view>
							</view>
						</view>
						<view class="top-sec-right flex">
							<image
								src="https://pic.cwyyt.cn/upload/yyticons/170111111_zzy-电话预定.png"
								class="phone"
								mode=""
								@tap="callPhone(shopInfo.telephone)"
							></image>
							<navigator
								hover-class="none"
								:url="`/pages/indexSub/shopInfo/shopInfo?id=${shopId}`"
								class="see-more"
							>
								详情>>
							</navigator>
						</view>
					</view>
					<view class="shop-address flex" @tap="btnMap">
						<image
							src="https://pic.cwyyt.cn/upload/yyticons/1359495949_zzy-定位.png"
							mode=""
							class="map-icon"
						></image>
						<view class="address d-flex j-sb a-center flex-1">
							<text><block v-if="shopInfo.address">{{ shopInfo.address }}</block></text>
							<image class="img" src="https://pic.cwyyt.cn/upload/img/20200305/2034113411_next.png" mode=""></image>
						</view>
					</view>
				</view>
				<!-- ==================================================我的权益轮播========================================== -->
				<view
					v-if="myCardList.length != 0"
					class="tower-swiper"
					@touchmove="towerMoveFun"
					@touchstart="towerStartFun"
					@touchend="towerEndFun"
				>
					<view
						class="tower-item"
						v-for="(item, index) in myCardList"
						:key="index"
						:style="{
							left:myCardList.length>4?'20rpx':30-(myCardList.length-1)*7+ 'rpx',
							display: item.zIndex <= 3 ? '' : 'none',
							marginLeft: item.zIndex * 30 + 'rpx',
							'--index': item.zIndex,
							zIndex: myCardList.length - item.zIndex
						}"
						:data-direction="direction"
					>
						<view class="swiper-item">
							<!-- 我的权益-会员卡 -->
							<navigator
								:url="`/pages/personalSub/memberCenter/memberCenter?id=${item.hyCardID}&shopId=${shopId}&isGet=1`"
								class="card p-3"
								hover-class="none"
								v-if="item.hyUserCardID"
								:style="item.cardImgUrl?'background-image:url('+item.cardImgUrl + ')':'background-image:url(https://pic.cwyyt.cn/upload/yyticons/1730293029_huiyunak@2x.png)'"
							>
								<view class="card-top d-flex a-center">
									<image
										class="logo rounded-circle"
										:src="item.cardLogoUrl || 'https://pic.cwyyt.cn/upload/img/20200319/121504154_card-logo.png'"
										style="width: 64rpx;height: 64rpx;margin-right: 16rpx;"
									></image>
									<view
										class="card-name  font-weight"
										:style="'color: #' + item.hyCardTitleColor"
									>
										{{ item.hyCardTitle }}
									</view>
								</view>
								<view
									class="card-mid d-flex a-center j-sa text-center"
									:style="'color: #' + item.hyCardTitleColor"
								>
									<view>
										<view class="mid-title">积分</view>
										<view class="mid-info font-weight">{{ item.hyUserScore }}</view>
									</view>
									<view>
										<view class="mid-title">会员等级</view>
										<view class="mid-info font-weight">{{ item.hyLevelName }}</view>
									</view>
									<view>
										<view class="mid-title">余额(￥)</view>
										<view class="mid-info font-weight">{{ item.hyUserAmount }}</view>
									</view>
								</view>
								<view class="card-bottom" :style="'color: #' + item.hyCardTitleColor">
									<text v-if="item.hyUserCodeFormat">
										{{ item.hyUserCodeFormat }}
									</text>
								</view>
							</navigator>
							<!-- 我的权益-优惠券 -->
							<navigator
								:url="`/pages/personalSub/couponDetail/couponDetail?smallProgramCardUserID=${item.smallProgramCardUserID}&shopId=${shopId}&shopName=${shopInfo.storeName}`"
								v-if="item.smallProgramCardUserID"
								class="coupons p-3"
								hover-class="none"
								style="background-image:url('https://pic.cwyyt.cn/upload/yyticons/140730730_zzy-bg-优惠券.png');color: #8c4715;"
							>
								<view class="coupons-top d-flex j-sb">
									<view class="coupon-name  font-weight">{{ item.cardName }}</view>
									<view class="coupon-btn font-weight">可使用</view>
								</view>
								<view class="coupons-mid line-h" v-if="item.effectiveRemark!=''">
									<text space="ensp">有效期： </text>
									<text class="use-date font-weight">{{ item.effectiveRemark }}</text>
								</view>
								<view class="coupons-bottom">
									<text>可用时段： </text>
									<text class="use-date font-weight">{{ item.useRangRemark }}</text>
								</view>
							</navigator>
						</view>
					</view>
					<!-- 我的权益指示图标 -->
					<view class="dots">
						<block v-for="(item, personIndex) in myCardList" :key="personIndex">
							<view
								class="dot"
								:class="personIndex == personalDots ? ' active' : ''"
							></view>
						</block>
					</view>
				</view>
				<!-- 没有个人权益时 -->
				<view
					v-if="myCardList.length == 0"
					class="no-my-card"
					style="background-image:url('https://pic.cwyyt.cn/upload/img/20200425/1353245324_zzy-bg-没有权益.png')"
				>
					<view class="no-my-card-text">您还没有领取权益哦</view>
				</view>
				<!-- ===============================客户经理================================ -->
				<view class="market flex">
					<block v-if="marketerPersonalInterest&&marketerPersonalInterest.marketerID">
						<navigator
							hover-class="none"
							:url="`/pages/common/salesManagerInfo/salesManagerInfo?salesID=${marketerPersonalInterest.marketerID}&shopID=${shopId}`"
						>
							<image
								class="head-img"
								:src="
									marketerPersonalInterest.imgUrl ||
										'https://pic.cwyyt.cn/upload/yyticons/1659345934_eg-head-img.png'
								"
							></image>
						</navigator>
						<view class="mid">
							<view class="mid-top flex">
								<view class="name">{{ marketerPersonalInterest.name }}</view>
								<image
									class="rate"
									src="https://pic.cwyyt.cn/upload/yyticons/170023023_zzy-星级.png"
								></image>
								<text class="text">{{ marketerPersonalInterest.score || 5 }}星服务</text>
							</view>
							<view class="mid-bottom">您的专属经理</view>
						</view>
						<view class="right" @tap="callPhone(marketerPersonalInterest.phone)">呼叫经理</view>
					</block>
				</view>
			</view>
			<!-- ===================================================线上商城+在线预订================================================ -->
			<view class="get-order flex j-center">
				<navigator
					v-if="shopInfo.isEnableWxShop"
					hover-class="none"
					:url="`/pages/indexSub/orderFood/orderFood?storeId=${shopId}`"
					class="card card-left"
					style="background-image:url('https://pic.cwyyt.cn/upload/yyticons/1653435343_zzy-newbg-在线商城背景.png')"
				>
					<view class="top-title">在线商城</view>
					<view class="bottom"><text space="emsp">线上下单 专人配送</text></view>
				</navigator>
				<navigator
					hover-class="none"
					:url="`/pages/indexSub/goBooking/goBooking?id=${shopId}`"
					class="card card-right"
					style="background-image:url('https://pic.cwyyt.cn/upload/yyticons/1653585358_zzy-newbg-在线预订.png')"
				>
					<view class="top-title">在线预定</view>
					<view class="bottom"><text space="emsp">订包房 订宴会</text></view>
				</navigator>
			</view>
			<!-- =================================================优惠活动=================================================== -->
			<view class="no-get">
				<view class="title d-flex j-sb a-center">
					<text>优惠活动</text>
					<text class="no-data mr-3" v-if="discountInfoList.length == 0">暂无优惠活动</text>
				</view>
				<scroll-view scroll-x="true" class="scoll-w mt-2" v-if="discountInfoList.length != 0">
					<view class="flex">
						<view class="" v-for="(item, disIndex) in discountInfoList" :key="disIndex">
							<!-- 秒杀券 -->
							<navigator
								:url="`/pages/indexSub/seckillInfo/seckillInfo?id=${item.id}`"
								hover-class="none"
								v-if="item.msGoodGUID"
								class="card-area coupons"
								style="background-image:url('https://pic.cwyyt.cn/upload/yyticons/171104114_zzy-bg-领取优惠券.png')"
							>
								<view class="coupons-top">
									<view class="coupons-name flex">
										<view class="name">{{ item.activeConfigName }}</view>
										<view class="btn d-flex j-center a-center">抢</view>
									</view>
									<view class="price flex">
										<view class="">
											￥
											<text class="num">{{ item.msGoodsPrice }}</text>
											/张
										</view>
										<text class="old-price">￥{{ item.msGoodOriginalPrice }}/张</text>
									</view>
								</view>
								<view class="coupons-bottom ">
									<view class="flex">
										<view class="text text-bold">
											{{item.stateCode | formatCardCode}}
										</view>
										<yyt-countdown
											v-if="item.stateCode == 3"
											:receiveTime="item.msBeginTime"
											@onStopTime="item.stateCode=4"
										></yyt-countdown>
										<yyt-countdown
											v-if="item.stateCode == 4"
											:receiveTime="item.msEndTime"
											@onStopTime="item.stateCode=5"
										></yyt-countdown>
									</view>
								</view>
							</navigator>
							<!-- 优惠券 -->
							<navigator
								hover-class="none"
								:url="`/pages/personalSub/coupons/coupons?smallProgramCardID=${item.smallProgramCardID}&shopId=${shopId}&shopName=${shopInfo.storeName}`"
								v-if="item.smallProgramCardID"
								class="card-area coupons"
								style="background-image:url('https://pic.cwyyt.cn/upload/yyticons/171104114_zzy-bg-领取优惠券.png')"
							>
								<view class="coupons-top">
									<view class="coupons-name flex">
										<view class="name">{{ item.cardName }}</view>
										<view class="btn d-flex j-center a-center">领</view>
									</view>
									<view class="use-remark flex" v-if="item.effectiveRemark!=''">
										<text>{{ item.effectiveRemark }}</text>
									</view>
								</view>
								<view class="coupons-bottom ">
									<view class="text text-bold">{{ item.useRangRemark }}</view>
								</view>
							</navigator>
							<!-- 会员卡 -->
							<navigator
								:url="`/pages/personalSub/memberCenter/memberCenter?id=${item.hyCardID}&shopId=${shopId}`"
								v-if="item.hyCardID"
								hover-class="none"
								class="card-area card"
								:style="item.cardImgUrl?'background-image:url('+item.cardImgUrl + ')':'background-image:url(https://pic.cwyyt.cn/upload/img/20200428/174402442_huiyuanka@2x.png)'"
							>
								<view class="top">
									<image class="logo" :src="item.cardLogoUrl||'https://pic.cwyyt.cn/upload/img/20200319/121504154_card-logo.png'"></image>
									<text class="card-name" :style="'color: #' + item.hyCardTitleColor">
										{{ item.hyCardTitle }}
									</text>
								</view>
							</navigator>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>

		<!--===============================底部==========================-->
		<view class="page-bottom">
			<!-- 我的订单 -->
			<navigator
				hover-class="none"
				class="list flex bg-white"
				:url="`/pages/myOrder/myOrderStore?storeID=${shopId}`"
			>
				<view class="left">我的订单</view>
				<view class="right"></view>
				<image
					class="get-more"
					src="https://pic.cwyyt.cn/upload/img/20200305/2034113411_next.png"
				></image>
			</navigator>
			<navigator
				hover-class="none"
				:url="`/pages/indexSub/shopList/shopList?cWCompanyID=${shopInfo.cwCompanyID}`"
				class="list flex bg-white"
			>
				<view class="left">全部门店</view>
				<view class="right">
					<block v-if="shopInfo.storeCount">{{ shopInfo.storeCount }}家</block>
				</view>
				<image
					class="get-more"
					src="https://pic.cwyyt.cn/upload/img/20200305/2034113411_next.png"
				></image>
			</navigator>
		</view>
	</view>
</template>

<script>
export { default } from './shopIntroduce.js';
</script>

<style lang="less" scoped>
@import '../../../lib/colorui/main.css';
@import url('shopIntroduce.less');
</style>
