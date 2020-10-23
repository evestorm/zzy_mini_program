<template>
    <view>
        <!--头部-->
      
        <!--内容-->
        <view id="PageContent">
		  <view class="files">
		    <view class="file-name">{{yHCstRecord.cstRecordConfName}}</view>
		    <view class="file-list">
		      <view class="file-list-item">
		        <text class="item-title">姓名</text>
		        <input class="item-sec" v-model="yHCstRecord.cstName"  type="text" placeholder="请输入客户姓名" />
		      </view>
		      <view class="file-list-item">
		        <text class="item-title">电话</text>
		        <input class="item-sec" v-model="yHCstRecord.cstPhone"  type="text" placeholder="请输入电话" />
		      </view>
			  <view class="file-list-item">
			  	<text class="item-title">生日</text>
				<picker class="item-sec" mode="date" @change="chooseDate" :value="yHCstRecord.cstBirthday_date" >
					<view class="picker">
				  	    <text  v-if="yHCstRecord.cstBirthday_date" >{{yHCstRecord.cstBirthday_date}}</text>
						<text class="text-date" style="color: grey;" v-else>请选择生日</text>
					<!-- 	<image class="arrowRight" src="https://pic.cwyyt.cn/upload/yyticons/1625432543_arrowRight.png"></image> -->
					</view>
				</picker>
			  </view>
			  <view class="file-list-item">
			  	<text class="item-title">性别</text>
			  	<radio-group class="item-sec" @change="radioChange" >
			  		<label class="radio" >
			  			<radio style="transform:scale(0.5)" value="1" :checked="yHCstRecord.cstSex==1"  />
			  			男
			  		</label>
			  		<label class="radio" >
			  			<radio style="transform:scale(0.5)" value="2" :checked="yHCstRecord.cstSex==2" />
			  			女
			  		</label>
			  	</radio-group>
			  
			
			  </view>
			  
			  <view class="file-list-item">
			     	<text class="item-title">民族</text>
			  	<picker style="width: 500rpx;"  class="desc" :value="yHCstRecord.cstNationindex"  @change="NationSelect" :range="NationData" range-key="name">
			  		<text class="cstNation" v-show="yHCstRecord.cstNation!=''">{{yHCstRecord.cstNation}}</text> 
			  		<text class="text-date" v-show="yHCstRecord.cstNation==''">请选择民族信息</text>
			  		<image class="arrowRight" src="https://pic.cwyyt.cn/upload/yyticons/1625432543_arrowRight.png"></image>
			  	</picker>
			  
			  </view>
		     <!-- <view class="file-list-item">
		        <text class="item-title">民族</text>
				
		        <input class="item-sec" v-model="yHCstRecord.cstNation"  type="text" placeholder="请输入民族信息" />
		      </view> -->
		      <view class="file-list-item">
		        <text class="item-title">住址</text>
		        <input class="item-sec" v-model="yHCstRecord.cstAddress"  type="text" placeholder="请输入住址信息" />
		      </view>
		      <view class="file-list-item">
		        <text class="item-title">单位</text>
		        <input class="item-sec" v-model="yHCstRecord.cstCompany"  type="text" placeholder="请输入单位信息" />
		      </view>
		      <view class="file-list-item">
		        <text class="item-title">职业</text>
		        <input class="item-sec" v-model="yHCstRecord.cstJob"  type="text" placeholder="请输入职业信息" />
		      </view>
		    </view>
		    <view class="weui-btn-area">
		        <button class="weui-btn"   @tap="updateFile">提交</button>		     
		    </view>
		  </view>
		</view>
        <!--底部-->
        <view id="PageBottom"></view>
    </view>
</template>

<script>
    export { default } from './writeFile.js';
</script>

<style lang="less" scoped>
    @import url('writeFile.less');
</style>
