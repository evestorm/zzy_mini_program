import GK07 from '@/service/GK/GK07AppService.js';
import GK06 from '@/service/GK/GK06AppService.js';
import GK22 from '@/service/GK/GK22AppService.js';

export default {
	data() {
		return {
			smallProgramCardUserID:'' ,// 用户领取会员卡ID
			cardInfo:{}, // 领取优惠券信息
			picDomain:getApp().globalData.PicDomain,
			showModal: false, //点击分享图片时显示分享码图片
			shareImgSrc: '' ,//分享朋友圈图片
			shopName: '', //店名用于进来店铺和优惠券创建迪纳普不一致时
			shopId:'',
		};
	},
	async onLoad(option) {
		if(option.shopId){
			//添加门店信息
			getApp().globalData.AddNGKUser(option.shopId);
			this.shopId=option.shopId;
		}
		await getApp().globalData.verifyAu(); // 验证权限获取用户信息
		this.smallProgramCardUserID=option.smallProgramCardUserID;
		this.shopName = option.shopName ? option.shopName : '';
		this.loadCardInfo();
		this.createByDto();
	},
	// 分享
	onShareAppMessage() {
		return {
			title: "优惠券详情",
			path: `/pages/personalSub/coupons/coupons?smallProgramCardID=${
				this.cardInfo.smallProgramCardID
			}&shareOpenid=${getApp().globalData.userInfo.spOpenId}&shopId=${
				this.shopId
			}`
		};
	},
	methods: {
		//添加会员卡和优惠券的访问记录
		async createByDto(){
			let data={
				// marketerID:"string",//来自那个销售经理ID(MarketerID)
				appInOpenId:getApp().globalData.userInfo.openId,//进入页面的OpenId
				appInTime:this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),//进入时间
				appPageName:"优惠券",//页面类型
				appInVisitID:this.smallProgramCardUserID,//营销页ID或者会员卡ID或者优惠券ID
				appInVisitType:3,//访问类型(1,营销页;2,会员卡;3,优惠券)
			}
			console.log(data)
			let res=await GK22.CreateByDto(data);
			
		},
		// 加载优惠劵信息
		async loadCardInfo(){
			let data={
				id:this.smallProgramCardUserID
			}
			this.cardInfo= this.$util.null2str(await GK07.GetViewDto(data));
			this.shopName = this.shopName || this.cardInfo.branchName;
		},
		//点击我的分享码
		async openPopup() {
			let data = {
				storeID: this.cardInfo.storeID,
				smallProgramCardID: this.cardInfo.smallProgramCardID,
				sharePeople: getApp().globalData.userInfo.spOpenId
			};
			let res= await GK06.DownloadSmallProgramCard(data);
			this.shareImgSrc = res.completeCodePath;
			this.showModal = true;
		},
		//保存图片
		async shareImg() {
			uni.showLoading({
				title: '图片保存中...'
			})
			let [error,res]= await uni.downloadFile({
				url: this.shareImgSrc
			});
			await uni.saveImageToPhotosAlbum({filePath: res.tempFilePath});
			uni.hideLoading();
			this.showModal = false;
			uni.showToast({
				title: '已成功为您保存图片到相册，请自行分享',
				duration: 2500
			})
		},
		// 去核销
		goUse(){
			if(this.isUseCurrentTime){
				getApp().globalData.selectMyCouponCarDinfo=this.cardInfo;
				uni.navigateTo({
					url: "/pages/personalSub/useCoupon/useCoupon"
				});
			}else{
				uni.showToast({
					title: `暂未到优惠券使用时间`,
					icon: 'none',
					duration: 2500
				});
			}
		},
		// 去商城
		goShop(){
			if(this.isUseCurrentTime){
				// 加入选择的优惠券对应的产品
				getApp().globalData.selectCouponProductItem=this.cardInfo;
				let shopId=this.shopId||this.cardInfo.storeID;
				uni.redirectTo({
					url: `/pages/indexSub/orderFood/orderFood?storeId=${shopId}`
				});
			}else{
				uni.showToast({
					title: `暂未到优惠券使用时间`,
					icon: 'none',
					duration: 2500
				});
			}
		}
	},
	computed: {
		// 判断当前的时间是否到了卡券可使用的时间
		isUseCurrentTime(){
			let item=this.cardInfo;
			// 选择判断当前时间
			let beginTime = this.$filter['parseShortDate'](item.cardEffectiveBeginTime);
			return this.$moment()>=this.$moment(beginTime);
		},
		// 展示核销按钮
		isShowHxButton(){
			return !this.cardInfo.isPast && this.cardInfo.cardStatusEnumValue == '正常'
		},
		// 展示商城按钮
		isShowShopButton(){
			return !this.cardInfo.isPast && this.cardInfo.cardStatusEnumValue == '正常'&&this.cardInfo.isUseShop;
		}
	},
	filters: {
		
	},
};
