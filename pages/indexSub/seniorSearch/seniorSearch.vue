<template>
<view class="container">
  <view class="yyt_content">
      <view class="yyt_seniorSearch">
          <view class="yyt_seniorSearch_title  swiper-tab">
            <view :class="'swiper-tab-item ' + (currentTab == 0 ? 'active' : '')" data-current="0" @tap="clickTab">
            订包房
            </view>
            <view :class="'swiper-tab-item ' + (currentTab == 1 ? 'active' : '')" data-current="1" @tap="clickTab">
              订宴会
            </view>
          </view>
        <swiper :current="currentTab" duration="300" @change="swiperTab" :style="'height:' + srollHeight + 'px;'">
        <view class="shopInfo_tab">  
          <swiper-item>
            <view class="bookingRoom">
              <view class="bookingRoom_personal">
                <view class="bookingRoom_personal_title">
                  <view class="bookingRoom_personalName">人均</view>
                  <view class="bookingRoom_personalInput">
                    <view><input class type="number" placeholder :value="minInputFun" @input="minInputFun" confirm-type="done" focus></input></view>
                    <view class="lineFlag">~</view>
                    <view><input class type="number" placeholder :value="maxInputFun" @input="maxInputFun" confirm-type="done" focus></input></view>
                  </view>  
                </view>
                <view class="bookingRoom_personal_content">
                    <view class="section section_gap">
                      <view class="body-view">
                        <slider @change="sliderchange" @changing="bindchanging" :min="min" :max="max" :disabled="disabled" :block-size="blockSize" :block-color="blockColor" :step="step" :show-value="showValue"></slider> 
                        <view class="slider_num"><text>0</text><text>不限</text></view>
                      </view>
                    </view>
                </view>
              </view>
              <view class="bookingRoom_saleStyle">
               <text class="bookingRoom_saleStyle_title">消费类型</text>
               <view class="bookingRoom_saleStyle_content">
                <scroll-view class="scroll-user" scroll-x="true">
                  <text class="bookingRoom_saleStyle_content_title active1">全部</text>
                  <view class="bookingRoom_saleStyle_content_list">
                     <view>商务宴请</view>
                     <view>朋友宴请</view>
                     <view>生日聚会</view>
                     <view>商务宴请</view>
                     <view>朋友宴请</view>
                     <view>生日聚会</view>
                     <view>商务宴请</view>
                     <view>朋友宴请</view>
                     <view>生日聚会</view>
                      <view>商务宴请</view>
                     <view>朋友宴请</view>
                     <view>生日聚会</view>
                  </view>
                </scroll-view>
               </view>

              </view>
              <view class="bookingRoom_saleStyle">
               <text class="bookingRoom_saleStyle_title">包房类型</text>
               <view class="bookingRoom_saleStyle_content">
                <scroll-view class="scroll-user" scroll-x="true">
                  <text class="bookingRoom_saleStyle_content_title active1">全部</text>
                  <view class="bookingRoom_saleStyle_content_list">
                     <view>商务宴请</view>
                     <view>朋友宴请</view>
                     <view>生日聚会</view>
                     <view>商务宴请</view>
                     <view>朋友宴请</view>
                     <view>生日聚会</view>
                     <view>商务宴请</view>
                     <view>朋友宴请</view>
                     <view>生日聚会</view>
                      <view>商务宴请</view>
                     <view>朋友宴请</view>
                     <view>生日聚会</view>
                  </view>
                </scroll-view>
               </view>

              </view>
              <view class="bookingRoom_saleStyle">
               <text class="bookingRoom_saleStyle_title">菜系</text>
               <view class="bookingRoom_saleStyle_content">
                <scroll-view class="scroll-user" scroll-x="true">
                  <text class="bookingRoom_saleStyle_content_title active1">全部</text>
                  <view class="bookingRoom_saleStyle_content_list">
                     <view>商务宴请</view>
                     <view>朋友宴请</view>
                     <view>生日聚会</view>
                     <view>商务宴请</view>
                     <view>朋友宴请</view>
                     <view>生日聚会</view>
                     <view>商务宴请</view>
                     <view>朋友宴请</view>
                     <view>生日聚会</view>
                      <view>商务宴请</view>
                     <view>朋友宴请</view>
                     <view>生日聚会</view>
                  </view>
                </scroll-view>
               </view>

              </view>
              <view class="bookingRoom_saleStyle">
               <text class="bookingRoom_saleStyle_title">特色</text>
               <view class="bookingRoom_saleStyle_content">
                <scroll-view class="scroll-user" scroll-x="true">
                  <text class="bookingRoom_saleStyle_content_title active1">全部</text>
                  <view class="bookingRoom_saleStyle_content_list">
                     <view>商务宴请</view>
                     <view>朋友宴请</view>
                     <view>生日聚会</view>
                     <view>商务宴请</view>
                     <view>朋友宴请</view>
                     <view>生日聚会</view>
                     <view>商务宴请</view>
                     <view>朋友宴请</view>
                     <view>生日聚会</view>
                      <view>商务宴请</view>
                     <view>朋友宴请</view>
                     <view>生日聚会</view>
                  </view>
                </scroll-view>
                 <view class="lookMore">
                      <view class="lookMore_tip">
                        <image class="icon iconfont icon-Add"></image>
                        <text>查看更多特色标签</text>
                      </view>
                      <view class="getMoreList" style="display:none">
                        <ul>
                              <li><a href="#">双湖园</a></li>
                              <li><a href="#">香格里拉</a></li>
                              <li><a href="#">太子酒店</a></li>
                               <li><a href="#">双湖园</a></li>
                              <li><a href="#">7天连锁酒店</a></li>
                               <li><a href="#">双湖园</a></li>
                                <li><a href="#">双湖园</a></li>
                                <li><a href="#">双湖园</a></li>
                        </ul>
                        <view class="closeMoreList">
                          <image class="icon iconfont icon-jt-left"></image>
                          <text>收起</text>
                        </view>
                      </view>
                  </view>
               </view>

              </view>
              <view class=" weui-cells_after-title">
            <radio-group @change="radioChange">
                <label class=" weui-check__label" v-for="(item, value) in radioItems" :key="value">
                    <radio class="weui-check" :value="item.value" :checked="item.checked"></radio>

                    <view class>{{item.name}}</view>
                    <view class="weui-cell__ft weui-cell__ft_in-radio" v-if="item.checked">
                       
                    </view>
                </label>
            </radio-group>
            
        </view>
            </view>
          </swiper-item>
          <swiper-item>
            <view class="bookingFood">
            </view>
          </swiper-item>
        </view>
        </swiper>
      </view>
    </view>
