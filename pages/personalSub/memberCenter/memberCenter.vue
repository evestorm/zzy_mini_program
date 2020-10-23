<template>
	<!-- 会员中心 -->
	<!-- pages/personalSub/memberCenter/memberCenter.wxml -->
	<view class="container" id="memeber_center">
		<view class="memberCenter">
			<view class="memberCenter_header">
				<view class="myCard" v-if="cardInfo.hyLevelBgUrl || cardInfo.cardImgUrl">
					<view
						class="card_list"
						:style="
							'background-image: url(' +
								(cardInfo.hyLevelBgUrl ? cardInfo.hyLevelBgUrl : cardInfo.cardImgUrl) +
								')'
						"
					>
						<view class="card_Info">
							<view class="left" v-if="cardInfo.cardLogoUrl">
								<view
									class="image"
									:style="
										'background: url(' +
											cardInfo.cardLogoUrl +
											') 0 0/100% 100% no-repeat'
									"
								></view>
								<text :style="'color: #' + cardInfo.hyCardTitleColor">
									{{ cardInfo.hyCardTitle }}
								</text>
							</view>
						</view>
						<view class="card_bottom" v-if="isGet">
							<text
								:style="'color: #' + cardInfo.hyCardCodeColor"
								v-for="(innerItem, Innerindex) in cardInfo.hyUserCode"
								:key="Innerindex"
							>
								{{ innerItem }}
							</text>
						</view>
					</view>
				</view>
				<!-- style="background: url(https://pic.cwyyt.cn/upload/img/20200317/150245245_bj.png) 0 0 /100% 100% no-repeat;" -->
				<view class="header_bottom">
					<view v-if="isGet" class="header_bottom-top">
						<view class="">
							<navigator
								class="header_bottom_c"
								v-if="isGet && cardInfo.isEnableScore"
								hover-class="none"
								:url="
									`/pages/personalSub/pointsRecord/pointsRecord?id=${cardInfo.hyUserCardID}`
								"
							>
								<text class="title w-110">积分</text>
								<view class="num" v-if="cardInfo.hyLevelName">
									<view>{{ cardInfo.hyUserScore }}</view>
								</view>
							</navigator>
							<view class="header_bottom_c header_bottom_cl" v-else></view>
						</view>
						<view class="header_bottom_c">
							<text class="title">会员等级</text>
							<text class="type" v-if="cardInfo.hyLevelName">{{ cardInfo.hyLevelName }}</text>
							<!-- <text class="no_num" v-else></text> -->
						</view>
						<view class="">
							<navigator
								class="header_bottom_c"
								v-if="isGet && cardInfo.isEnableStore"
								hover-class="none"
								:url="
									`/pages/personalSub/consumeRecord/consumeRecord?id=${
										cardInfo.hyUserCardID
									}&hyCardID=${cardInfo.hyCardID}`
								"
							>
								<!-- <view class="header_bottom_c" @tap="goSurplus" v-if="isGet && cardInfo.isEnableStore"> -->
								<text class="title w-110">余额(￥)</text>
								<view class="num" v-if="cardInfo.hyLevelName">
									<view>{{ cardInfo.hyUserAmount | formatPrice(2) }}</view>
								</view>
								<text class="no_num" v-else></text>
							</navigator>
							<view class="header_bottom_c  header_bottom_cl" v-else></view>
						</view>
					</view>
					<view class="header_bottom-bot">
						<view
							class="header_bottom-btn"
							v-if="isGet"
							@tap="goCode"
							:data-id="cardInfo.hyUserCardID"
						>
							会员支付
						</view>
						<view
							class="header_bottom-btn"
							:class="cardInfo.isPutaway == 1 ? '' : 'gray'"
							v-else
							@tap="collectCard"
							:data-id="cardInfo.hyCardID"
						>
							{{ cardInfo.isPutaway == 1 ? '领取会员卡' : '未上架' }}
						</view>
					</view>
				</view>
			</view>

			<view class="memberCenter_content memberCenter_content_bottom">
				<!-- 固定列表 -->
				<navigator
					v-if="isGet"
					class="weui-cells weui-cells_after-title memberCenter_bottom_item"
					hover-class="none"
					:url="
						`/pages/personalSub/memberMaterial/memberMaterial?hyUserCardID=${
							cardInfo.hyUserCardID
						}&storeID=${shopId}&materialType=2`
					"
				>
					<view class="weui-cell weui-cell_access">
						<view class="weui-cell__bd">
							<view class="memberCenter_item"><text>完善会员资料</text></view>
						</view>
						<view class="weui-cell__bd_r">
							<image
								src="https://pic.cwyyt.cn/upload/img/20191106/150747747_arrow.png"
								class="arrowPic"
							></image>
						</view>
					</view>
				</navigator>
				<navigator
					class="weui-cells weui-cells_after-title memberCenter_bottom_item"
					hover-class="none"
					:url="
						`/pages/indexSub/memberCardInfo/memberCardInfo?storeID=${shopId}&hyCardID=${
							cardInfo.hyCardID
						}`
					"
				>
					<view class="weui-cell weui-cell_access">
						<view class="weui-cell__bd">
							<view class="memberCenter_item"><text>会员须知</text></view>
						</view>
						<view class="weui-cell__bd_r">
							<image
								src="https://pic.cwyyt.cn/upload/img/20191106/150747747_arrow.png"
								class="arrowPic"
							></image>
						</view>
					</view>
				</navigator>
				<navigator
					v-if="isCanDistribution == true"
					class="weui-cells weui-cells_after-title memberCenter_bottom_item"
					hover-class="none"
					:url="
						`/pages/personalSub/huiYuanFenXiao/huiYuanFenXiao?hyCardID=${
							cardInfo.hyCardID
						}&hyUserCardID=${cardInfo.hyUserCardID}&storeID=${shopId}&hyCardTitle=${
							cardInfo.hyCardTitle
						}`
					"
				>
					<view class="weui-cell weui-cell_access">
						<view class="weui-cell__bd">
							<view class="memberCenter_item"><text>会员分销</text></view>
						</view>
						<view class="weui-cell__bd_r">
							<image
								src="https://pic.cwyyt.cn/upload/img/20191106/150747747_arrow.png"
								class="arrowPic"
							></image>
						</view>
					</view>
				</navigator>
				<!-- 动态列表 -->
				<view
					class="weui-cells weui-cells_after-title memberCenter_bottom_item"
					v-for="(item, index) in cardInfo.hyInRuleList"
					:key="index"
				>
					<view
						class="weui-cell weui-cell_access"
						:data-type="item.inRuleType"
						:data-id="item.inRuleParam"
						:data-marketSetParam="item.leadTypeParam"
						@tap="goInrule"
					>
						<view class="weui-cell__bd">
							<view class="memberCenter_item">
								<text>{{ item.inRuleName }}</text>
							</view>
						</view>
						<view class="weui-cell__bd_r">
							<text>{{ item.inRuleRemark }}</text>
							<image
								src="https://pic.cwyyt.cn/upload/img/20191106/150747747_arrow.png"
								class="arrowPic"
							></image>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 弹出图片 -->
		<cover-view class="mask" catchtouchmove="preventTouchMove" v-if="showModal" @tap="showModal = false">
			<cover-view class="modalDlg" v-if="showModal" @tap.stop="">
				<cover-image class="img" :src="shareImgSrc"></cover-image>
				<cover-view class="btn" @tap="shareImg">保存图片</cover-view>
			</cover-view>
		</cover-view>
		<view class="bottom-btn">
			<!-- <button class="btn" open-type="share" v-if="isGet">发送给好友</button> -->
			<view class="btn" @tap="openPopup" v-if="isGet && cardInfo.isEnableWxShare">我的分账码</view>
		</view>
	</view>
</template>

<script>
export { default } from './memberCenter.js';
</script>

<style lang="less" scoped>
@import url('memberCenter.less');
</style>
