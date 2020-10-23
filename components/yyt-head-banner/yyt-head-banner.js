// 作者:何文韬
import GZH10 from '@/service/GZH/GZH10AppService.js';
export default {
	name: 'yyt-head-banner',
	// 注册属性
	props: {
		storeid: {
			type: String,
			require: true,
			default: () => null
		}
	},
	data() {
		return {
			imgserver:getApp().globalData.PicDomain, //图片服务器
			shopImg: [], //图片信息
		};
	},
	// 页面加载事件
	async mounted() {
		let result = await GZH10.GetStorePictures({
			storeid: this.storeid
		});
	
		this.shopImg =result.datalist;
		console.log(this.shopImg);
	},
	methods: {
	 async updateClickCount(item)
		{
			item.storeImgClickCount++;
			let result = await GZH10.UpdateByDto({
				id:item.storePicID,
				storeImgClickCount:item.storeImgClickCount
			});
		},
		//跳转营销页
	  async	redirectoutUrl(item) {
		  	await this.updateClickCount(item);
			if(item.gotoObjectId&&item.gotoObjectId!=null){
			
				switch(item.gotoObjectType)
				{
					case 1:
					uni.redirectTo({
						url: `/pages/outUrl/outUrl?marketSetID=${item.gotoObjectId}&marketSetName=${item.marketSetName}&paramValue=${item.paramValue}`
					});
					break;
					case 2:
					
					uni.redirectTo({
						url: `/pages/personalSub/coupons/coupons?smallProgramCardID=${item.gotoObjectId}&shopId=${this.storeid}&shopName=优惠券`
					});
					break;
					case 3:
					uni.redirectTo({
						url: `/pages/personalSub/memberCenter/memberCenter?id=${item.gotoObjectId}`
					});
					break;
					case 4:
					uni.redirectTo({
						url: `/pages/indexSub/seckillInfo/seckillInfo?id=${item.gotoObjectId}`
					});
					break;
				
				}
				
			}
			
		},
	},
	computed: {},
	filters: {

	},
	watch: {}
	// ## 方法
};
