<template>
	<view class="booking-edit">
		<!-- 预定详情 -->
		<view class="container">
			<view class="yyt_booingContent">
				<view class="bookingContent_totalMsg">
					<view class="bookingContent-title">预定信息</view>
					<view class="bookingContent_totalMsg_r" v-if="types==1">
						<view v-for="(item, index) in selView" :key="index" class="view-parent" v-if="index<dataCount">
							<text v-if="index != 3 && index != 4 && index != 5">{{item.text}}</text>
							<view v-if="index == 3" v-for="(innerItem, indexItem) in item" :key="indexItem">
								<view class="">
									<text>{{innerItem.text}}</text>
									<text v-for="(dinItem, indexInnerItem) in innerItem.diningType" :key="indexInnerItem" v-if="dinItem.selected">{{dinItem.text}} {{dinItem.time[0]}}</text>
								</view>
						  </view>
						</view>
					</view>
					<view class="bookingContent_totalMsg_r" v-if="types==2">
						<view class="view-parent">
							<text v-for="(item, index) in selView" :key="index" v-if="index<2">{{item.text}}</text>
							<view>
								<text v-for="(item, index) in selView" :key="index" v-if="index>=2&&index<dataCount">{{item.text}}</text>
						  </view>
						</view>
					</view>
				</view>
				<view class="clearfix"></view>
				<view class="bookingContent_detailMsg">
					<view class="bookingContent_detailMsg_list">
							<image src="https://pic.cwyyt.cn/upload/yyticons/163505355_name.png" class="bookingContent_detailMsg_list_image"></image>
						<view class="bookingContent_detailMsg_list_cell">
							<view class="bookingContent_detailMsg_list_cell_name" v-if="userInfo.fullName">{{userInfo.fullName}}</view>
							<view class="bookingContent_detailMsg_list_cell_name" v-if="!userInfo.fullName">
								<input placeholder="请输入姓名" @blur="getName" auto-focus></input>
							</view>
							<!-- <view class="bookingContent_detailMsg_list_cell_sex" style="display:none">
								<text :class="' ' + (currentText==0?'active':'')" data-currentText="0" @tap="clickText">
								  女士
								</text>
								<text :class="(currentText==1?'active':'')" data-currentText="1" @tap="clickText">
								  先生
								</text>
							</view> -->
						</view>
					</view>
					<view class="bookingContent_detailMsg_list">
							<image src="https://pic.cwyyt.cn/upload/yyticons/1628232823_call.png" @tap="callPhone" class="bookingContent_detailMsg_list_image"></image>
						<view class="bookingContent_detailMsg_list_cell">
							<input class="bookingContent_detailMsg_list_cell_name" @input="getPhone" :value="(selView[selView.length - 3].data)" type="tel"></input>
						</view>
					</view>
					<view class="bookingContent_detailMsg_list">
							<image src="https://pic.cwyyt.cn/upload/yyticons/163003303_danwei.png" class="bookingContent_detailMsg_list_image"></image>
						<view class="bookingContent_detailMsg_list_cell">
							<input class="bookingContent_detailMsg_list_cell_name" type="text" maxlength="15" :value="selView[selView.length - 2].data||''" @input="getCompany" placeholder="请输入单位信息"></input>
							<!-- <input class="bookingContent_detailMsg_list_cell_name" type="text" maxlength="15" :value="(selView[selView.length - 2].data==undefined?selView[selView.length - 2].data:'')" @input="getCompany" placeholder="请输入单位信息"></input> -->
						</view>
					</view>
				</view>
				<view class="bookingContent-remark">
					<view class="remark-top">
						<view class="bookingContent-title">备注信息</view>
						<view class="remark-label"  @tap="showModal=true">快速标签</view>
					</view>
					<view class="textarea-remark">
						<textarea placeholder-style="fontSize:24rpx;color:#999" auto-height placeholder="请输入备注信息" :value="(selView[selView.length - 1].data)"  @input="textAreaText"/>
					</view>
				</view>
			</view>
			<form @submit="Book" class="formSubmit" :report-submit="true">
				<view class="weui-btn-area">
					<button class="weui-btn" formType="submit">下一步</button>
				</view>
			</form>
		</view>
	<!-- 弹出确认提示框 -->
		<cover-view class="mask" catchtouchmove="preventTouchMove" v-if="showModal">
			<cover-view class="modalDlg" v-if="showModal">
				<cover-view class="bookingContent-title">快速标签</cover-view>
				<cover-view class="bookingContent_detailMsg_list_tab">
					<!-- <scroll-view scroll-y class="scroll-y"> -->
						<cover-view v-for="(item, index) in tagList" :key="index" :class="(item.isSel?'active':'') + ' tablist'" :data-tagid="item.tagID" :data-tagContent="item.tagContent" @tap="selBookTag">{{item.tagContent}}</cover-view>
					<!-- </scroll-view> -->
				</cover-view>
				<cover-view class="modalDlg_bottom">
					<cover-view @tap="cancel()" class="cancel handleBtn">取消</cover-view>
					<cover-view  @tap="confirm()" class="confirm handleBtn">确定</cover-view>
				</cover-view>
			</cover-view>
		</cover-view>
	</view>
</template>

<script>
export { default } from './bookingEdit.js';
</script>
<style lang="less" scoped>
	@import "./bookingEdit.less";
</style> 