<template>
	<view>
		<image class="logo" :src="option.logo" role="img"></image>
		<view class="store_text">{{option.storeName}}</view>
		<view class="main">
		  <image src="https://pic.cwyyt.cn/upload/img/20191106/163201321_tips.png" role="img"></image>
		  <text>检测到您的账号已有一张会员卡，您可以直接绑定这张卡。</text>
		</view>
		<navigator class="tied_card" open-type="redirect" :url="`/pages/personalSub/tiedCard/tiedCard?logo=${option.logo}&storeId=${option.storeId}&storeName=${option.storeName}&hyCardID=${option.hyCardID}`">立即去绑卡</navigator>
	</view>
</template>

<script>
import CY20AppService from '@/service/CY/CY20AppService.js'

export default {
  data() {
    return {
      option: {}
    };
  },

  components: {},
  props: {},

  onLoad(option) {
	  this.option=option;
  },

  methods: {
    // goTo() {
    //   uni.redirectTo({
    //     url: `/pages/personalSub/tiedCard/tiedCard?logo=${this.option.logo}&storeId=${this.option.storeId}&storeName=${this.option.storeName}&hyCardID=${this.option.hyCardID}`
    //   });
    // }
  }
};
</script>
<style>
@import "./openCard.css";
</style>