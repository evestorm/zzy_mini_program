<template>
	<view>
		<image class="logo" :src="option.logo" role="img"></image>
		<view class="store_text">{{option.storeName}}</view>
		<view class="form_main">
			<view class="form_item">
				<text>姓名</text>
				<input type="text" maxlength="8" :disabled="yzmInputDisabled" placeholder="请输入您的姓名" @change="getName"></input>
			</view>
			<view class="form_item">
				<text>电话</text>
				 <input type="number" maxlength="11" :disabled="yzmDisabled" placeholder="请输入您电话信息" @input="getTel"></input>
			</view>
			<view class="form_item">
				<text>验证码</text>
				<view class="input_container"><input maxlength="6" placeholder="请输入验证码" @input="getCode" type="number" :disabled="yzmInputDisabled"></input></view>
				<view type="number" class="getCode" @tap="sendCode">{{yzm}}</view>
			</view>
		</view>
		<view class="tied_card" @tap="tiedCard">立即绑卡</view>
	</view>
</template>

<script>
import HY07AppService from '@/service/HY/HY07AppService.js';
import GK01AppService from '@/service/GK/GK01AppService.js';

export default {
  data() {
    return {
      option: {},
      name: '',
      tel: '',
      code: '',
      yzm: '获取验证码',
      djs: 0,
      yzmDisabled: false,
      yzmInputDisabled: false,
      rightYzm: ''
    };
  },

  components: {},
  props: {},

  onLoad(option) {
	  this.option=option
  },

  methods: {
    getName(event) {
      this.name = event.detail.value;
    },

    getTel(event) {
      this.tel = event.detail.value;
    },

    async sendCode() {
		//按钮禁用时不做任何操作
		if (this.yzmInputDisabled) return; // if (this.data.yzmDisabled) return;
		if (!this.name) {
			this.showToast('cancel', '请输入姓名');
			return;
		}
		if (!this.$util.validatemobile(this.tel)) {
			this.showToast('cancel', '手机号输入有误');
			return;
		}
		let data = {
			tel: this.tel
		};
		this.djs = 60; //禁用button
        this.yzmDisabled= true;
        this.yzm= '重新发送(' + 60 + 's)'
		//重置倒计时

		let yzmInterval = setInterval(() => {
			if (this.djs <= 0) {
				this.yzm= '获取验证码' // yzmDisabled: false,
				clearInterval(yzmInterval);
			} else {
				this.djs--;
				this.yzm= '重新发送(' + this.djs + 's)'
			}
		}, 1000); // this.showToast('success', '验证码发送中', 60000); 

		this.showToast('success', '验证码发送中', 3000);
		let rdata=await GK01AppService.SendCode(data);
		if(rdata){
			this.showToast('success', '验证码发送成功');
			//this.rightYzm = rdata;
		}else{
			this.yzmDisabled=false;
		};
    },

    getCode(e) {
      let val = e.detail.value;
      this.code = val;

      if (val.length != 6) {
        return;
      }

      if (val.length==6) {
        //this.showToast("success", "验证码正确");
          this.yzmInputDisabled= true;
          this.djs= 0;
      } 
	  // else {
   //      //this.showToast("cancel", "验证码错误");
   //    }
    },

    async tiedCard() {
		if (!this.name) {
			this.showToast('cancel', '请输入姓名', 1000);
			return;
		}
		if (!this.$util.validatemobile(this.tel)) {
			this.showToast('cancel', '手机号输入有误', 1000);
			return;
		}

		if (!this.code || this.code.length < 6) {
			this.showToast('cancel', '验证码输入有误', 1000);
			return;
		} // if (!this.data.yzmInputDisabled) return;

		let data = {
			hyUserTel: this.tel,
			hyCardID: this.option.hyCardID,
			hyUserName: this.name
		};
		let res=await HY07AppService.BindElecCard(data);
		if(res){
			uni.redirectTo({
				url: `/pages/personalSub/memberCenter/memberCenter?id=${this.option.hyCardID}&shopID=${this.option.storeId}`
			});
		}else{
			this.zmInputDisabled= false
			console.log(this.yzmInputDisabled);
		};
    },

    showToast(type, text, timer) {
			let types = type || 'cancel';
			text = text || '验证码错误!';
			let image;
			if (types == 'cancel') {
				image = '/static/toast/cancel.png';
			} else if (types == 'success') {
				image = '/static/toast/success.png';
			}
			uni.showToast({
					image: image,
					icon: 'none',
					duration: timer ? timer : 1500,
					color: '#fff',
					title: text,
					mask: true,
					success: () => {
					}
			});
    }
  }
};
</script>
<style>
@import "./tiedCard.css";
</style>