</view>
</template>

<script>
//获取应用实例
var isDisabled = true;

export default {
  data() {
    return {
      currentTab: 0,
      scrollTop: 0,
      srollHeight: 300,
      //随便给的一个初始高度
      //默认最小值20；
      min: 0,
      //默认最大值20；
      max: 200,
      //设置不禁用
      disabled: false,
      //设置滑块的大小
      blockSize: 14,
      //设置滑块的颜色
      blockColor: "#eeeeee",
      //是否显示当前 value
      showValue: true,
      //步长
      step: 1,
      minInput: 0,
      maxInput: 200,
      radioItems: [{
        name: '综合排序',
        value: '0'
      }, {
        name: '热门排序',
        value: '1'
      }, {
        name: '评价排序',
        value: '2',
        checked: true
      }]
    };
  },

  components: {},
  props: {},
  onLoad: function () {},
  onShow: function () {
    uni.getSystemInfo({
      success: res => {
        console.log(res.windowHeight);
        var height = res.windowHeight;
        this.setData({
          srollHeight: height
        });
      }
    });
  },
  methods: {
    //滑动切换
    swiperTab: function (e) {
      console.log(e);
      var that = this;
      that.setData({
        currentTab: e.detail.current
      });
    },
    //点击切换
    clickTab: function (e) {
      console.log(e.target);
      var that = this;

      if (this.currentTab === e.target.dataset.current) {
        return false;
      } else {
        that.setData({
          currentTab: e.target.dataset.current
        });
      }
    },
    //设置最小值
    minInputFun: function (e) {
      this.setData({
        min: e.detail.value
      });
    },
    //设置最大值
    maxInputFun: function (e) {
      this.setData({
        max: e.detail.value
      });
    },
    //设置是否禁用滑动
    btnDisabled: function (e) {
      if (isDisabled == true) {
        isDisabled = false;
        this.setData({
          disabled: true
        });
      } else {
        isDisabled = true;
        this.setData({
          disabled: false
        });
      }
    },
    //设置滑块的大小
    blockSizeInput: function (e) {
      this.setData({
        blockSize: e.detail.value
      });
    },
    //设置步长，取值必须大于 0，并且可被(max - min)整除
    stepInput: function (e) {
      this.setData({
        step: e.detail.value
      });
    },
    //设置滑块的颜色
    blockColorInput: function (e) {
      this.setData({
        blockColor: e.detail.value
      });
    },
    //设置是否显示当前value
    btnshowValue: function () {
      this.setData({
        showValue: false
      });
    },
    //完成一次拖动后触发的事件
    sliderchange: function (e) {
      console.log(e.detail.value);
      this.setData({
        maxInput: e.detail.value
      });
    },
    //拖动过程中的触发的事件
    bindchanging: function (e) {
      this.setData({
        maxInput: e.detail.value
      });
      console.log(e.detail.value);
    },
    radioChange: function (e) {
      console.log('radio发生change事件，携带value值为：', e.detail.value);
      var radioItems = this.radioItems;

      for (var i = 0, len = radioItems.length; i < len; ++i) {
        radioItems[i].checked = radioItems[i].value == e.detail.value;
      }

      this.setData({
        radioItems: radioItems
      });
    },
    setData: function (obj) {
      let that = this;
      let keys = [];
      let val, data;
      Object.keys(obj).forEach(function (key) {
        keys = key.split('.');
        val = obj[key];
        data = that.$data;
        keys.forEach(function (key2, index) {
          if (index + 1 == keys.length) {
            that.$set(data, key2, val);
          } else {
            if (!data[key2]) {
              that.$set(data, key2, {});
            }
          }

          data = data[key2];
        });
      });
    }
  }
};
</script>
<style>
@import "./seniorSearch.css";
</style>