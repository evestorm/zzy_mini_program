<template>
	<web-view v-if="isThreeUrl" :src="yourUrl"></web-view>
</template>

<script>
import GK11 from '@/service/GK/GK11AppService.js';
import GK27 from '@/service/GK/GK27AppService.js';
import GK28 from '@/service/GK/GK28AppService.js';
import Api from '@/common/request.js';
export default {
	data() {
		return {
			isThreeUrl:false,
			yourUrl:"",
		};
	},
	async onLoad(option) {
		// option.scene = 'GK115584100000879';
		await getApp().globalData.verifyAu();
		let user = getApp().globalData.userInfo.spOpenId;
		this.getTouchData(option.scene);
	},

	methods: {
		// 获取接触点数据
		async getTouchData(id) {
			let self = this;
			// 获取gk11数据
			let gk11data = await GK11.GetViewDto({
				id: id
			});

			// 获取接触点数据
			let gk27data = await GK27.GetViewDto({
				id: gk11data.touchSetID
			});
			// 创建访问记录
			await GK28.CreateByDto({
				storeID: gk27data.storeID,
				touchSetId: gk27data.touchSetID,
				touchInTime: self.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
				logMarketSetID: gk27data.setMarketSetID,
				touchLogUrl: gk27data.touchSetUrl,
				touchLogParam: gk11data.setParamStr,
				openId: getApp().globalData.userInfo.spOpenId,
				smallProgramCardID:gk27data.smallProgramCardID,
				hyCardID:gk27data.hyCardID,
				activeConfigGUID:gk27data.activeConfigGUID,
				touchVisitType:gk27data.touchVisitType,
			});
			this.jumpurl(gk27data);
		},
		//跳转
		async jumpurl(gk27data) {
			let self=this;
			//门店ID
			let storeID = gk27data.storeID;
			let storeName = gk27data.branchName;
			let content = '';
			let url = '';
			switch (gk27data.touchVisitTypeStr) {
				case '营销页':
					//营销页ID
					content = gk27data.setMarketSetID;
					let marketSetUrl = Api.api.addomain + `/mp?marketSetID=${content}&storeId=${storeID}`;
					url = `/pages/outUrl/outUrl?q=${encodeURIComponent(marketSetUrl)}`;
					break;

				case '第三方URL':
					// 第三方url地址
					self.yourUrl = gk27data.touchSetUrl;
					self.isThreeUrl=true;
					// url = content;
					break;

				case '门店详情':
					url = `/pages/indexSub/shopIntroduce/shopIntroduce?id=${storeID}`;
					break;

				case '优惠券领取和购买':
					// 优惠券ID
					content = gk27data.smallProgramCardID;
					url = `/pages/personalSub/coupons/coupons?smallProgramCardID=${content}&shopId=${storeID}&shopName=${storeName}`;
					console.log('优惠券领取和购买', url);
					break;

				case '立即预定':
					url = `/pages/indexSub/goBooking/goBooking?id=${storeID}`;
					break;

				case '会员卡':
					// 会员卡ID
					content = gk27data.hyCardID;
					url = `/pages/personalSub/memberCenter/memberCenter?id=${content}`;
					break;

				case '秒杀':
					//秒杀活动iD
					content = gk27data.activeConfigGUID;
					url = `/pages/indexSub/seckillInfo/seckillInfo?id=${content}`;
					break;

				case '线上商城':
					url = `/pages/indexSub/orderFood/orderFood?storeId=${storeID}`;
					break;
			}
			if(url!='')
			{
				uni.navigateTo({
					url: url
				});
			}
			
		}
	}
};
</script>
