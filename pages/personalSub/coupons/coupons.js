import GK06 from '@/service/GK/GK06AppService.js';
import GK07 from '@/service/GK/GK07AppService.js';
import GK08 from '@/service/GK/GK08AppService.js';
import GK09 from '@/service/GK/GK09AppService.js';
import GK24 from '@/service/GK/GK24AppService.js';
import HY15 from '@/service/HY/HY15AppService.js';
import GK22 from '@/service/GK/GK22AppService.js';
export default {
	data() {
		return {
			picDomain: getApp().globalData.PicDomain,
			urlOption: {},
			cardInfos: {
				salesCount: 0,
				surplusCount: 0,
				useRangRemark: 0,
				effectiveRemark: 0
			},
			shopName: '', //店名用于进来店铺和优惠券创建迪纳普不一致时 
			isUse: false, //使用
			smallProgramCardID: "",
			cardStatusEnumValue: "",
			cardStatusEnumValuetext: "",
			cardCodeUrl: "",
			qrCodeUrl: "",
			startTime: "",
			endTime: "",
			shopId: "",
			scene: "",
			shareOpenId: "", //分享人id
			smallProgramCardUserID: "",
			visterId: '', //访问记录id
			isCanGetNum:0,//已经领取的数量
		};
	},
	computed: {
		expired() {
			// 当前时间是否在过期时间之后 TimeRestrictionType：1 有结束日期 2：没有结束日期 几天内有效 3:永久有效
			console.log(this.cardInfos.timeRestrictionType,this.endTime,this.$moment().isBefore(this.endTime))
			let bol=this.cardInfos.timeRestrictionType==1 ? this.$moment().isBefore(this.endTime) : true;
			return bol
		}
	},
	filters: {
		formatCardCode(val) {
			let formatStr = val.slice(0, 8);
			let tailStr = val.slice(8);
			const g = /\d{4}/g;
			const matched = formatStr.match(g);
			return matched ? matched.join(" ") + " " + tailStr : val;
		}
	},
	async onLoad(option) {
		if (option.shopId) {
			//添加门店信息
			getApp().globalData.AddNGKUser(option.shopId);
		}
		await getApp().globalData.verifyAu(); // 验证权限获取用户信息
		this.shopName = option.shopName ? option.shopName : '';
		this.cardStatusEnumValuetext = option.cardStatusEnumValue;
		this.spopenid = option.spopenid;
		this.isUse = option.use && option.use == 'isUse' ? true : false; //店铺详情优惠活动进来要领取优惠券
		this.urlOption = option;
		if (option.shareOpenid) {
			this.shareOpenId = option.shareOpenid;
		}

		if (option.scene) {
			option.scene = decodeURIComponent(option.scene);
			if (~option.scene.indexOf("sceneType")) {
				option = {
					scene: option.scene.split("&")[0]
				};
				this.qrCardId(option.scene);
				this.qrVister(option.scene);
				this.scene = option.scene;
			} else {
				let data = {
					id: option.scene
				}

				let res = await HY15.getQRParam(data);
				this.shareMarketID = res.sharePeople;
				// 如果是用户分享扫码进来那么需要把 marketID制空 加上shareOpenId
				if (res.genType == 2) {
					this.shareOpenId = res.sharePeople;
					this.shareMarketID = ';'
				}

				this.smallProgramCardID = res.shareContent;
				this.shopId = res.shareStore;
				//添加门店信息
				getApp().globalData.AddNGKUser(res.shareStore);
				this.getCouponInformation();
			}
		} else {
			if (
				option.smallProgramCardID ||
				option.cardStatusEnumValue ||
				option.cardCodeUrl ||
				option.qrCodeUrl ||
				option.smallProgramCardUserID
			) {
				let smallProgramCardID = option.smallProgramCardID;
				let cardStatusEnumValue = option.cardStatusEnumValue || ""
				let cardCodeUrl = option.cardCodeUrl || "";
				let qrCodeUrl = option.qrCodeUrl || "";
				let smallProgramCardUserID = option.smallProgramCardUserID || "";
				this.smallProgramCardID = smallProgramCardID;
				this.cardStatusEnumValue = cardStatusEnumValue;
				this.cardCodeUrl = cardCodeUrl;
				this.qrCodeUrl = qrCodeUrl;
				this.smallProgramCardUserID = smallProgramCardUserID;
			}

			this.shopId = option.shopId;
			this.getCouponInformation();
		}
	},
	// 分享
	onShareAppMessage() {
		return {
			title: "优惠券详情",
			path: `/pages/personalSub/coupons/coupons?smallProgramCardID=${
				this.smallProgramCardID
			}&shareOpenid=${getApp().globalData.userInfo.spOpenId}&shopId=${
				this.shopId
			}`
		};
	},

	methods: {
		//添加优惠券的访问记录
		async createVister() {
			let data = {
				// marketerID:"string",//来自那个销售经理ID(MarketerID)
				appInOpenId: getApp().globalData.userInfo.openId, //进入页面的OpenId
				appInTime: this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss'), //进入时间
				appPageName: "优惠券", //页面类型
				appInVisitID: this.smallProgramCardID, //营销页ID或者会员卡ID或者优惠券ID
				appInVisitType: 3, //访问类型(1,营销页;2,会员卡;3,优惠券)
			}
			if (this.shareMarketID) data.marketerID = this.shareMarketID;
			console.log(data)
			let res = await GK22.CreateByDto(data);
			if (res) {
				this.visterId = res.id;
			}
		},
		// 修改会优惠券的访问记录
		async updateVister() {
			let data = {
				id: this.visterId,
				appInIsBuy: 1
			}
			let res = await GK22.UpdateByDto(data);
		},
		// 记录分享进入的日志
		updateShareInfo() {
			getApp().globalData.getShareInfo({
				query: this.urlOption,
				curOpenid: getApp().globalData.userInfo.spOpenId,
				path: `/pages/personalSub/coupons/coupons`,
				title: "优惠券",
				description: `优惠券-${this.cardInfos.cardName}`
			});
		},
		async qrCardId(id) { //通过二维码ID获取对应ID
			let data = {
				pageIndex: 1,
				pageSize: 1,
				order: "CardGenID desc",
				filter: {
					Type: "and",
					Conditions: [{
						Attribute: "CardGenID",
						Datatype: "nvarchar",
						Operatoer: "eq",
						Value: id
					}]
				}
			};
			let result = await GK08.GetViewPage(data);
			if (result) {
				this.smallProgramCardID = result.dataList[0].smallProgramCardID;
				this.getCouponInformation();
			};
		},
		async qrVister(id) { //添加二维码访问记录
			let data = {
				cardGenID: id,
				xcxUserID: getApp().globalData.LoginUserId
			};
			let result = await GK09.CreateByDto(data);
		},
		async getCouponInformation() { //获取优惠券详情
			let data = {
				xcxUserID: getApp().globalData.userInfo.id,
				smallProgramCardID: this.smallProgramCardID
			};
			let result = await GK07.GetCouponInformation(data);
			if (result) {
				this.cardInfos = this.$util.null2str(result.smallProgramCard);
				this.shopName = this.shopName || `${this.cardInfos.businessName}(${this.cardInfos.branchName})`;
				this.startTime = this.cardInfos.beginTime || this.cardInfos.beginTime.slice(0, 10).replace(/-/g, ".");
				this.endTime = this.cardInfos.endTime || this.cardInfos.endTime.slice(0, 10).replace(/-/g, ".");
				this.isCanGetNum=this.cardInfos.restrictionPerPerson && (this.cardInfos.restrictionPerPerson - result.selfSmallProgramCard.length);//获取已经领取的数量
				if (this.isUse) { // 使用的时候才显示去使用按钮
					if (this.cardInfos.cardStatusEnumValue == '正常') {
						this.cardStatusEnumValue = '正常';
						this.cardCodeUrl = this.cardInfos.cardCodeUrl;
						this.qrCodeUrl = this.cardInfos.qrCodeUrl;
						this.smallProgramCardUserID = this.cardInfos.smallProgramCardUserID;
						return
					}
				}
				this.createVister(); //添加访问记录
				this.updateShareInfo();
			}
		},
		async getCard(e) { //领取优惠券
			// 验证改用户是否注册
			let url = encodeURIComponent(
				`/pages/personalSub/coupons/coupons?smallProgramCardID=${this.smallProgramCardID}&scene=${this.scene}`
			);
			let userId = getApp().globalData.userInfo.id;
			let data = {
				xcxUserID: userId,
				smallProgramCardID: this.smallProgramCardID,
				marketID: getApp().globalData.couponsCom.origin == 'isWeb' ? getApp().globalData.couponsCom.markerId :  this.shareMarketID,
				shareOpenId: this.shareOpenId ? this.shareOpenId : "",
				storeId: this.shopId,
				couponReceiveFromType: getApp().globalData.couponsCom.origin=='isWeb' ? 30: 10,//(10:卡券详情；20:秒杀；30:营销页)除了营销页外 都算卡券详情
				couponReceiveFromId:getApp().globalData.couponsCom.origin=='isWeb' ? getApp().globalData.couponsCom.marketSetId : this.smallProgramCardID,//卡券领取来源id
			};
			let result = await GK07.ReceiveCoupons(data);
			if (!result.error){
				this.updateVister(); //更改访问记录
				let [error, rdata] = await uni.showToast({
					title: "领取成功,可到我的卡券中查看",
					icon: "none",
					duration: 1000,
					mask: true,
				});
				if (rdata) {
					uni.navigateTo({
						url: "/pages/personalSub/myCoupon/myCoupon"
					});
				}
			}

		},
		buyCard(e) {
			if(this.isCanGetNum>0){
				this.cardInfos.isCanGetNum=this.isCanGetNum;
				console.log('this.cardInfos',this.cardInfos)
				uni.setStorageSync("couponInfoCarDinfo", this.cardInfos); // 验证改用户是否注册
				uni.navigateTo({
					url: `/pages/personalSub/buyCoupon/buyCoupon?shareMarketID=${this.shareMarketID}&shareOpenId=${this.shareOpenId}&visterId=${this.visterId}`
				});
			}else{
				uni.showToast({
					title:'您购买的数量已达上限！',
					icon:'none'
				})
			}
			
		},
		//使用卡券
		goUse(e) {
			let cardItem = this.cardInfos;
			// 兼容一张卡券的时候进行跳转
			cardItem.cardCodeUrl = this.cardCodeUrl ? this.cardCodeUrl : ''
			// 兼容一张卡券的时候进行跳转
			cardItem.qrCodeUrl = this.qrCodeUrl ? this.qrCodeUrl : '';
			getApp().globalData.selectMyCouponCarDinfo = cardItem;
			uni.navigateTo({
				url: "/pages/personalSub/useCoupon/useCoupon"
			});
		}
	}
};
