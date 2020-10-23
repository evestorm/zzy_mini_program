import WXUserAddress from '@/service/WX/WXUserAddressAppService.js';
// import QQMapWX from '@/lib/amap/qqmap-wx-jssdk.min.js'
export default {
	data() {
		return {
			addressList: [], //地址列表
			qqMap:null,
		};
	},
	// 页面加载事件
	onLoad() {},
	onShow() {
		this.getAddressList();
	},
	methods: {
		// async chooseWXAddress() { //选择微信地址 （暂时去掉）
		// 	let [error,res]=await uni.chooseAddress();
		// 	if(res){
		// 		// this.qqMap=new QQMapWX({
		// 		// 	key: 'NRBBZ-H4PW3-OMT3K-3MSZE-ZUTRF-XCF53' // 必填
		// 		// });
		// 		// this.qqMap.geocoder({
		// 		// 	address:'湖北省武汉市洪山区黄家湖西路2号武汉科技大学黄家湖校区北园教师公寓10栋4单元 ',//res.provinceName+ res.cityName+res.countyName+ res.detailInfo,
		// 		// 	success:(result)=> {
		// 		// 		if(result.status==0){
		// 		// 			uni.chooseLocation({
		// 		// 				longitude:result.result.location.lng,
		// 		// 				latitude:result.result.location.lat,
		// 		// 				success:(rdata)=>{
		// 		// 					console.log(rdata)
		// 		// 				}
		// 		// 			})
		// 		// 			}
		// 		// 		}
		// 		// 	})
		// 		let data = {
		// 			userName: res.userName, //收货人姓名
		// 			telNumber: res.telNumber, //收货人电话
		// 			detailInfo:res.provinceName+ res.cityName+res.countyName+ res.detailInfo, //详细收货地址信息
		// 			xcxUserId: getApp().globalData.userInfo.id, //微信用户ID(GK01001)
					
		// 			// provinceName: res.provinceName,
		// 			// cityName: res.cityName,
		// 			// countryName: res.countyName
		// 		}
		// 		this.creatAddress(data);
		// 	}
		// 	if(error){
		// 		console.log(error)
		// 	}
		// },
		//新增收货地址
		async creatAddress(data) {
			let res = await WXUserAddress.CreateByDto(data);
			if (res) {
				let address = {
					id: res.id,
					orderUserName: res.userName,
					orderUserPhone: res.telNumber,
					orderUserAddress:  res.detailInfo+res.userAddressDoorNum
				}
				this.$storage.setOrderAddress(address);
				uni.navigateBack({
					delta: 1
				})
			}

		},
		goEdit(obj) { //跳转编辑页面
			let address = JSON.stringify(obj);
			uni.navigateTo({
				url: `/pages/indexSub/addAddress/addAddress?address=${address}`
			})
		},
		selAddress(obj) { //跳转确认订单
			let address = {
				id: obj.id,
				orderUserName: obj.userName,
				orderUserPhone: obj.telNumber,
				// orderUserAddress: obj.provinceName + '' + obj.cityName + '' + obj.countryName + '' + obj.detailInfo,
				orderUserAddress: obj.detailInfo+obj.userAddressDoorNum,
				userAddressX: obj.userAddressX,
				userAddressY: obj.userAddressY
			}
			console.log('dizhi',address)
			this.$storage.setOrderAddress(address);
			uni.navigateBack({
				delta: 1
			})
		},
		//获取收货地址列表
		async getAddressList() {
			let data = {
				xcxUserId: getApp().globalData.userInfo.id
			};
			let res = await WXUserAddress.GetUserAddressList(data);
			if(res){
				res = this.$util.null2str(res);
				res.getUserAddressListItems.forEach(item=>{
					if(!item.userAddressDoorNum){//兼容之前有省市区字段的地址
						item.detailInfo=item.provinceName+item.cityName+item.countryName+item.detailInfo;
					}
					item.userAddressDoorNum=item.userAddressDoorNum?item.userAddressDoorNum:''
				})
				this.addressList = res.getUserAddressListItems;
				if (this.$storage.getOrderAddress()) {
					let address = this.$storage.getOrderAddress();
					let findIndex = this._(this.addressList).findIndex(x => x.id == address.id);
					if (findIndex != -1) {
						this.addressList[findIndex].isDefault = 1;
					}
				}
			}
			
		}
	}
};
