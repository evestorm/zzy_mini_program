// 作者:覃彬
import MSActiveConfig from '@/service/MS/MSActiveConfigAppService.js';
import HY07 from '@/service/HY/HY07AppService.js';
import GK07 from '@/service/GK/GK07AppService.js';
export default {
	data() {
		return {
			isFiststShow:true,//控制第一次进入请求接口显示加载loading，onshow不显示loading
			msInfoId: '', //秒杀活动id
			msInfo: {}, //秒杀活动详情
			msNum: 1, //抢购的数量默认1
		};
	},
	onShow() {
		this.getSpikeActivityDetail(this.msInfoId);
		this.isFiststShow=false;
	},
	// 页面加载事件
	onLoad(option) {
		this.msInfoId = option.id;
	},
	methods: {
		// 秒杀活动详情
		async getSpikeActivityDetail(id) {
			const data = {
				mSActiveConfigGUID: id,
				openId: getApp().globalData.userInfo.spOpenId
			};
			let result = await MSActiveConfig.GetSpikeActivityDetail(data,null,null,this.isFiststShow);
			this.msInfo = this.$util.null2str(result);
			this.msInfo.imgUrl = this.msInfo.imgUrl ? getApp().globalData.PicDomain + this.msInfo.imgUrl :
				'https://pic.cwyyt.cn/upload/img/20200331/1620282028_hotel.png';
		},
		//会员卡价格为0时 直接领取会员卡
		async getMemberCard(){
			let data={
				hyCardID: this.msInfo.msGoodGUID,//会员卡ID(HY02001)
				userCardStatus: "2",//卡的状态(1,待激活;2,使用中;3,锁定;4,已置换;5,废卡)
				cardComeType: "2",//会员卡领取来源(1,门店;2,掌中宴)
				getStoreID: this.msInfo.buUnitGUID,//会员卡领取门店ID(GZH09001)
				zZYOpenid: getApp().globalData.userInfo.spOpenId,//掌中宴openid，可关联GK01
				hyUserTel:getApp().globalData.userInfo.phone,
				activeConfigGUID: this.msInfo.id, //秒杀活动id
				isBuySuccess: '1',
				cardReceiveFromType:20,//(10:卡券详情；20:秒杀；30:营销页)秒杀暂时只有一个入口  写死20
				cardReceiveFromId:this.msInfo.id,//卡券领取来源id（秒杀id）
			}
			let result=await HY07.CreateByDto(data);
			if(result.id){//
				this.$util.showToastCancel('success','抢购成功!')
				setTimeout(()=>{
					uni.navigateTo({
						url: `/pages/personalSub/memberCenter/memberCenter?id=${result.hyCardID}&shopId=${this.msInfo.buUnitGUID}`
					})
				},2000)
			}
		},
		//优惠券价格为0时 直接领取优惠券 跳转优惠券列表
		async getCoupons(){
			let data={
				storeId : this.msInfo.buUnitGUID,//门店id
				xcxUserID:getApp().globalData.userInfo.id,//小程序用户ID
				smallProgramCardID: this.msInfo.msGoodGUID,//卡券ID
				activeConfigGUID: this.msInfo.id, //秒杀活动id
				// marketID:,//销售经理id
				isMSActive:1, 
				buyCount :this.msNum,//数量
				couponReceiveFromType:20,//(10:卡券详情；20:秒杀；30:营销页)秒杀暂时只有一个入口  写死20
				couponReceiveFromId:this.msInfo.id,//卡券领取来源id（秒杀id）
			}		
			let result=await GK07.ReceiveCoupons(data);
			uni.showToast({
				title:'抢购成功！',
				duration:2000
			})
			setTimeout(()=>{
				uni.navigateTo({
					url: `/pages/personalSub/myCoupon/myCoupon`
				})
			},2100)
		},
		msNumAdd() {
			//增加购买数量
			if (this.msNum < this.msInfo.msPeopleCount) {
				this.msNum += 1;
			} else {
				uni.showToast({
					title: `每人限购${this.msInfo.msPeopleCount}张`,
					icon: 'none',
				});
			}
		},
		buyCard() {
			//购买秒杀券
			if (!this.msInfo.isAllowedBuy) { //已购买的数量=允许购买最大的数量 提示不能购买
				uni.showToast({
					title: '购买数量已达上限！',
					icon: 'none'
				})
				return;
			}
			if (this.msInfo.msGoodType == 1) {
				//秒杀商品的类型(1,会员卡;2,优惠券)
				if(this.msInfo.msGoodsPrice==0){//会员卡价格为0 直接领取，否则走公共支付
					this.getMemberCard();
				}else{
					let param = {
						logo: getApp().globalData.PicDomain + this.msInfo.logo,
						comName: this.msInfo.businessName,
						storeName: this.msInfo.branchName,
						storeId: this.msInfo.buUnitGUID,
						productName: this.msInfo.activeConfigName,
						productId: this.msInfo.msGoodGUID,
						payAmount: this.msInfo.msGoodsPrice,
						relAmount: this.msInfo.buyAmount,
						buyType: '1',
						shareOpenId: uni.getStorageSync('userInfo').spOpenId, //getApp().globalData.userInfo.spOpenId
						activeConfigGUID: this.msInfo.id, //秒杀活动id
						receiveType: 1,
						cardReceiveFromType:20,//(10:卡券详情；20:秒杀；30:营销页)秒杀暂时只有一个入口  写死20
						cardReceiveFromId:this.msInfo.id,//卡券领取来源id（秒杀id）
					};
					wx.navigateTo({
						url: `/pages/common/pay/pay?param=${JSON.stringify(param)}&type=1`,
					});
				}
			} else if (this.msInfo.msGoodType == 2) {
				if(this.msInfo.msGoodsPrice==0){
					this.getCoupons();
				}else{
					let param = {
						storeId: this.msInfo.buUnitGUID,
						productId: this.msInfo.msGoodGUID,
						productName: this.msInfo.activeConfigName,
						smallProgramCardID: this.msInfo.msGoodGUID,
						buyCount: this.msNum,
						logo: getApp().globalData.PicDomain + this.msInfo.logo,
						comName: this.msInfo.businessName,
						storeName: this.msInfo.branchName,
						payAmount: this.msInfo.msGoodsPrice * this.msNum,
						relAmount: this.msInfo.buyAmount * this.msNum,
						shareOpenId: uni.getStorageSync('userInfo').spOpenId, //getApp().globalData.userInfo.spOpenId
						activeConfigGUID: this.msInfo.id, //秒杀活动id
						receiveType: 1,
						couponReceiveFromType:20,//(10:卡券详情；20:秒杀；30:营销页)秒杀暂时只有一个入口  写死20
						couponReceiveFromId:this.msInfo.id,//卡券领取来源id（秒杀id）
					};
					wx.navigateTo({
						url: `/pages/common/pay/pay?param=${JSON.stringify(param)}&type=2`,
					});
				}
			}
		},
	},
	computed: {
		msGoodsSurplus() {
			return this.msInfo.msGoodsCount - this.msInfo.buyCount;
		},
	},
	filters: {
		formatCardCode(val) {
			switch (val) {
				case 2:
					return '已售罄，下次加油'
					break;
				case 3:
					return '距开抢'
					break;
				case 4:
					return '距结束'
					break;
				case 5:
					return '已经结束了，下次加油'
					break;
				default:
					return '未上线'
					break;
			}
		}
	},
	// ## 方法
};
