<template>
	<view class="my-other">
		<!-- 搜索栏 -->
		<view class="bookings-top w-100">
		<view class="search-wrapper" v-if="nowWeb=='shopSearch'">
			<view class="search-img">
				<image class="icon" src="https://pic.cwyyt.cn/upload/yyticons/160532532_search.png" mode=""></image>
			</view>
			<input class="search-input" type="number" :value="inputVal" @input="inputTyping" placeholder="请输入手机号查询订单" placeholder-class="placeholder" />
			<view class="search-btn" v-if="inputShowed" @tap="triggerSearch">
				搜索
			</view>
		</view>
		</view>
		<!-- 列表 -->
		<view class="list-wrapper" @touchmove.stop.prevent="() => {}" v-if="nowWeb=='shopSearch'">
			<mescroll-uni
				@init="mescrollInit"
				:topbar="true"
				:down="downOption"
				@down="downCallback"
				:up="upOption"
				@up="upCallback"
				:top="navFilterBottom"
				:bottom="swBottom"
			>
				<view class="empty-wrapper" v-if="emptyEleShow == true && !showModal">
					<view class="empty-tip">
						<image class="img" src="https://pic.cwyyt.cn/upload/img/20200310/2017571757_empty-order.png" mode=""></image>
						<view class="text">
							您还没有订单哦
						</view>
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
						:url="`/pages/myOrderSub/bookingInfo/bookingInfo?orderId=${item.customerBookOrderID}`"
					>
					<!-- 简介 -->
					<view class="intro">
						<view class="shop-name">
							{{item.shopName}}
						</view>
						<view class="order-status">
							<!-- {{formatTag(item)}} -->
						</view>
						<view class="see-more">
							<image class="img" src="https://pic.cwyyt.cn/upload/yyticons/160957957_下一步@2x.png" mode=""></image>
						</view>
					</view>
					<!-- 详情 -->
					<view class="desc">
						<image class="img" :src="item.shopImg" mode=""></image>
						<view class="order-info">
							<view class="time">
								<image class="img" src="https://pic.cwyyt.cn/upload/yyticons/1630543054_date.png" mode=""></image>
								<view class="date">{{item.bookDate | parseShortDate}}</view>
								<view class="suffix">{{item.diningTypeName}}{{item.bookTime}}</view>
							</view>
							<view class="type"  v-if="item.bookOrderTypeName">
								<image class="img" src="https://pic.cwyyt.cn/upload/yyticons/1657425742_banquet.png" mode=""></image>
								<!-- 如果没宴会，加个tip的class -->
								<view class="name">{{item.bookOrderTypeName}}</view>
							</view>
							<view class="other">
								<view>
									<image class="img" src="https://pic.cwyyt.cn/upload/yyticons/170222222_cs.png" mode=""></image>
									<view class="title">客服经理：</view>
									<view class="name">{{item.marketerName || '无'}}</view>
								</view>
								<view @tap.stop="callPhone(item.marketerPhone || null)">
									<image class="img" src="https://pic.cwyyt.cn/upload/yyticons/170111111_zzy-电话预定.png" mode=""></image>
									<view class="name">{{item.marketerPhone || '无'}}</view>
								</view>
							</view>
						</view>
					</view>
					<!-- 动作 -->
					<view class="action">
						<!-- <view @tap.stop="cancelOrder(item)" class="btn" v-if="item.tag == '待确定'">取消订单</view>
						<view @tap.stop="shareOrder(item)" class="btn blue" v-if="item.tag == '待使用' || item.tag == '待支付' || item.tag == '已支付' || item.tag == '商户预订单' || !isPayMaterialMoney(item)">去分享</view>
						<view @tap.stop="evaluationOrder(item)" class="btn blue" v-if="item.tag == '去评价'">去评价</view> -->
					</view>
				</navigator>
			</mescroll-uni>
		</view>
		<!-- 对话框 -->
		<view class="modalDlg" v-if="showModal&&nowWeb=='shopSearch'">
			<view class="modalDlg_top">
				<text class="modalDlg_top_text">身份验证</text>
			</view>
			<view class="modalDlg_content">
				<view class="telPhoneArea">
					<text>验证号码:</text>
					<input type="tel" :value="inputVal" disabled></input>
				</view>
				<view class="vcodeArea">
					<text>验证码:</text>
					<input class="vcodeInput" type="number" :value="vcode" placeholder="请输入验证码" @input="vcodeInput" :disabled="yzmInputDisabled"></input>
				</view>
			</view>
			<view class="modalDlg_bottom">
		    <form report-submit="true" @submit="cancel" class="cancelBtn">
		      <button formType="submit">取消</button>
		    </form>
		    <form report-submit="true" @submit="getVcode" class="getVcode">
		      <button formType="submit" style="color:#0084F9">{{yzm}}</button>
		    </form>
			</view>
		</view>
	</view>
</template>

<script>
export { default } from './myOther.js';
</script>

<style lang="less" scoped>
@import url('myOther.less');
@import url('../orderCard.less');
</style>
