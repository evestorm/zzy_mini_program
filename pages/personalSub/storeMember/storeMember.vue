<template>
	<!-- 门店会员卡 -->
  <view class="store-card">
    <view class="store_mtop">
      <view
        :class="curSelected == 1 ? 'store_mselected' : ''"
        data-type="1"
        @tap="select"
        >待领取</view
      >
      <view
        :class="curSelected == 2 ? 'store_mselected' : ''"
        data-type="2"
        @tap="select"
        >已领取</view
      >
    </view>
    <view v-if="curSelected == 1">
      <view
        class="card_list"
        v-for="(item, index) in unclaimed"
        :key="index"
        :style="'background-image: url(' + item.cardImgUrl + ')'"
        :data-hycardid="item.hyCardID"
        @tap="goMemberCenter"
      >
        <view class="card_Info">
          <view class="left">
            <view
              class="image"
              :style="
                'background: url(' +
                  item.cardLogoUrl +
                  ') 0 0/100% 100% no-repeat'
              "
            ></view>
            <text :style="'color: #' + item.hyCardTitleColor">{{
              item.hyCardTitle
            }}</text>
          </view>
          <!-- <text class="right">{{item.hyLevelName}}</text> -->
        </view>
        <!-- <view class="card_bottom">
      <text wx:for="{{item.hyUserCode}}" wx:for-item="innerItem" wx:for-index="Innerindex" wx:key="index">{{innerItem}}</text>
    </view> -->
      </view>
    </view>
    <view v-if="curSelected == 2">
      <view
        class="card_list"
        v-for="(item, index) in collect"
        :key="index"
        :style="
          'background-image: url(' +
            (item.hyLevelBgUrl ? item.hyLevelBgUrl : item.cardImgUrl) +
            ')'
        "
        :data-hycardid="item.hyCardID"
        @tap="goMemberCenter"
      >
        <view class="card_Info">
          <view class="left">
            <view
              class="image"
              :style="
                'background: url(' +
                  item.cardLogoUrl +
                  ') 0 0/100% 100% no-repeat'
              "
            ></view>
            <text :style="'color: #' + item.hyCardTitleColor">{{
              item.hyCardTitle
            }}</text>
          </view>
          <text class="right">{{ item.hyLevelName }}</text>
        </view>
        <view class="card_bottom" :style="'color: #' + item.hyCardCodeColor">
          <text v-for="(innerItem, index2) in item.hyUserCode" :key="index2">{{
            innerItem
          }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export { default } from './storeMember.js';
</script>

<style lang="less" scoped>
@import url('storeMember.less');
</style>
