<template>
	<view class="container" ref="containerRef">
		<!-- ========================= uniapp-导航栏 START ========================= -->
		<uni-nav-bar
			left-icon="back"
			@clickLeft="tapLeftFromNav"
			title="宴会详情"
			color="#FFFFFF"
			background-color="#0084F9"
			:fixed="true"
			:status-bar="true"
			ref="navbarRef"
		></uni-nav-bar>
		<!-- ========================= uniapp-导航栏 END ========================= -->
		<block v-if="!isCanSee">
			<view class="sorry">
				<view class="img-wrapper">
					<image
						class="img"
						src="https://pic.cwyyt.cn/upload/img/20200214/1710201020_key-tips.png"
						mode=""
					></image>
					<view class="tip">抱歉，您没有权限查看</view>
				</view>
				<view class="recommended-wrapper">
					<view class="title">推荐您</view>
					<button class="btn" type="default" @tap="gotoStore">查看门店</button>
					<navigator url="/pages/index/index" hover-class="none" open-type="switchTab">
						<button class="btn" type="default" @tap="backToHome">去首页</button>
					</navigator>
				</view>
			</view>
		</block>
		<block v-if="isCanSee">
			<!-- ========================= 客户基本信息 START ========================= -->
			<view class="customer-basic-info uni-flex uni-row" ref="customerBasicInfoRef">
				<view class="avatar-wrapper-left uni-flex uni-row yyt-flex-center">
					<view
						class="cu-avatar xl round margin-right"
						:style="{ backgroundImage: getImgUrl(banquetDetailData.headImg) }"
					></view>
				</view>
				<view class="other-info-wrapper-right uni-flex uni-row">
					<view class="uni-flex first uni-column">
						<view class="top uni-flex uni-row">
							<view class="banquet-title">
								{{ banquetDetailData.banquetOrderName }}
							</view>
							<view class="banquet-date-wrapper uni-flex yyt-flex-center yyt-margin-left-small">
								<image class="img" src="https://pic.cwyyt.cn/upload/yyticons/1651175117_宴会时间@2x.png"></image>
								<text class="date yyt-error">
									{{ banquetDetailData.banquetDate | parseShortDate }}
								</text>
							</view>
						</view>
						<view class="bottom uni-flex uni-row">
							<view class="banquet-type">
								<image
									style="top: 2rpx;"
									class="yyt-small-img yyt-margin-right-small"
									src="https://pic.cwyyt.cn/upload/yyticons/1112451245_切换到区域预览@2x.png"
									mode=""
								></image>
								{{ banquetTypeAndThemeType }}
								<text
									class="banquet-detail"
									v-if="banquetDetailData.themeMarketSeID"
									@tap="gotoMarketingPage('theme')"
								>
									详情 >>
								</text>
							</view>
							<navigator
								hover-class="none"
								style="margin-left: auto;"
								:url="
									`/pages/myOrderSub/Invite/Invite?id=${
										banquetDetailData.bookOrderBookOrderID
									}`
								"
							>
								<button
									v-if="banquetDetailData.bookOrderBookOrderID"
									class="cu-btn round line-grey text-blue"
								>
									去分享
								</button>
							</navigator>
						</view>
					</view>
					<!-- <view class="uni-flex second yyt-flex-center"
					v-if="banquetDetailData.bookOrderBookOrderID">
					<button class="cu-btn round line-grey text-blue"
						@tap="gotoShareMarketingPage">去分享</button>
				</view> -->
					<!-- 先注掉，说不定以后用得上 -->
					<!-- <view class="uni-flex right yyt-flex-center"
					v-if="!banquetDetailData.bookOrderBookOrderID">
					<button class="cu-btn round line-grey text-blue"
						@tap="nowBook">去预定</button>
				</view> -->
				</view>
			</view>

			<!-- ========================= 宴会服务成员 START ========================= -->
			<view class="members-of-the-service yyt-list-item yyt-list-item-column">
				<view class="title-wrapper yyt-margin-bottom-bg">
					<view class="title">宴会服务成员</view>
					<view class="content">{{ banquetDetailData.bOrderOfExecutorViewDtos.length }}人</view>
				</view>
				<scroll-view scroll-x="true" class="scroll-view_H member-avatar-content">
					<navigator
						class="member-avatar-item"
						hover-class="none"
						v-for="waiter in banquetDetailData.bOrderOfExecutorViewDtos"
						:key="waiter.executorUserID"
						:url="
							`/pages/common/salesManagerInfo/salesManagerInfo?salesID=${
								waiter.executorUserID
							}&shopID=${banquetDetailData.buUnitGUID}`
						"
					>
						<view
							class="cu-avatar lg round"
							:style="{ backgroundImage: getImgUrl(waiter.executorImgUrl_Server) }"
						></view>
						<view class="avatar-name-wrapper">
							<image
								v-if="waiter.isCoordinator == 1"
								class="img"
								src="https://pic.cwyyt.cn/upload/yyticons/160134134_tongchou.png"
								mode=""
							></image>
							<image
								v-if="waiter.isMarketer == 1"
								class="img"
								src="https://pic.cwyyt.cn/upload/yyticons/1555415541_kefujingli.png"
								mode=""
							></image>
							<text class="name">{{ waiter.executorName || '未知' }}</text>
						</view>
					</navigator>
				</scroll-view>
			</view>
			<!-- ========================= 宴会服务成员 END ========================= -->

			<!-- ========================= 宴会详情主体 START ========================= -->
			<view class="banquet-main-wrapper" :style="{ paddingTop: actionWrapperHeight + 'px' }">
				<!-- 宴会信息 / 宴会执行(小程序没有) 切换按钮 -->
				<view class="action-wrapper" ref="actionWrapperRef">
					<!-- [宴会信息]顶部tab切换 -->
					<scroll-view
						scroll-x
						class="banquet-info-tab bg-white nav"
						scroll-with-animation
						:scroll-left="banquetInfoScrollLeft"
					>
						<view
							class="cu-item zzy"
							:class="index == banquetInfoSelected ? 'zzy-blue cur short yyt-font-weight' : ''"
							v-for="(item, index) in banquetInfoArr"
							:key="index"
							@tap="banquetInfoTabSelect"
							:data-id="index"
						>
							{{ item.name }}
						</view>
					</scroll-view>
				</view>
				<!-- 宴会信息板块 -->
				<view class="banquet-info-wrapper">
					<!-- :style="{height: actionWrapperBottom + 'px'}"> -->
					<swiper
						class="swiper"
						style="height:100%;"
						:current="banquetInfoSelected"
						@change="changeBanquetInfoSelected"
						:indicator-dots="false"
						:autoplay="false"
						:interval="500"
						:duration="300"
					>
						<swiper-item>
							<scroll-view scroll-y="true" class="scroll-view-wrapper">
								<!-- 宴会相关 -->
								<view class="banquet-relevant">
									<!-- 预订单信息 -->
									<view
										class="booking-info"
										v-show="banquetDetailData.bookOrderBookOrderID"
									>
										<view class="overview-title">
											<view class="overview-subTitle">
												<!-- <view class="overview-stripe"></view> -->
												<view>预订单信息</view>
											</view>
										</view>
										<view v-show="banquetDetailData.bookOrderBookOrderID">
											<view class="yyt-list-item">
												<view class="title">姓名</view>
												<view class="content">
													{{ banquetDetailData.bookerName }}
												</view>
											</view>
											<view class="yyt-list-item">
												<view class="title">预定电话</view>
												<view class="content">
													{{ banquetDetailData.bookerPhone }}
												</view>
											</view>
											<view class="yyt-list-item">
												<view class="title">预定日期</view>
												<view class="content">
													{{ banquetDetailData.bookOn | parseShortDate }}
												</view>
											</view>
											<view class="yyt-list-item">
												<view class="title">宴会类型</view>
												<view class="content">
													{{ banquetDetailData.bookOrderTypeName }}
												</view>
											</view>
											<view class="yyt-list-item">
												<view class="title">餐别</view>
												<view class="content">
													{{ banquetDetailData.diningTypeName }}
												</view>
											</view>
											<view class="yyt-list-item">
												<view class="title">已预订桌数</view>
												<view class="content">
													{{ banquetDetailData.bookTableNum || 0 }}桌
												</view>
											</view>
											<view class="yyt-list-item" v-if="banquetDetailData.frontMoney">
												<view class="title">已付订金</view>
												<view class="content">
													<text style="color: #999999;">(¥)</text>
													{{ banquetDetailData.frontMoney | formatMoney }}
												</view>
											</view>
											<view class="yyt-list-item">
												<view class="title">区域</view>
												<view class="content">{{ banquetDetailData.areaName }}</view>
											</view>
										</view>
									</view>
									<!-- 套餐信息 -->
									<view class="combo-info">
										<view class="overview-title">
											<view class="overview-subTitle">
												<!-- <view class="overview-stripe"></view> -->
												<view>套餐信息</view>
											</view>
										</view>
										<view>
											<view class="yyt-list-item">
												<view class="title">套餐</view>
												<view class="content">
													{{ banquetDetailData.banquetPackageName || '' }}
												</view>
												<view
													v-if="banquetDetailData.marketSeID"
													@tap="gotoMarketingPage('combo')"
													class="link yyt-margin-left-small"
													style="color: #4CADFE; font-size: 24rpx;"
												>
													详情>>
												</view>
											</view>
											<view class="yyt-list-item">
												<view class="title">套餐价格</view>
												<view class="content">
													<text style="color: #999999;">(¥)</text>
													{{ banquetDetailData.packagePrice | formatMoney }}
												</view>
											</view>
											<view class="yyt-list-item yyt-list-item-column">
												<view class="title-wrapper">
													<view class="title">备注</view>
												</view>
												<view
													class="tip"
													v-if="banquetDetailData.packageRemark.length <= 0"
												>
													无
												</view>
												<view else>{{ banquetDetailData.packageRemark }}</view>
											</view>
										</view>
									</view>
								</view>
							</scroll-view>
						</swiper-item>
						<swiper-item>
							<scroll-view scroll-y="true" class="scroll-view-wrapper">
								<!-- 客户档案 -->
								<view class="account-profile">
									<!-- <view class="account-profile" v-show="banquetInfoSelected == 1"> -->
									<!-- 档案为空 -->
									<view
										class="empty uni-flex uni-column"
										v-if="banquetDetailData.bOrderOfRecordViewDtos.length <= 0"
									>
										<view class="tip-wrapper uni-flex uni-row">
											<image class="img" src="https://pic.cwyyt.cn/upload/yyticons/1553265326_info.png" mode=""></image>
											<text class="tip">
												客户档案空空如也，请耐心等待宴会服务成员为您创建客户档案。
											</text>
										</view>
										<!-- bg-blue实心按钮 line-blue 镂空按钮 -->
									</view>
									<!-- 至少有一个档案 -->
									<view else class="profile-list">
										<navigator
											class="card"
											hover-class="none"
											v-for="customer in banquetDetailData.bOrderOfRecordViewDtos"
											:key="customer.id"
											:url="
												`/pages/myOrderSub/writeFile/writeFile?id=${
													customer.id
												}&banquetInfoSelected=${banquetInfoSelected}`
											"
										>
											<view class="yyt-list-item yyt-list-item-column">
												<view class="title-wrapper">
													<view class="title text-bold">
														{{ customer.cstRecordConfName }}
													</view>
													<view class="arrow-wrapper">
														<uni-icons
															:size="18"
															class="uni-icon-wrapper"
															color="#bbb"
															type="arrowright"
														></uni-icons>
													</view>
												</view>
												<view style="width: 100%;">
													<view class="yyt-list-item">
														<view class="title">姓名</view>
														<!-- <input class="sw-input" type="text" focus placeholder="请输入邮箱信息" /> -->
														<view class="content">
															{{ customer.cstName }}
														</view>
													</view>
													<view class="yyt-list-item">
														<view class="title">电话</view>
														<input
															class="sw-input"
															type="text"
															disabled
															placeholder="暂无"
															:value="customer.cstPhone"
														/>
													</view>
													<view class="yyt-list-item">
														<view class="title">生日</view>
														<view class="content">
															{{ customer.cstBirthday | parseShortDate }}
														</view>
													</view>
												</view>
											</view>
										</navigator>
									</view>
								</view>
							</scroll-view>
						</swiper-item>
						<swiper-item>
							<scroll-view scroll-y="true" class="scroll-view-wrapper">
								<!-- 服务项目 -->
								<view
									class="service-project"
									v-if="
										banquetDetailData.bOrderOfProjectCommentViewDtos &&
											banquetDetailData.bOrderOfProjectCommentViewDtos.length > 0
									"
								>
									<!-- <view class="service-project" v-show="banquetInfoSelected == 3"> -->
									<!-- 项目卡片 -->
									<view
										class="card-proj"
										v-for="(rate,
										index) in banquetDetailData.bOrderOfProjectCommentViewDtos"
										:key="index"
									>
										<view class="title-wrapper">
											<view class="title">{{ rate.projectConfName }}</view>
											<!-- 不允许评价就不显示 -->
											<view class="btn wait" v-if="!rate.isCanMemberComment"></view>
											<view class="btn wait" v-else-if="!rate.isTaskCompleted">
												等待评价
											</view>
											<view
												class="btn"
												@tap="gotoEvaluation(rate)"
												v-else-if="rate.cstScore == 0 && rate.isTaskCompleted"
											>
												立即评价
											</view>
										</view>
										<!-- 评分 -->

										<!-- 根据评分是否大于0来判定用户是否评论过，只要评论过，分数一定大于0，不评则为0 -->
										<view class="rate-wrapper" v-if="rate.isCanMemberComment">
											<view class="score-wrapper">
												<text class="title">评分：</text>
												<text class="tip" v-if="!rate.isTaskCompleted">
													项目还未结束，暂未开启评分
												</text>
												<sx-rate
													v-if="rate.cstScore > 0"
													disabled=""
													class="rate-control"
													:value="rate.cstScore"
													:default-color="'#e1e1e1'"
													:active-color="'#FC4732'"
												></sx-rate>
											</view>
											<view class="evaluate-wrapper">
												<text class="title">评价：</text>
												<text class="tip" v-if="!rate.isTaskCompleted">
													项目还未结束，暂未开启评价
												</text>
												<view
													v-else
													class="content"
													:class="rate.cstScore == 0 ? 'yyt-dark-grey' : ''"
												>
													{{
														rate.cstScore == 0
															? '留言墙正等着您的光临噢！'
															: rate.cstComment
													}}
												</view>
											</view>
										</view>
										<!-- 回复 -->
										<view
											class="reply-wrapper"
											v-if="rate.isCanMemberComment && rate.cstScore > 0"
										>
											<view class="title-wrapper">
												<view class="title">回复：</view>
												<!-- 											<view
												class="btn"
												v-if="rate.cstComment != null && rate.commentReplyContent == null"
												@tap="gotoReply(rate)"
											>
												立即回复
											</view> -->
											</view>
											<view class="content">
												<view v-if="rate.commentReplyContent">
													{{ rate.commentReplyContent }}
												</view>
											</view>
										</view>
									</view>
								</view>
								<!-- 宴会执行为空 -->
								<view v-else class="empty uni-flex uni-column">
									<view class="tip-wrapper uni-flex uni-row">
										<image class="img" src="https://pic.cwyyt.cn/upload/yyticons/1553265326_info.png" mode=""></image>
										<text class="tip">服务项目空空如也</text>
									</view>
									<!-- <button class="cu-btn round lg bg-blue btn">立即选择主题</button> -->
									<!-- bg-blue实心按钮 line-blue 镂空按钮 -->
								</view>
							</scroll-view>
						</swiper-item>
						<swiper-item class="banquet-exec-wrapper">
							<scroll-view scroll-y="true" class="scroll-view-wrapper">
								<!-- 任务列表（时间划分） -->
								<view class="date-list" v-if="timeArr.length > 0">
									<view
										class="item-wrapper"
										v-for="(time, index) in timeArr"
										:key="time.taskExecuteDate"
									>
										<view class="date-wrapper uni-flex uni-row">
											<view class="date yyt-margin-left-bg">
												{{ time.taskExecuteDate | parseShortDate }}
											</view>
											<!-- <view class="desc">
											宴会执行前
											<text>{{ Math.abs(time.executedDiffDay) }}</text>
											天
										</view> -->
										</view>

										<navigator
											v-if="time.bOrderOfTaskViewDtos.length > 0"
											class="item"
											v-for="taskItem in time.bOrderOfTaskViewDtos"
											:key="taskItem.id"
											:url="
												`/pages/myOrderSub/taskDetail/taskDetail?id=${
													taskItem.id
												}&orderCstName=${banquetDetailData.orderCstName}`
											"
										>
											<view class="task-title-wrapper uni-flex uni-row">
												<view
													class="title"
													:style="{
														textDecoration:
															taskItem.isExecuted == '1'
																? 'line-through'
																: 'none'
													}"
												>
													{{ taskItem.taskConfName }}
												</view>
												<!-- 执行人 -->
												<view class="name">
													{{ taskItem.banquetTaskExecutorNames || '' }}
												</view>
											</view>
											<view class="other-info-wrapper uni-flex uni-row">
												<view class="project-name">
													{{ taskItem.projectConfName }}
												</view>
												<block v-if="taskItem.isExecuted == '0'">
													<image
														v-if="taskItem.fileCount > 0"
														class="img margin-left"
														src="https://pic.cwyyt.cn/upload/yyticons/1552185218_files.png"
													></image>
													<image
														v-if="taskItem.imgCount > 0"
														class="img margin-left"
														src="https://pic.cwyyt.cn/upload/yyticons/1557505750_picture.png"
													></image>
													<view
														class="signature-wrapper margin-left"
														v-if="taskItem.cstSignImgUrl"
													>
														<image
															class="img"
															src="https://pic.cwyyt.cn/upload/yyticons/1559355935_sign.png"
														></image>
														<image
															class="signature"
															:src="taskItem.cstSignImgUrl"
														></image>
													</view>
												</block>
											</view>
											<view
												class="notes-wrapper uni-flex uni-row"
												v-if="
													taskItem.banquetTaskRemark &&
														taskItem.banquetTaskRemark.length > 0 &&
														taskItem.isExecuted == '0'
												"
											>
												<image class="img" src="https://pic.cwyyt.cn/upload/yyticons/1559295929_remark.png"></image>
												<view class="notes">
													{{ taskItem.banquetTaskRemark }}
												</view>
											</view>
											<view
												class="done-wrapper uni-flex uni-row"
												v-if="taskItem.isExecuted == '1'"
											>
												<view class="dot bg-blue"></view>
												<view class="date">
													{{ taskItem.factExecuteDate | parseDatetime }}
												</view>
												<view class="name">{{ taskItem.factExecutorName }}</view>
												<view class="desc">已经完成了任务</view>
											</view>
										</navigator>
									</view>
								</view>
								<!-- 宴会执行为空 -->
								<view v-else class="empty uni-flex uni-column">
									<view class="tip-wrapper uni-flex uni-row">
										<image class="img" src="https://pic.cwyyt.cn/upload/yyticons/1553265326_info.png" mode=""></image>
										<text class="tip">宴会执行空空如也</text>
									</view>
									<!-- <button class="cu-btn round lg bg-blue btn">立即选择主题</button> -->
									<!-- bg-blue实心按钮 line-blue 镂空按钮 -->
								</view>
							</scroll-view>
						</swiper-item>
					</swiper>
				</view>
			</view>
			<!-- ========================= 客户详情主题 END ========================= -->
		</block>

		<!-- ========================= 其他 START ========================= -->
		<!-- 弹出取消订单提示框 -->
		<uni-popup ref="cancelPopup" type="center" class="tip-popup" :custom="true">
			<view class="wrapper">
				<view class="popup-top">
					<text>提示</text>
					<image
						class="popup-top-img"
						src="https://pic.cwyyt.cn/upload/yyticons/161400140_关闭.png"
						mode=""
						@tap="cancelOrder()"
					></image>
				</view>
				<!-- popup中部 -->
				<view class="popup-mid">
					<image class="popup-mid-img" src="https://pic.cwyyt.cn/upload/yyticons/1551305130_error.png" mode=""></image>
					<text>您确定要删除该订单？</text>
				</view>
				<view class="popup-bot">
					<view class="cancel" @tap="cancelOrder()">取消</view>
					<view class="confirm" @tap="confirmCancel()">确定</view>
				</view>
			</view>
		</uni-popup>
		<!-- ========================= 其他 END ========================= -->
	</view>
</template>

<script src="./banquetDetail.js"></script>

<style lang="less" scoped>
@import '../../../lib/colorui/main.css';
@import '../../../lib/colorui/icon.css';
/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
@import '../../../common/uni.css';
/* iconfont.css  */
/* 自定义 checkbox 样式 */
@import '../../../common/checkbox-style.css';
@import '../../../common/iconfont.css';
@import '../../../common/yyt-common.less';

@import url('banquetDetail.less');
</style>
