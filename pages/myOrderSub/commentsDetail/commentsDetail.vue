<!-- 评价详情 -->
<template>
	<!-- pages/commentsDetail/commentsDetail.wxml -->
	<view class="">
		<view class="comments_Info">
			<view class="commentsHeader">
				<view class="commentsHeader-info">
					<view class="order-list text-info3c">
						<image src="https://pic.cwyyt.cn/upload/yyticons/1651205120_pc.png" class="pc-icon" mode=""></image>
						<text class="date">{{ orderInfo.bookOn }}</text>
						<text>{{ orderInfo.diningTypeName }} {{ orderInfo.willArrivedOn }}</text>
						<view class="market">
							<image :src="salesInfo.imgUrl" class="market-img" mode=""></image>
							<view class="">
								<view class="text-info3c market-name">{{ salesInfo.name }}</view>
								<view class="more">详情>></view>
							</view>
						</view>
					</view>
					<view class="order-list">
						<image src="https://pic.cwyyt.cn/upload/yyticons/165507557_table.png" class="table-icon" mode=""></image>
						<text class="text-info3c">{{ tableTists }}</text>
					</view>
					<view class="order-list">
						<image src="https://pic.cwyyt.cn/upload/yyticons/1647144714_money.png" class="money-icon" mode=""></image>
						<view class="text-info3c">消费</view>
						<view class="count">
							<text class="dw">￥</text>
							<text class="num">{{ orderInfo.fee | formatMoney }}</text>
						</view>
					</view>
				</view>
				<!-- <view class="commentsHeader_content">
          <view class="commentsHeader_top">
            <view class="commentsHeader_top_l">
              <image :src="salesInfo.imgUrl"></image>
              <view class="salseInfo">
                <view class="salseInfo_item">
                  <text class="title">客服经理:</text>
                  <text>{{ salesInfo.name }}</text>
                </view>
                <view class="salseInfo_item">
                  <text class="title">联系电话:</text>
                  <text>{{ salesInfo.phone }}</text>
                </view>
              </view>
            </view>
            <view class="commentsHeader_top_r" @tap="callPhone"
              ><image :src="telPhonePic"></image
            ></view>
          </view>
          <view class="commentsHeader_bottom">
            <text>{{ orderInfo.bookOn }}</text>
            <text>{{ orderInfo.diningTypeName }}</text>
            <text>{{ orderInfo.masterTableName }}</text>
            <text>{{ orderInfo.fee }}元</text>
          </view>
        </view> -->
			</view>
			<view class="commentsContent">
				<!-- 评价 -->
				<view class="commentsContent_shopComment">
					<view class="commentsContent_shopComment_content">
						<view class="commentsContent_shopComment_content_title">
							<image :src="webUrl + '' + storeInfo.imgUrl" mode="" class="hotel-img"></image>
							<text>{{ storeInfo.storeName }}</text>
						</view>
						<view class="commentsContent_shopComment_content_rating_stars">
							<text
								:class="
									'icon iconfont icon-shoucang1 star ' + (selectedColor >= item ? 'on' : '')
								"
								@tap="changeScoure"
								v-for="(item, index) in starScore"
								:key="index"
								:data-sel="item"
							></text>
						</view>
					</view>

					<view class="commentsContent_shopComment_content">
						<text class="commentsContent_shopComment_content_title">环境</text>
						<view class="commentsContent_shopComment_content_rating_stars">
							<text
								:class="
									'icon iconfont icon-shoucang1 star ' +
										(selectedColor1 >= item ? 'on' : '')
								"
								@tap="changeScoure1"
								v-for="(item, index) in starScore"
								:key="index"
								:data-sel="item"
							></text>
						</view>
					</view>
					<view class="commentsContent_shopComment_content">
						<text class="commentsContent_shopComment_content_title">服务状态</text>
						<view class="commentsContent_shopComment_content_rating_stars">
							<text
								:class="
									'icon iconfont icon-shoucang1 star ' +
										(selectedColor2 >= item ? 'on' : '')
								"
								@tap="changeScoure2"
								v-for="(item, index) in starScore"
								:key="index"
								:data-sel="item"
							></text>
						</view>
					</view>
					<view class="commentsContent_shopComment_content">
						<text class="commentsContent_shopComment_content_title">客服经理</text>
						<view class="commentsContent_shopComment_content_rating_stars">
							<text
								:class="
									'icon iconfont icon-shoucang1 star ' +
										(selectedColor3 >= item ? 'on' : '')
								"
								@tap="changeScoure3"
								v-for="(item, index) in starScore"
								:key="index"
								:data-sel="item"
							></text>
						</view>
					</view>
				</view>
				<!-- 菜品评价:暂无 -->
				<!-- <view class="commentsContent_shopComment" v-if="dishes.length > 0">
					<text class="commentsContent_shopComment_title">菜品评价</text>
					<view class="commentsContent_shopComment_content" v-for="(item, index) in dishes" :key="index">
						<text class="commentsContent_shopComment_content_title">{{ item.materialName }}</text>
						<view class="commentsContent_shopComment_content_rating_stars">
							<text
								:class="'icon iconfont icon-shoucang1 star ' + (selectedColorByDishes[dishesIndex] >= item ? 'on' : '')"
								@tap="changeScoureByDeshes"
								v-for="(item, index2) in starScore"
								:key="index2"
								:data-deshes="dishesIndex"
								:data-sel="item"
							></text>
						</view>
					</view>
				</view> -->
				<!-- 备注 -->
				<!-- view class="commentsHeader_shop_textarea">
					<view class=" weui-cells_after-title">
						<view class="weui-cell"> -->
				<view class="commentsContent-text">
					<textarea
						class="weui-textarea"
						placeholder="说说您的评价,让我们为您提供更优质的服务~"
						placeholder-style="fontSize:24rpx;color:#999"
						auto-height
						@input="getComment"
					></textarea>
					<!-- <view class="weui-textarea-counter">至少输入8个字</view>
								<view class="weui-textarea-counter" style="display:none">19/500</view> -->
				</view>
				<!-- </view>
					</view>
				</view> -->

				<view class="commentsHeader_shop_photos">
					<view class="commentsHeader_shop_photos_content" v-if="isShowPhoto">
						<view class="weui-uploader__bd">
							<view class="weui-uploader__files" id="uploaderFiles">
								<!-- <canvas canvas-id="img_preview"  style='position:absolute;top:-99999px;left:-9999px'></canvas> -->
								<block v-for="(item, index) in files" :key="index">
									<view class="weui-uploader__file ">
										<!-- <image class="weui-uploader__img" src="{{item}}" mode="aspectFill" />
                  <view class="weui-uploader__file-content" wx:if="{{status}}">{{item.uploadProgress}}%</view> -->
										<image
											class="weui-uploader__img"
											:src="item.path"
											mode="aspectFill"
											@tap="previewImage"
											:id="item.path"
										></image>
										<!-- <text class="icon iconfont icon-jianhao delIcon" @tap="delFile" :data-path="item.path"></text> -->
										<image
											class="delIcon"
											src="https://pic.cwyyt.cn/upload/yyticons/164002402_del.png"
											mode="aspectFill"
											@tap="delFile(item.path)"
											:data-path="item.path"
										/>
									</view>
								</block>
							</view>
							<view class="weui-uploader__input-box" v-if="uploadImgNum < 6">
								<view class="weui-uploader__input" @tap="chooseImage"></view>
								<text class="icon iconfont icon-xiangji uploadPic"></text>
							</view>
						</view>
					</view>
					<view class="commentsHeader_shop_photos_desc" v-else>
						<view class="commentsHeader_shop_photos_l" @tap="chooseImage">
							<text class="icon iconfont icon-xiangji"></text>
						</view>
						<view class="commentsHeader_shop_photos_r">
							<text class="commentsHeader_shop_photos_r_title">上传图片</text>
							<text class="commentsHeader_shop_photos_r_content">
								内容丰富会变成优质评价，最多可以上传6张哦
							</text>
						</view>
					</view>
				</view>
				<view class="bottom-btn">
					<button class="btn" @tap="goSubmit" formType="submit" :disabled="isDisabled" :style="{opacity:isDisabled?'0.4':'1'}">提交</button>
					<!-- <form report-submit="true" @submit="goSubmit"><button class="weui-btn" formType="submit">提交</button></form> -->
					<!-- <button class="weui-btn" type="" bindtap="goSubmit">提交</button> -->
				</view>
			</view>
		</view>
		<!-- 弹出确认提示框 -->
		<cover-view class="mask" catchtouchmove="preventTouchMove" v-if="showModal">
			<cover-view class="modalDlg" v-if="showModal">
				<cover-view class="bookingContent-title">提示</cover-view>
				<cover-view class="bookingContent_detailMsg_list_tab">
					<cover-image src="https://pic.cwyyt.cn/upload/yyticons/1551305130_error.png" class="mid-img"></cover-image>
					<cover-view class="mid-text">您确定要删除图片?</cover-view>
					<!-- <scroll-view scroll-y class="scroll-y"> -->
					<!-- <cover-view v-for="(item, index) in tagList" :key="index" :class="(item.isSel?'active':'') + ' tablist'" :data-id="item.id" :data-tagContent="item.tagContent" @tap="selBookTag">{{item.tagContent}}</cover-view> -->
					<!-- </scroll-view> -->
				</cover-view>
				<cover-view class="modalDlg_bottom">
					<cover-view @tap="cancel()" class="cancel handleBtn">取消</cover-view>
					<cover-view @tap="confirm()" class="confirm handleBtn">确定</cover-view>
				</cover-view>
			</cover-view>
		</cover-view>
		<!-- 删除提示框 -->
		<!-- <uni-popup ref="tipPopup" type="center" :custom="true">
			<view class="tip-popup">
				<view class="popup-top">
					<view class="top-title">提示</view>
				</view>
				<view class="popup-mid">
					<image class='mid-img' src="https://pic.cwyyt.cn/upload/yyticons/1551305130_error.png"  mode=""></image>
					<text class='mid-text'>您确定要删除图片?</text>
				</view>
				<view class="popup-bottom">
					<view class="cancel handleBtn" @tap="cancel()">取消</view>
					<view class="confirm handleBtn" @tap="confirm()">确定</view>
				</view>
			</view>
		</uni-popup> -->
	</view>
</template>

<script>
export { default } from './commentsDetail.js';
</script>
<style lang="less" scoped>
@import './commentsDetail.less';
</style>
