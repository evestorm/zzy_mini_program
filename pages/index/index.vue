<template>
	<view>
		<view class="container" v-if="isShow">
			<!-- 搜索框 -->
			<view class="search-wrapper" @tap="inputTyping">
				<view class="input-wrapper" :v-show="inputShowed" @tap="showInput">
					<image class="icon" src="https://pic.cwyyt.cn/upload/yyticons/160532532_search.png" mode=""></image>
					<view class="input">请输入店铺名称/店名</view>
				</view>
			</view>
			<view class="page__bd">
				<!-- banner图 -->
				<view class="page__desc">
					<swiper
						class="swiper"
						:indicator-dots="false"
						autoplay="true"
						interval="3000"
						duration="1000"
						:current="swiperCurrent"
					>
						<block v-for="(item, index) in shopImg" :key="index">
							<swiper-item>
								<image :src="item.src" class="slide-image" mode="aspectFill"></image>
							</swiper-item>
						</block>
					</swiper>
					<!-- 轮播指示点样式修改 -->
					<view class="dots">
						<block v-for="(item, index) in shopImg.length" :key="item">
							<view
								class="dot"
								:class="index == swiperCurrent ? ' active' : ''"
								@tap="swiperCurrent = index"
							></view>
						</block>
					</view>
				</view>
			</view>
			<view class="yyt_content">
				<!-- 热门推荐 -->
				<view class="yyt_shopInfo">
					<view class="yyt_shopInfo_title">
						<view class="title" data-current="0" @tap="clickTab">我的商家</view>
						<view class="city-wrapper" @tap="refreshPosition">
							<image class="position" src="https://pic.cwyyt.cn/upload/yyticons/1132173217_收货地址@2x.png" mode=""></image>
							<text class="cityPosition_cityName">{{ currentCity }}</text>
							<image class="arrow" src="https://pic.cwyyt.cn/upload/yyticons/160321321_arrow-down.png" mode=""></image>
						</view>
					</view>
					<view class="yyt_shopInfo_content_content">
						<view
							:class="
								'yyt_shopInfo_content yyt_shopInfo_content_Item ' +
									(tabArr.currentContent == 0 ? 'isShow' : '')
							"
						>
							<navigator
								:url="`/pages/indexSub/shopIntroduce/shopIntroduce?id=${item.storeID}`"
								hover-class="none"
								v-for="(item, index) in shopInfo"
								:key="index"
								class="navigator"
							>
								<view class="shopInfo_list">
									<view class="shopInfo_list_image">
										<image
											:src="item.storeLogo"
											class="shopPic"
											mode="aspectFill"
										></image>
									</view>
									<view class="shopInfo_list_content">
										<view class="shopInfo_list_content_name">
											<view class="">{{ item.storeName }}</view>
											<view class="shopInfo_list_content-point">{{ item.point }}</view>
										</view>
										<view class="shopInfo_list_content_rating">
											<view class="shopInfo_list_content_rating_stars">
												<text
													class="icon iconfont icon-shoucang1"
													:style="
														item.score >= 1 ? 'color:#e95927' : 'color:#e8e8e8'
													"
												></text>
												<text
													class="icon iconfont icon-shoucang1"
													:style="
														item.score >= 2 ? 'color:#e95927' : 'color:#e8e8e8'
													"
												></text>
												<text
													class="icon iconfont icon-shoucang1"
													:style="
														item.score >= 3 ? 'color:#e95927' : 'color:#e8e8e8'
													"
												></text>
												<text
													class="icon iconfont icon-shoucang1"
													:style="
														item.score >= 4 ? 'color:#e95927' : 'color:#e8e8e8'
													"
												></text>
												<text
													class="icon iconfont icon-shoucang1"
													:style="
														item.score >= 5 ? 'color:#e95927' : 'color:#e8e8e8'
													"
												></text>
											</view>
											<view class="shopInfo_list_content-rating_salePrice">
												{{ item.avgPrice }}
											</view>
										</view>
										<view class="shopInfo_list_content_foodStyle">
											<view
												class="shopInfo_list_content_foodStyle_name"
												v-if="item.category"
											>
												{{ item.category }}
											</view>
											<view class="shopInfo_list_content_foodStyle_distance">
												<image
													src="https://pic.cwyyt.cn/upload/yyticons/1132173217_收货地址@2x.png"
													mode=""
													class="img"
												></image>
												{{ item.address }}
											</view>
										</view>
									</view>
								</view>
							</navigator>
							<view class="page__bd1" v-if="!hasMore">
								<view class="weui-loadmore weui-loadmore_line">
									<view class="weui-loadmore__tips weui-loadmore__tips_in-line">
										我也是有底线的
									</view>
								</view>
							</view>

							<view class="page__bd1" v-if="shopInfo.length == 0">
								<view class="weui-loadmore">
									<view class="weui-loadmore__tips weui-loadmore__tips_in-line">
										您还没有加入任何商家
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 搜索页面 -->
		<view class="container1" v-else>
			<view class="weui-search-bar1">
				<view class="weui-search-bar__form">
					<view class="weui-search-bar__box">
						<image
							class="icon iconfont icon-chaxun"
							type="search"
							size="14"
							@tap="searchStore"
						></image>
						<input
							type="text"
							class="weui-search-bar__input"
							:placeholder="record[0]"
							:value="inputVal"
							:focus="inputShowed"
							@input="inputSearch"
							@confirm="searchStore"
						/>
						<view class="weui-icon-clear" v-if="inputVal.length > 0" @tap="clearInput">
							<icon type="clear" size="14"></icon>
						</view>
					</view>
					<label class="weui-search-bar__label" :hidden="inputShowed" @tap="showInput">
						<image class="icon iconfont icon-chaxun" type="search" size="14"></image>
						<view class="weui-search-bar__text">请输入店铺名称/店名</view>
					</label>
				</view>
				<view class="weui-search-bar__cancel-btn" :hidden="!inputShowed" @tap="hideInput">取消</view>
			</view>
			<view class="clearfix" v-if="isSearch"></view>
			<view class="historySearch" v-if="isSearch">
				<view class="historySearch_title">
					<image class="icon iconfont icon--"></image>
					<text v-if="record.length != 0">历史搜索</text>
					<text v-else>暂无历史搜索</text>
				</view>
				<view class="historySearch_content">
					<view class="historySearch_content_Info">
						<text
							v-for="(item, index) in record"
							:key="index"
							@tap="recordSearch"
							:data-txt="item"
						>
							{{ item }}
						</text>
					</view>
					<view class="clearfix"></view>
					<view class="delHistory">
						<view class="icon iconfont icon-lajitong "></view>
						<text @tap="clearRecord">清除历史记录</text>
					</view>
				</view>
			</view>
			<view class="clearfix" v-if="isSearch"></view>
			<view class="yyt_shopInfo_content" v-if="!isSearch">
				<navigator
					:url="`/pages/indexSub/shopIntroduce/shopIntroduce?id=${item.storeID}`"
					hover-class="none"
					v-for="(item, index) in searcgStoreList"
					:key="index"
				>
					<view class="shopInfo_list">
						<view class="shopInfo_list_image">
							<image :src="item.storeLogo" class="shopPic" mode="aspectFill"></image>
						</view>
						<view class="shopInfo_list_content">
							<view class="shopInfo_list_content_name">
								<view class="">{{ item.storeName }}</view>
								<view class="shopInfo_list_content-point">{{ item.point }}</view>
							</view>
							<view class="shopInfo_list_content_rating">
								<view class="shopInfo_list_content_rating_stars">
									<text
										class="icon iconfont icon-shoucang1"
										:style="item.score >= 1 ? 'color:#e95927' : 'color:#e8e8e8'"
									></text>
									<text
										class="icon iconfont icon-shoucang1"
										:style="item.score >= 2 ? 'color:#e95927' : 'color:#e8e8e8'"
									></text>
									<text
										class="icon iconfont icon-shoucang1"
										:style="item.score >= 3 ? 'color:#e95927' : 'color:#e8e8e8'"
									></text>
									<text
										class="icon iconfont icon-shoucang1"
										:style="item.score >= 4 ? 'color:#e95927' : 'color:#e8e8e8'"
									></text>
									<text
										class="icon iconfont icon-shoucang1"
										:style="item.score >= 5 ? 'color:#e95927' : 'color:#e8e8e8'"
									></text>
								</view>
								<view class="shopInfo_list_content-rating_salePrice">
									{{ item.avgPrice }}
								</view>
							</view>
							<view class="shopInfo_list_content_foodStyle">
								<view class="shopInfo_list_content_foodStyle_name" v-if="item.category">
									{{ item.category }}
								</view>
								<view class="shopInfo_list_content_foodStyle_distance">
									<image src="https://pic.cwyyt.cn/upload/yyticons/1132173217_收货地址@2x.png" mode="" class="img"></image>
									{{ item.address }}
								</view>
							</view>
						</view>
					</view>
				</navigator>
			</view>
		</view>
	</view>
</template>

<script>
export { default } from './index.js';
</script>
<style lang="less" scoped>
@import './index.less';
</style>
