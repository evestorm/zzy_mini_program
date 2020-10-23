<!-- 确认订单 -->
<template>
	<view class="">
		<view class="deliver-info" style="padding-bottom: 0;">
			<view class="mar-top">
				<!-- 顶部自提 -->
				<view class="deliver-list car-pad">
					<image src="https://pic.cwyyt.cn/upload/yyticons/1640434043_distribution-car.png" mode="" class="car-img"></image>
					<text class="list-title">配送方式</text>
					<view class="list-right">
						<view class="inline" v-if="shoppInfo.isEnableSelf" @tap="orderSendType = 1;">
							<image
								:src="
									orderSendType == 1
										? 'https://pic.cwyyt.cn/upload/yyticons/1451265126_address-sel.png'
										: 'https://pic.cwyyt.cn/upload/yyticons/1451345134_address-unsel.png'
								"
								mode=""
								class="address-img"
							></image>
							<text class="address-tetxt mar">自提</text>
						</view>
						<view class="inline" @tap="orderSendType = 2;">
							<image
								:src="
									orderSendType == 2
										? 'https://pic.cwyyt.cn/upload/yyticons/1451265126_address-sel.png'
										: 'https://pic.cwyyt.cn/upload/yyticons/1451345134_address-unsel.png'
								"
								mode=""
								class="address-img"
							></image>
							<text class="address-tetxt">配送</text>
						</view>
					</view>
				</view>

				<!-- ======================================联系方式========================================== -->
				<view class="orderSelf" :style="{ display: orderSendType == 1 ? 'block' : 'none' }"  v-if="shoppInfo.isEnableSelf">
					<view class="d-flex j-sb row  border-bottom">
						<view class="col-3 list-title font-30 line-h" style="color: #737373;">联系电话:</view>
						<view class="col-8" style="color: #3c3c3c;">
							<input
								placeholder="请输入手机"
								type="number"
								class="font-26 line-h text-right w-100"
								v-model="userInfo.orderUserPhone"
							/>
						</view>
					</view>
					<view class="d-flex j-sb row mt-3  border-bottom">
						<view class="col-3 list-title font-30 line-h" style="color: #737373;">联系姓名:</view>
						<view class="col-8" style="color: #3c3c3c;">
							<input
								placeholder="请输入姓名"
								class="font-26 line-h text-right"
								v-model="userInfo.orderUserName"
							/>
						</view>
					</view>
				</view>
				<!-- ======================================收货详细========================================== -->
				<navigator
					url="/pages/indexSub/addressList/addressList"
					hover-class="none"
					class="address border-top"
					:style="{ display: orderSendType == 2 ? 'flex' : 'none' }"
				>
					<!-- 默认地址 -->
					<view class="left">
						<view class="top" v-if="isAddress">
							<text>{{ address.orderUserName }}</text>
							<text>{{ address.orderUserPhone }}</text>
						</view>
						<view class="bottom" v-if="isAddress">{{ address.orderUserAddress }}</view>
					</view>
					<!-- 无地址 -->
					<view class="left div-flex" v-if="!isAddress">
						<image src="https://pic.cwyyt.cn/upload/yyticons/1132173217_收货地址@2x.png" mode="" class="map-img"></image>
						<text>添加收货地址</text>
					</view>
					<image src="https://pic.cwyyt.cn/upload/yyticons/160957957_下一步@2x.png" mode="" class="go-more"></image>
				</navigator>
			</view>
		</view>

		<!-- ======================================菜单内容========================================== -->
		<view class="order-info">
			<navigator open-type="navigateBack">
				<view class="hotel">
					<image
						:src="
							shoppInfo.shopImg ||
								'https://pic.cwyyt.cn/upload/img/20200331/1620282028_hotel.png'
						"
						mode=""
						class="hotel-img"
					></image>
					<text class="hotel-title">{{ shoppInfo.shopName }}</text>
					<image src="https://pic.cwyyt.cn/upload/yyticons/160957957_下一步@2x.png" mode="" class="arrow-right"></image>
				</view>
			</navigator>
			<view class="order-list">
				<view class="order-list-item" v-for="(item, index) in shoppingCartList" :key="index">
					<image :src="item.productUrl" mode="" class="food-img"></image>
					<view class="d-flex j-sb flex-1">
						<view>
							<view class="item-name">{{ item.productName }}</view>
							<view class="item-price">
								<text>￥</text>
								<text class="price">{{ item.productPrice | formatMoney }}</text>
								<text class="except">/</text>
								<text>{{ item.productUnit }}</text>
								<view class="font-22 ml-1 text-warning" v-if="item.buyMuchCount">
									限购 {{ item.buyMuchCount }}
								</view>
							</view>
						</view>

						<view class="a-self-center">
							<text>X</text>
							<text>{{ item.num }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- ======================================订单备注========================================== -->
		<view class="deliver-info">
			<view class="mar-top">
				<view class="deliver-list remark-pad">
					<image src="https://pic.cwyyt.cn/upload/yyticons/1643434343_distribution-remark.png" mode="" class="remark-img"></image>
					<text class="list-title">留言</text>
				</view>
				<textarea
					v-model="orderRemark"
					class="remark"
					placeholder="请输入备注信息"
					placeholder-style="fontSize:24rpx;color:#999"
					auto-height
				/>
			</view>
			<view class="mar-top">
				<view class="deliver-list pay-pad">
					<image src="https://pic.cwyyt.cn/upload/yyticons/1649454945_pay.png" mode="" class="pay-img"></image>
					<text class="list-title">金额</text>
					<view class="list-right">
						<text class="right-rmb">￥</text>
						<text class="right-num">{{ cartListAmount | formatMoney }}</text>
					</view>
				</view>
				<view class="deliver-list fee-pad">
					<image src="https://pic.cwyyt.cn/upload/yyticons/1649454945_pay.png" mode="" class="fee-img"></image>
					<text class="list-title">打包费</text>
					<view class="list-right">
						<text class="right-rmb">￥</text>
						<text class="right-num">{{ packAmount | formatMoney }}</text>
					</view>
				</view>
				<view class="deliver-list fee-pad">
					<image src="https://pic.cwyyt.cn/upload/yyticons/1641314131_distribution-fee.png" mode="" class="fee-img"></image>
					<text class="list-title">运费(不参与优惠)</text>
					<view class="list-right">
						<text class="right-rmb">￥</text>
						<text class="right-num">{{ freight | formatMoney }}</text>
					</view>
				</view>

				<!-- 选择优惠卷 -->
				<view class="deliver-list fee-pad" @tap="tapCoup()">
					<image
						:src="
							selectDisCountInfo.isSelectCoupons
								? 'https://pic.cwyyt.cn/upload/yyticons/1451265126_address-sel.png'
								: 'https://pic.cwyyt.cn/upload/yyticons/1451345134_address-unsel.png'
						"
						mode=""
						class="discount-img"
					></image>

					<text class="list-title">优惠券</text>
					<navigator
						:url="
							`/pages/personalSub/myCoupon/myCoupon?storeId=${
								shoppInfo.storeId
							}&orderPrice=${originalTotalCount}`
						"
						hover-class="none"
						class="list-right"
					>
						<text class="use-num" space="emsp" v-if="selectDisCountInfo.isSelectCoupons == true">
							{{ selectDisCountInfo.couponItem.cardName || '' }} 已优惠{{
								selectDisCountInfo.disCountMoney | formatMoney
							}}元
						</text>
						<text class="use-num" v-else>{{ disCountInfo.coupons.canUseCount }}张可用</text>
						<image src="https://pic.cwyyt.cn/upload/yyticons/160957957_下一步@2x.png" mode="" class="arrow-right"></image>
					</navigator>
				</view>

				<!-- 选择会员卡 -->
				<view class="deliver-list fee-pad" @tap="tapCard()">
					<image
						:src="
							selectDisCountInfo.isSelectCard
								? 'https://pic.cwyyt.cn/upload/yyticons/1451265126_address-sel.png'
								: 'https://pic.cwyyt.cn/upload/yyticons/1451345134_address-unsel.png'
						"
						mode=""
						class="discount-img"
					></image>
					<text class="list-title">会员优惠</text>
				</view>

				<uni-collapse
					accordion="true"
					class="member-benefits"
					:style="{ display: selectDisCountInfo.isSelectCard ? 'block' : 'none' }"
					@change="changeCard"
				>
					<uni-collapse-item
						:title="item.hyCardTitle"
						:open='carIndex==0'
						:name="carIndex"
						v-for="(item, carIndex) in disCountInfo.hyCard"
						:key="carIndex"
					>
						<view class="member-discount d-flex a-center">
							<text space="emsp">
								{{ item.hyCardTitle }} 享受折扣{{ item.hyLevelDiscount }}折
							</text>
						</view>
						<!-- 开启积分并且开启了在商城可以是应用积分抵扣才能使用 才展示积分消费 -->
						<view
							class="member-points"
							v-if="
								item.isEnableScore &&
									item.isUseScoreInShop &&
									item.orderFeeScore <= totalCount
							"
						>
							<view class="text">
								本次使用{{ item.useScore }}分：可抵扣
								{{ (item.useScore * item.scorePrecent)|formatMoney }}元
							</view>

							<image
								:style="{ display: item.isUseScore ? 'block' : 'none' }"
								src="https://pic.cwyyt.cn/upload/yyticons/1623222322_address-edit.png"
								mode=""
								class="edit"
								@tap="isEditPoints = true"
							></image>
							<switch
								@change="userCardScore(item)"
								:checked="item.isUseScore"
								color="#0184f9"
							></switch>
						</view>
					</uni-collapse-item>
				</uni-collapse>

				<!-- 选择会员卡 -->
				<view
					class="deliver-list fee-pad"
					@tap="
						selectDisCountInfo.isSelectCoupons = false;
						selectDisCountInfo.isSelectCard = false;
					"
				>
					<image
						:src="
							(!selectDisCountInfo.isSelectCard && !selectDisCountInfo.isSelectCoupons)
								? 'https://pic.cwyyt.cn/upload/yyticons/1451265126_address-sel.png'
								: 'https://pic.cwyyt.cn/upload/yyticons/1451345134_address-unsel.png'
						"
						mode=""
						class="discount-img"
					></image>
					<text class="list-title">不使用优惠</text>
				</view>

				<!-- <button
					class="mini-btn"
					type="primary"
					size="mini"
					@tap="
						selectDisCountInfo.isSelectCoupons = false;
						selectDisCountInfo.isSelectCard = false;
					"
				>
					不用优惠
				</button> -->
			</view>
		</view>
		<!-- ======================================底部固定信息========================================== -->
		<view class="bottom-btn">
			<view class="text">合计</view>
			<view class="count">
				<text>￥</text>
				<text class="num">{{ orderPrice | formatMoney }}</text>
			</view>
			<view class="btn" @tap="createOrder">提交订单</view>
		</view>
		<!-- 底部编辑积分抵扣弹窗 -->
		<view class="points-tip" v-show="isEditPoints" @tap="isEditPoints = false"></view>
		<view class="bottom-fixed" v-show="isEditPoints">
			<view class="top-title">积分抵扣</view>
			<view class="mid-info">
				<text class="have">共{{ selectDisCountInfo.cardItem.hyUserScore }}积分</text>
				<text class="use">本次使用</text>
				<input type="number" v-model="selectDisCountInfo.cardItem.inputUseScore" class="num" />
				<text class="use">分</text>
			</view>
			<view class="points-bottom-btn">
				<view class="btn cancel" @tap="isEditPoints = false">取消</view>
				<view class="btn confirm" @tap="tapScoreSure()">确定</view>
			</view>
		</view>
	</view>
</template>

<script>
export { default } from './confirmOrder.js';
</script>
<style lang="less" scoped>
@import './confirmOrder.less';
</style>
