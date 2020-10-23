<template>
	<view class="go-booking">
	<!-- 立即预定 -->
		<view class="container">
		  <!-- <view class='bookingContent_PersonalInfo' wx:if="{{marketer.hasSaler}}"> -->
		  <!-- <view class="bookingTop">
			<view class="booingTop_shopInfo" @tap="goShop">
			 <view class="booingTop_shopInfo_l">
				 <image :src="currentShopInfo.storeLogo"></image>
				 <span>{{currentShopInfo.storeName}}</span>
			 </view>
			 <view class="booingTop_shopInfo_r">
			   <text class="iconfont icon iconfont icon-left-arrow"></text>
			 </view>
			</view>
			<view class="bookingContent_PersonalInfo" v-if="marketer.hasSaler">
			  <view class="bookingContent_customerlInfo">
				<image :src="userInfo.headImg" mode="aspectFill"></image>
				<view class="customerlInfo_content">
				  <view class="customerlInfo_userName">{{userInfo.fullName?userInfo.fullName:userInfo.nickName}}</view>
				  <view class="customerlInfo_userRole">客户</view>
				</view>
			  </view>
			  <view class="bookingContent_links">
				<text class="icon iconfont icon-lianjie"></text>
			  </view>
			  <view class="bookingContent_saleslInfo">
				<image :src="marketer.imgUrl" mode="aspectFill" @tap="goSalesManagerInfo"></image>
				<view class="customerlInfo_content">
				  <view class="customerlInfo_userName" @tap="goSalesManagerInfo">{{marketer.name}}
					<text class="customerlInfo_userName_title">(客服经理)</text>
				  </view>
				  <view class="customerlInfo_usertel" @tap="callPhone">{{marketer.phone}}</view>
				</view>
			  </view>
			</view>
		  </view> -->
			<view class="bookingContent_msg">
				<view class="yyt_booking_title  ">
					<view :class="'swiper-tab-item ' + (tabArr.currentTab == 0 ? 'active' : '')" data-current="0" @tap="clickTab">
						订包房
					</view>
					<view :class="'swiper-tab-item ' + (tabArr.currentTab == 1 ? 'active' : '')" data-current="1" @tap="clickTab">
						订宴会
					</view>
				</view>
				<view class="bookingInfo_content">
					<!-- =====================定包房============================ -->
					<view :class="'bookingRoom bookingInfo_content_Item ' + (tabArr.currentContent == 0 ? 'isShow' : '')">
						<view :class="'yyt_booking_tab_top ' + (tabArr.currentTab == 0 ? 'active' : '')">
							<view class="list-title">包房类型</view>
							<scroll-view scroll-x class="scroll-x" scroll-with-animation="true" :scroll-into-view="toView">
								<view v-for="(item, index) in list" :key="index" class="view-parent">
									<view :class="'view-item  ' + (currentView == index ? 'active1' : '')" :id="'room' + index" :data-txt="item.text" :data-index="item.id" @tap="clickView">{{item.text}}</view>
								</view>
							</scroll-view>
							<view class="list-title">订餐类型</view>
							<scroll-view scroll-x class="scroll-x" scroll-with-animation="true" :scroll-into-view="toView">
								<view v-for="(item, index) in list1" :key="index" class="view-parent">
									<view :class="'view-item  ' + (currentView1 == index ? 'active1' : '')" :id="'move' + index" :data-txt="item.text" :data-index="item.id" @tap="clickView1">{{item.text}}</view>
								</view>
							</scroll-view>
							<view class="list-title">就餐人数<text>(人)</text></view>
							<scroll-view scroll-x class="scroll-x" scroll-with-animation="true" :scroll-into-view="toView">
								<view v-for="(item, index) in list2" :key="index" class="view-parent">
									<view :class="'view-item-num  ' + (currentView2 == index ? 'activeNum' : '')" :id="'peoperNum' + index" :data-txt="item.text" :data-index="item.id" @tap="clickView2">{{item.text}}</view>
								</view>
							</scroll-view>
							<view class="list-title">时间</view>
							<scroll-view scroll-x class="scroll-x" scroll-with-animation="true" :scroll-into-view="toView" v-if="list3">
								<view v-for="(item, index) in list3" :key="index" class="view-parent">
									<view :class="'view-item-time ' + (item.selected ? 'activeTime' : '')" :id="'date' + index" :data-selected="item.selected" :data-txt="item.text" :data-index="item.id" @tap="clickView3">{{item.text}}</view>
								</view>
							  <picker mode="date" :value="date" @change="getBir" style="display:inline-block">
								  <view class="picker">
									<text style="font-size:32rpx;color:#323232">更多</text>
								  </view>
							  </picker>
							</scroll-view>

							<scroll-view scroll-x class="scroll-x" scroll-with-animation="true" :scroll-into-view="toView" v-if="curSelect === 0 || curSelect">
								<block  v-if="list3.length!=0">
									<view v-for="(item, index) in list3[curSelect].diningType" :key="index" class="view-parent">
										<view :class="'view-item ' + (item.selected ? 'activeType' : '')" :data-selected="item.selected" :id="'food' + index" :data-txt="item.text" :data-index="item.id" @tap="clickView4">{{item.text}}</view>
									</view>
								</block>
							</scroll-view>

							<scroll-view scroll-x class="scroll-x" scroll-with-animation="true" :scroll-into-view="toView" v-if="(curSelect === 0 || curSelect) && (curSelOne === 0 || curSelOne)">
								<view class="view-parent">
									<view class="view-item activeType" v-if="list3.length!=0">{{list3[curSelect].diningType[curSelOne].time[0]}}</view>
								</view>
							</scroll-view>
						</view>
						<view :class="'yyt_booking_tab_bottom ' + (tabArr.currentTab == 0 ? 'active' : '')">
							<view class="list-title">预定信息</view>
							<view class="yyt_booking_tab_bottom-info">
								<view v-for="(item, index) in selView" :key="index" class="view-parent">
									<text v-if="index != 3 && index != 4 && index != 5">{{item.text}}</text>
								</view>
							</view>
							<view class="yyt_booking_tab_bottom-info" v-if="list3.length!=0">
								<view v-for="(item, index) in list3" :key="index" v-if="item.selected">
									<view class="view-parent">
										<text>{{item.text}}</text>
										<text v-for="(dinItem, index) in item.diningType" :key="index" v-if="dinItem.selected">{{dinItem.text}} {{dinItem.time[0]}}</text>
									</view>
								</view>
							</view>
							 <button class="weui-btn" @tap="nowBook" formType="submit" :disabled="!isLoadEnd">预定</button>
						</view>
					</view>
					<!-- ===============================定宴会================================ -->
					<view :class="'bookingDishes  bookingInfo_content_Item ' + (tabArr.currentContent == 1 ? 'isShow' : '')">
						<view :class="'yyt_booking_tab_top ' + (tabArr.currentTab == 1 ? 'active' : '')">
							<view class="list-title">宴会类型</view>
							<view class="yyt_booking_tab_top_first">
								<view class="yyt_booking_tab_top_first_top">
								  <view v-for="(item, index) in bookTypeList1" :key="index" class="view-parent">
								    <view :class="'view-item  ' + (currentView11 == index ? 'active1' : '')" :data-index="item.id" @tap="clickView11">{{item.text}}</view>
								  </view>
								</view>
								<scroll-view scroll-x class="scroll-x" v-if="isShow">
									<view v-for="(item, index) in bookTypeList2" :key="index" class="view-parent">
										<view :class="'view-item  ' + (currentView112 == index ? 'active1' : '')" :data-index="item.id" @tap="clickView112">{{item.text}}</view>
									</view>
								</scroll-view>
							</view>
							<view class="selectTableNumber">
								<text class="selectTableNumber_l list-title-yh">桌数</text>
								<text class="selectTableNumber_r" @tap="selectTableNumber">选择桌数</text>
							</view>
							<view class="selectTableNumber">
								<text class="table-num">{{tableNumDesc}}</text>
							</view>
							<view class="selectDate">
								<text class="selectDate_l list-title-yh">日期</text>
								<picker mode="date" :value="date1" @change="bindDateChange1">
									<text class="selectDate_r">选择日期</text>
								</picker>
							</view>
							<view class="selectDate">
								<text class="table-num">{{date1}}</text>
							</view>
							<view class="list-title">时间</view>
							<scroll-view scroll-x class="scroll-x" v-if="list14">
								<view v-for="(item, index) in list14" :key="index" class="view-parent">
									<view :class="'view-item-yhtime  ' + (currentView14 == index ? 'activeYhTime' : '')" :data-index="item.id" @tap="clickView14">{{item.text}}</view>
								</view>
							</scroll-view>
							<scroll-view scroll-x class="scroll-x" v-if="list15">
								<view v-for="(item, index) in list15" :key="index" class="view-parent">
									<view :class="'view-item-yhtime  ' + (currentView15 == index ? 'activeYhTime' : '')" :data-index="item.id" @tap="clickView15">{{item.text}}</view>
								</view>
							</scroll-view>
						</view>
						<view :class="'yyt_booking_tab_bottom1 ' + (tabArr.currentTab == 1 ? 'active' : '')" v-if="selView1.length!=0">
							<view class="list-title">预定信息</view>
							<view class="yyt_booking_tab_bottom-info" >
								<view class="">
									<text class="view-parent">{{selView1[0].text?selView1[0].text:''}}</text>
									<text class="view-parent" :class="{'red':selView1[1].data==''}">{{selView1[1].text}}</text>
								</view>
								<view class="">
									<text class="view-parent">{{selView1[2].text}}</text>
									<text class="view-parent">{{selView1[3].text}}</text>
									<text class="view-parent">{{selView1[4].text}}</text>
								</view>
							</view>
							<button class="weui-btn" @tap="nowBook1" formType="submit" :disabled="selView1[1].data==''">预定</button>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- ================================弹出桌数选择组件============================================== -->
	<view class="mask" catchtouchmove="preventTouchMove" v-if="showModal"></view>
	<view class="modalDlg" v-if="showModal">
		<view class="modalDlg_top">
			<text class="icon iconfont icon-jt-left modalDlg_top_icon" @tap="goBack"></text>
			<input type="number" placeholder="备桌数" :value="tableNumDesc2" name="tableNumDesc2" @input="readyTableNum" minlength="0" :maxlength="readyTableNumLen"></input>
			<text class="modalDlg_top_text">备</text>
		</view>
			<view class="modalDlg_content">
				<view class="modalDlg_content_item" data-inx="1" @tap="selectExtraDesknum">
					<text :class="(isChecked1==1?'is_checked1':'normal')">1</text>
				</view>
				<view class="modalDlg_content_item" data-inx="2" @tap="selectExtraDesknum">
					<text :class="(isChecked1==2?'is_checked1':'normal')">2</text>
				</view>
				<view class="modalDlg_content_item" data-inx="3" @tap="selectExtraDesknum">
					<text :class="(isChecked1==3?'is_checked1':'normal')">3</text>
				</view>
				<view class="modalDlg_content_item" data-inx="4" @tap="selectExtraDesknum">
					<text :class="(isChecked1==4?'is_checked1':'normal')">4</text>
				</view>
				<view class="modalDlg_content_item" data-inx="5" @tap="selectExtraDesknum">
				   <text :class="(isChecked1==5?'is_checked1':'normal')">5</text>
				</view>
				<view class="modalDlg_content_item" data-inx="6" @tap="selectExtraDesknum">
					<text :class="(isChecked1==6?'is_checked1':'normal')">6</text>
				</view>
				<view class="modalDlg_content_item" data-inx="7" @tap="selectExtraDesknum">
				   <text :class="(isChecked1==7?'is_checked1':'normal')">7</text>
				</view>
				<view class="modalDlg_content_item" data-inx="8" @tap="selectExtraDesknum">
					<text :class="(isChecked1==8?'is_checked1':'normal')">8</text>
				</view>
				<view class="modalDlg_content_item" data-inx="9" @tap="selectExtraDesknum">
				   <text :class="(isChecked1==9?'is_checked1':'normal')">9</text>
				</view>
		  </view>
		  <view class="modalDlg_bottom">
			<text @tap="cancel1">取消</text>
			<text :class="(isChecked1==0?'is_checked1':'normal')" data-inx="0" @tap="selectExtraDesknum">0</text>
			<text @tap="confirm1">确定</text>
		  </view>
	</view>
	<view class="mask" catchtouchmove="preventTouchMove" v-if="showModal1"></view>
	<view class="modalDlg" v-if="showModal1">
		<view class="modalDlg_top">
			<input type="number" placeholder="桌数" minlength="0" :maxlength="tableNumLen" @input="tableNum" :value="tableNumDesc1" name="tableNumDesc1"></input>
			<text class="modalDlg_top_text">桌</text>
		</view>
		<view class="modalDlg_content">
			<view class="modalDlg_content_item" data-index="1" @tap="selectDesknum">
			   <text :class="(isChecked==1?'is_checked':'normal')">1</text>
			</view>
			<view class="modalDlg_content_item" data-index="2" @tap="selectDesknum">
				<text :class="(isChecked==2?'is_checked':'normal')">2</text>
			</view>
			<view class="modalDlg_content_item" data-index="3" @tap="selectDesknum">
				<text :class="(isChecked==3?'is_checked':'normal')">3</text>
			</view>
			<view class="modalDlg_content_item" data-index="4" @tap="selectDesknum">
				<text :class="(isChecked==4?'is_checked':'normal')">4</text>
			</view>
			<view class="modalDlg_content_item" data-index="5" @tap="selectDesknum">
			   <text :class="(isChecked==5?'is_checked':'normal')">5</text>
			</view>
			<view class="modalDlg_content_item" data-index="6" @tap="selectDesknum">
				<text :class="(isChecked==6?'is_checked':'normal')">6</text>
			</view>
			<view class="modalDlg_content_item" data-index="7" @tap="selectDesknum">
			   <text :class="(isChecked==7?'is_checked':'normal')">7</text>
			</view>
			<view class="modalDlg_content_item" data-index="8" @tap="selectDesknum">
				<text :class="(isChecked==8?'is_checked':'normal')">8</text>
			</view>
			<view class="modalDlg_content_item" data-index="9" @tap="selectDesknum">
			   <text :class="(isChecked==9?'is_checked':'normal')">9</text>
			</view>
		</view>
		<view class="modalDlg_bottom">
			<text @tap="cancel">取消</text>
			<text :class="(isChecked==0?'is_checked':'normal')" data-index="0" @tap="selectDesknum">0</text>
			<text @tap="confirm">确定</text>
		</view>
	</view>
	</view>
</template>

<script>
export { default } from './goBooking.js';
</script>
<style lang="less" scoped>
	@import url("./goBooking.less");
</style>