import HY02 from '@/service/HY/HY02AppService.js';
let App = getApp().globalData;

export default {
	data() {
		return {
			option: {},
			unGetIndex: 1,
			getIndex: 1,
			size: 10,
			unGetNoData: false,
			getNoData: false,
			openId: '',
			curSelected: 1,
			unclaimed: [],
			collect: [],
			shopId: ',// 门店id'
		};
	},

	components: {},
	props: {},
	onLoad(option) {
	this.option= option;
	},

	async onShow() {
		getApp().globalData.curUrl = {
			// path: '/pages/personalSub/storeMember/storeMember',
			path: this.$util.getCurrentPageUrl(),
			query: this.option
		};
		let res=await getApp().globalData.verifyAu();
		if(res){
			if (this.option.type) {
				this.curSelected= this.option.type;
			}
			this.openId = uni.getStorageSync('authority').openId;
			this.unclaimedCard(this.option.storeId);
			this.collectCard(this.option.storeId);
			this.shopId= this.option.storeId;
		}
	},

	onReachBottom() {
		if (this.curSelected == 1) {
			if (!this.unGetNoData) {
				this.unGetIndex = ++this.unGetIndex;
				this.unclaimedCard(this.shopId, this.unclaimed);
			}
		} else {
			if (!this.getNoData) {
				this.getIndex = ++this.getIndex;
				this.collectCard(this.shopId, this.collect);
			}
		}
	},

	methods: {
		select(event) { //待领取/已领取切换
			let type = event.currentTarget.dataset.type;
			if (type == this.curSelected) return;
			this.curSelected= type;
		},
		async unclaimedCard(storeId, array) { //获取会员卡列表
			array = array || [];
			let data = {
				storeID: storeId,
				openID: this.openId,
				pageIndex: this.unGetIndex,
				pageSize: this.size,
				order: 'effBeginTime'
			};
			let res=await HY02.unclaimed(data);
			 if(res){
				res.dataList.forEach(item => {
					if (item.cardImgUrl) {
						item.cardImgUrl = item.cardImgUrl;
					} else {//https://pic.yunyutian.cn/upload/yytBanner/img2.png
						item.cardImgUrl = 'https://pic.cwyyt.cn/upload/img/20200319/120912912_card-bj.png';
					}
					if (item.cardLogoUrl) {
						item.cardLogoUrl = item.cardLogoUrl;
					} else {//https://pic.yunyutian.cn/upload/yytBanner/img1.png
						item.cardLogoUrl = 'https://pic.cwyyt.cn/upload/img/20200319/121504154_card-logo.png';
					}
					array.push(item);
				});
					this.unclaimed= array;

				if (res.dataList.length < this.size) {
					this.unGetNoData = true;
				}
			};
		},

		async collectCard(storeId, array) {
			array = array || [];
			let data = {
				storeID: storeId,
				openID: this.openId,
				pageIndex: this.getIndex,
				pageSize: this.size,
				order: 'effBeginTime'
			};
			let res=await HY02.collect(data);
			 if(res){
				let dataList = res.dataList;
				dataList.forEach(item => {
					if (item.cardImgUrl) {
						item.cardImgUrl = item.cardImgUrl;
					} else {//https://pic.yunyutian.cn/upload/yytBanner/img2.png
						item.cardImgUrl = 'https://pic.cwyyt.cn/upload/img/20200319/120912912_card-bj.png';
					}
					if (item.cardLogoUrl) {
						item.cardLogoUrl = item.cardLogoUrl;
					} else {//https://pic.yunyutian.cn/upload/yytBanner/img1.png
						item.cardLogoUrl = 'https://pic.cwyyt.cn/upload/img/20200319/121504154_card-logo.png';
					}
					let splitRule = [4, 4, 6, 5];
					let arrayTwo = [];

					if (item.hyUserCode) {
						splitRule.forEach(em=>{
							let curStr = item.hyUserCode.substring(0, em);
							item.hyUserCode = item.hyUserCode.substring(em);
							arrayTwo.push(curStr);
						})
						// for (let i = 0; i < splitRule.length; i++) {
						// 	let curStr = item.hyUserCode.substring(0, splitRule[i]);
						// 	item.hyUserCode = item.hyUserCode.substring(splitRule[i]);
						// 	arrayTwo.push(curStr);
						// }
					}
					item.hyUserCode = arrayTwo;
					array.push(item);
				});
					this.collect= array;

				if (dataList.length < this.size) {
					this.getNoData = true;
				}
			};
		},

		goMemberCenter(event) { //跳转会员中心详情页面
			let id = event.currentTarget.dataset.hycardid;
			uni.navigateTo({
				url: `/pages/personalSub/memberCenter/memberCenter?id=${id}&shopId=${this.shopId}`
			});
		}
	}
};
