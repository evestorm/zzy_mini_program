import WXUserAddress from '@/service/WX/WXUserAddressAppService.js';

export default {
	data() {
		return {
			isEdit: false, //是否是更新地址
			region: ['', '', ''], //省市区
			addressData: { //创建收货地址参数
				id: '', //地址主键
				userName: "", //收货人姓名
				telNumber: "", //收货人电话
				userAddressDoorNum: '',
				// provinceName: "", //省份
				// cityName: "", //城市
				// countryName: "", //区域
				detailInfo: "", //详细收货地址信息
				xcxUserId: "" //微信用户ID(GK01001)
			},
			updateDate: {}, //更新地址参数
			showModal: false, //是否显示删除提示框
		};
	},
	onShow() {
		// // 获取缓存的地图地址信息
		// if(this.$storage.getMapAddress()){
		// 	let mapAddress=this.$storage.getMapAddress();
		// 	this.addressData = Object.assign({},this.addressData,{district:mapAddress.district, detailInfo:mapAddress.detailInfo,longitude:mapAddress.longitude,latitude:mapAddress.latitude})
		// 	this.updateDate.detailInfo=mapAddress.detailInfo;
		// 	this.updateDate.longitude=mapAddress.longitude;
		// 	this.updateDate.latitude=mapAddress.latitude;
		// 	console.log('map缓存地址',this.addressData)
		// }

	},
	onUnload() {
		// this.$storage.removeMapAddress();//页面卸载即清除地图缓存
	},
	// 页面加载事件
	onLoad(option) {
		console.log(option)
		this.addressData = option.address ? JSON.parse(option.address) : {};
		// this.id = this.addressData.id;
		this.isEdit = option.address ? true : false;
		if (!this.addressData.userAddressDoorNum && this.isEdit) { //兼容之修改有省市区  拼接
			this.addressData.detailInfo = this.addressData.provinceName + this.addressData.cityName + this.addressData.countryName +
				this.addressData.detailInfo
		} else{
			this.addressData.detailInfo =this.addressData.detailInfo?this.addressData.detailInfo:'';
		}
		this.addressData.userAddressDoorNum =this.addressData.userAddressDoorNum?this.addressData.userAddressDoorNum: ''
		
		// //添加省市区 兼容之前的地址 
		// let addressText='';
		// if(this.addressData.provinceName)addressText=addressText+this.addressData.provinceName;
		// if(this.addressData.cityName)addressText=addressText+this.addressData.cityName;
		// if(this.addressData.countryName)addressText=addressText+this.addressData.countryName;
		// if(this.addressData.detailInfo)addressText=addressText+this.addressData.detailInfo;
		// this.addressData.addressText=addressText;//地址信息

		// if (uni.getStorageSync('localCity')) { //有位置授权缓存
		// 	let localCity = uni.getStorageSync('localCity');
		// 	this.region[0] = this.addressData.provinceName ? this.addressData.provinceName : localCity.province;
		// 	this.region[1] = this.addressData.cityName ? this.addressData.cityName : this.region[0] == localCity.province ?
		// 		localCity.city :
		// 		''; //省相同 无市取市值
		// 	this.region[2] = this.addressData.countryName ? this.addressData.countryName : this.region[1] == localCity.city ?
		// 		localCity.district :
		// 		''; //
		// } else {
		// 	this.region[0] = this.addressData.provinceName ? this.addressData.provinceName : '';
		// 	this.region[1] = this.addressData.cityName ? this.addressData.cityName : ''; //省相同 无市取市值
		// 	this.region[2] = this.addressData.countryName ? this.addressData.countryName : ''; //
		// }
		// this.addressData.district=this.region.join('')
	},
	methods: {
		async chooseLocation() { //点击选择地址
			let [error, res] = await uni.chooseLocation({});
			if (res) {
				this.addressData = Object.assign({}, this.addressData, {
					detailInfo: res.address + res.name,
					userAddressX: res.longitude,
					userAddressY: res.latitude
				})
				if (this.isEdit) { //更新
					this.updateDate = Object.assign({}, this.updateDate, {
						detailInfo: res.address + res.name,
						userAddressX: res.longitude,
						userAddressY: res.latitude
					})
				} 
				
			}
		},
		editUserName(e) { //修改姓名
			let fullName = e.detail.value;
			if (this.isEdit) {
				this.updateDate.userName = fullName;
			} else {
				this.addressData.userName = fullName;
			}
		},
		editTel(e) { //修改电话
			let telNumber = e.detail.value;
			if (this.isEdit) {
				this.updateDate.telNumber = telNumber;
			} else {
				this.addressData.telNumber = telNumber;
			}
		},
		// //点击修改省份信息
		// bindRegionChange: function(e) {
		// 	let region = e.detail.value;
		// 	if (this.isEdit) { //更新
		// 		// this.updateDate.provinceName = region[0];
		// 		// this.updateDate.cityName = region[1];
		// 		// this.updateDate.countryName = region[2];
		// 		this.updateDate.cityName=region.join('');
		// 	}
		// 	this.region = e.detail.value;
		// 	this.addressData.district=region.join('');
		// },
		editDetailInfo(e) { //修改详细地址
			let userAddressDoorNum = e.detail.value;
			if (this.isEdit) {
				this.updateDate.userAddressDoorNum = userAddressDoorNum;
			} else {
				this.addressData.userAddressDoorNum = userAddressDoorNum;
			}
		},
		//点击保存按钮
		preserveAddress() {
			if (!this.addressData.userName || this.addressData.userName == '') {
				uni.showToast({
					title: '姓名不能为空',
					icon: 'none',
				})
				return;
			}
			if (!this.addressData.telNumber || this.addressData.telNumber == '') {
				uni.showToast({
					title: '电话号码不能为空',
					icon: 'none',
				})
				return;
			}
			if (!this.addressData.detailInfo || this.addressData.detailInfo == '') {
				uni.showToast({
					title: '地址不能为空',
					icon: 'none',
				})
				return;
			}
			if (this.isEdit) {
				this.updateAddress();
			} else {
				this.creatAddress();
			}
		},
		// 取消删除地址
		cancel() {
			this.showModal = false;
		},
		//点击删除按钮
		openDelPopup() {
			this.showModal = true;
		},
		//新增收货地址
		async creatAddress() {
			let data = {
				userName: this.addressData.userName, //收货人姓名
				telNumber: this.addressData.telNumber, //收货人电话
				detailInfo: this.addressData.detailInfo, //详细收货地址信息
				xcxUserId: getApp().globalData.userInfo.id, //微信用户ID(GK01001)
				userAddressX: this.addressData.userAddressX,
				userAddressY: this.addressData.userAddressY,
				userAddressDoorNum: this.addressData.userAddressDoorNum,
				// provinceName: self.region[0],
				// cityName: self.region[1],
				// countryName: self.region[2]
			}

			let res = await WXUserAddress.CreateByDto(data);
			if (res) {
				let address = {
					id: res.id,
					orderUserName: res.userName,
					orderUserPhone: res.telNumber,
					orderUserAddress: res.detailInfo+res.userAddressDoorNum,
					userAddressX: res.userAddressX,
					userAddressY: res.userAddressY
				}
				this.$storage.setOrderAddress(address);
				uni.navigateBack({
					delta: 2
				})
			}
		},
		//更新收货地址
		async updateAddress() {
			//兼容之前的 值留一个城市名 
			this.updateDate.id = this.addressData.id;
			let data = this.updateDate;
			let res = await WXUserAddress.UpdateByDto(data); //
			if (res) {
				let address = {
					orderUserName: res.userName,
					orderUserPhone: res.telNumber,
					orderUserAddress:res.detailInfo+res.userAddressDoorNum,
					userAddressX: res.userAddressX,
					userAddressY: res.userAddressY
				}
				this.showModal = false;
				this.$storage.setOrderAddress(address);
				uni.navigateBack({
					delta: 2
				})
			}
		},
		// 删除地址
		async delAddress() {
			let data = {
				id: this.addressData.id
			}
			let res = await WXUserAddress.DeleteByDto(data);
			if (res && this.$storage.getOrderAddress()) {
				if (this.$storage.getOrderAddress().id == this.addressData.id) {
					this.$storage.removeOrderAddress()
				}
			}
			uni.navigateBack({
				delta: 1
			})
		}
	}
};
