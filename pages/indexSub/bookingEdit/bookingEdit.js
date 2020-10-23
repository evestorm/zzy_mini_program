let animationShowHeight = 0;
import GK01AppService from '@/service/GK/GK01AppService.js';
import CY20AppService from '@/service/CY/CY20AppService.js';
import GK09AppService from '@/service/GZH/GZH09AppService.js';
import GK18AppService from '@/service/GK/GK18AppService.js';
export default {
	data() {
		return {
			currentText: 1,
			isShow: true,
			isShow2: true,
			animation: '',
			//////////////////////////
			userInfo: {},
			//用户信息
			nowshopid: '',
			//当前门店id
			tagList: [],
			//标签集合 `
			selView: [],
			//预订缓存
			saleId: '',
			//客服经理id（可能没有对应的id）
			types: 0,
			//预订类型（1.订包房   2.订宴会）
			dataCount: 0,
			//缓存中预订信息的长度,
			selectInputText: '',
			//输入的备注
			bookData: {},
			//上次是否有未提交的预订
			isSub: false,
			//是否提交成功
			showModal: false //快速标签的弹框
				,
			isSel: 0
		};
	},
	props: {},
	onLoad(option) {
		let self = this;
		let types = option.types;
		let booking_data = ''; //获取缓存中的预订信息

		if (types == 1) {
			booking_data = uni.getStorageSync('booking_data') || '';
		} else if (types == 2) {
			booking_data = uni.getStorageSync('booking_data1') || '';
		}
		
		//添加门店信息
		getApp().globalData.AddNGKUser(option.id);

		this.setData({
			types: types,
			nowshopid: option.id,
			saleId: option.saleId,
			userInfo: getApp().globalData.userInfo,
			bookData: getApp().globalData.bookData,
			dataCount: booking_data.length
		});
		booking_data.push({
			id: 0,
			text: self.userInfo.fullName,
			data: self.userInfo.fullName
		}); //用户

		let phone = self.userInfo.phone;
		let company = option.company && option.company !== 'undefined' ? option.company : '';
		let remark = ''; //有上次未确定的预订信息

		if (self.bookData) {
			if (self.bookData.phone) {
				phone = self.bookData.phone;
			}

			if (self.bookData.company) {
				company = self.bookData.company ? self.bookData.company : '';
			}

			if (self.bookData.remark) {
				remark = self.bookData.remark;
			}
		}

		booking_data.push({
			id: 0,
			text: phone,
			data: phone
		}); //电话

		booking_data.push({
			id: 0,
			text: company,
			data: company
		}); //单位

		booking_data.push({
			id: 0,
			text: '',
			data: ''
		}); //备注

		this.setData({
			selView: booking_data
		});
		self.selView = booking_data;
		this.getBookTag(); //弹出组件

	},
	onUnload(option) {
		if (!this.isSub) {
			getApp().globalData.bookData = {
				phone: this.selView[this.selView.length - 3].data,
				company: this.selView[this.selView.length - 2].data ? this.selView[this.selView.length - 2].data : '',
				remark: this.selectInputText
			};
		}
	},
	methods: {
		//保存选择（选择种类，文本）
		selViewFun(num, txt, dat) {
			this.selView[num].id = num;
			this.selView[num].text = txt;
			this.selView[num].data = dat;
		},
		// 保存姓名
		async getName(e) {
			let objData = {
				fullName: e.detail.value,
				id: getApp().globalData.LoginUserId
			}; // 更新用户信息;
			let rdata=await GK01AppService.UpdateByDto(objData);
			getApp().globalData.userInfo.fullName = rdata.fullName;
			this.userInfo.fullName = rdata.fullName;
			this.setData({
				userInfo: this.userInfo
			});
			this.selViewFun(this.selView.length - 4, rdata.fullName, rdata.fullName);
		},
		//手机号输入时将值存储
		getPhone(e) {
			this.selViewFun(this.selView.length - 3, e.detail.value, e.detail.value); //实时刷新你输入电话的值

			this.setData({
				selView: this.selView
			});
		},
		//企业输入时将值存储
		getCompany(e) {
			this.selViewFun(this.selView.length - 2, e.detail.value, e.detail.value);
		},
		//输入备注
		textAreaText(e) {
			let selectInputText = e.detail.value;
			this.selViewFun(this.selView.length - 1, selectInputText, selectInputText);
			this.setData({
				selectInputText: selectInputText,
				selView: this.selView
			});
		},
		// // 下来
		// btnClick() {
		// 	let animation = uni.createAnimation({
		// 		transformOrigin: '50% 50%',
		// 		duration: 1000,
		// 		timingFunction: 'ease',
		// 		delay: 0
		// 	});
		// 	this.animation = animation;
		// 	animation.translateY(animationShowHeight).step();
		// 	this.setData({
		// 		isShow2: false,
		// 		animation: animation.export()
		// 	});
		// },
		// // 上去
		// btnClickTo() {
		// 	let animation = uni.createAnimation({
		// 		transformOrigin: '50% 50%',
		// 		duration: 1000,
		// 		timingFunction: 'ease-in-out',
		// 		delay: 0
		// 	});
		// 	this.animation = animation;
		// 	animation.translateY(0).step();
		// 	this.setData({
		// 		isShow2: true,
		// 		animation: animation.export()
		// 	});
		// },
		//预订
		async Book(e) {
			let self = this;
			
			let selView = this.selView;
			let dataObj = {};
			if (this.types == 1) {
				if (!this.selView[4].data) {
					this.showToastCancel('cancel', '请输入姓名');
					return;
				};
				let mulDinner = [];
				selView[3].forEach((item, index) => {
					if (item.selected) {
						let dining = [];
						item.diningType.forEach(innerItem => {
							dining.push(`${innerItem.text}${innerItem.time[0]}`);
						});
						mulDinner.push(`${item.data.trim()}  ${dining.join('  ')}`);
					}
				});
				dataObj = {
					'userId': getApp().globalData.LoginUserId,
					'roomType': selView[0].data,
					'roomActivityType': selView[1].data,
					'bookNums': selView[2].data,
					'bookDate': selView[3][0].data,
					'diningTypeId': selView[3][0].diningType[0].data,
					'bookTime': selView[3][0].diningType[0].time[0],
					'customerName': selView[4].data,
					'phone': selView[5].data,
					'company': selView[6].data ? selView[6].data : '',
					'remark': selView[7].data,
					//用户备注   eg：不要辣，或者自行输入
					'saleId': this.saleId,
					'storeID': this.nowshopid,
					// "bookTypeId": selView[1].data, // 这里的数据取得是包房的类型id
					'shareBookRemark':selView[1].text,//宴会类型
					'customerRemark': selView[0].text + "  " + selView[1].text + "  " + selView[2].text,//人数+宴会类型+宴会餐别
					// 'customerRemark': JSON.stringify(customerRemarkObj),
					//用户预订备注（CY28025）eg：豪华大包房  朋友预订
					'wxFormID': e.detail.formId
				};
				dataObj.orderInfoRemark = JSON.stringify(mulDinner);//时间+餐别+日期
			} else if (this.types == 2) {
				if (!this.selView[5].data) {
					this.showToastCancel('cancel', '请输入姓名');
					return;
				};
				if (selView[1].data.split('桌备')[0] == 0) {
					this.showToastCancel('cancel', '请输入桌数');
					return;
				}
				dataObj = {
					'userId': getApp().globalData.LoginUserId,
					'customerName': selView[5].data,
					'phone': selView[6].data,
					'bookDate': selView[2].data,
					'diningTypeId': selView[3].data,
					'bookTime': selView[4].data,
					'company': selView[7].data ? selView[7].data : '',
					// "bookTableNumber": selView[1].data.split('桌备')[0],
					'bookTableNumber': parseInt(selView[1].data.split('桌备')[0]) + parseInt(selView[1].data.split('桌备')[1].split('桌')[
						0]),
					'saleId': this.saleId,
					'storeID': this.nowshopid,
					'bookTypeId': selView[0].data,
					// 'customerRemark': JSON.stringify(customerRemarkObj),
					'shareBookRemark':selView[0].text,//宴会类型
					'customerRemark': selView[0].text + '  ' + selView[1].data,
					//用户预订备注（CY28025）eg：10桌备两桌
					// 'remark': selView[8].data,
					'remark': selView[8].data,
					//用户备注   eg：不要辣，或者自行输入
					'wxFormID': e.detail.formId
				};
			}

			if (!this.$util.validatemobile(dataObj.phone)) {
				this.showToastCancel('cancel', '手机号码有误');
				return;
			} //预订时间不能小于今天


			let nowBookTime = dataObj.bookDate + " " + dataObj.bookTime;

			if (nowBookTime <= this.$util.formatTime()) {
				let text = '您的预订时间为' + nowBookTime + '需大于当前时间'
				this.showToastCancel('none', text);
				return;
			}

			let data = dataObj;
			let returnData=await CY20AppService.Create(data);
			if (returnData) {
				this.showToastCancel('success', '商家确认中...', () => {
					this.setData({
						isSub: true
					});
					setTimeout(() => {
						uni.switchTab({
							url: '/pages/myOrder/myOrder'
						});
					}, 2000)

				});
			}
		},
		//根据门店id获取基本类型数据
		async getBookTag() {
			let self = this;
			let data = {
				tagType: 2,
				//要获取的标签类型（1.取消订单 2.预订快速备注 3.消费类型）
				shopId: this.nowshopid
			};
			let returnData=await GK09AppService.GetTagAsync(data);
				this.tagList= returnData;
		},
		//选择快速预订标签
		selBookTag(e) {
			let self = this;
			let tagID = e.target.dataset.tagid;
			let tagList = self.tagList;
			let remark = self.selectInputText; //输入的备注]
			let tempReamrkList = remark.split(','); //将选中的item拼接至remark（输入+选中）
			tagList.forEach(item=>{
				if(item.tagID==tagID){
					item.isSel=!item.isSel;
				}
				if(item.isSel){
					let hasTagContent = false; //改备注是否已经存在文本框中
					tempReamrkList.forEach(x=>{
						if(item.tagContent==x){hasTagContent = true;}
					})
					remark=hasTagContent?'':remark?remark += "," + item.tagContent:remark += item.tagContent;
				
				}
			})
			self.setData({
				tagList: tagList
			});
			this.selViewFun(self.selView.length - 1, remark, remark);
			this.setData({
				selView: self.selView
			});
		},
		// //添加快速标签的按钮
		// addTab() {
		// 	this.setData({
		// 		showModal: true
		// 	});
		// 	// this.$refs.tipPopup.open();
		// },
		// //关闭快速标签的弹框
		// closeBtn() {
		// 	this.setData({
		// 		showModal: false
		// 	});
		// 	// this.$refs.tipPopup.close();
		// },
		//取消快速标签
		cancel() {
			let selViewData = this.selView;
			let tagListData = [];
			let tagList1;
			selViewData[selViewData.length - 1].data = '';
			for (let i = 0; i < this.tagList.length; i++) {
				let isSel = this.tagList[i].isSel;
				if (isSel == true) {
					this.tagList[i].isSel = false;
				}
			}

			tagList1 = this.tagList;
			// this.$refs.tipPopup.close();
			this.setData({
				showModal: false,
				selView: this.selView,
				isSel: 0,
				tagList: tagList1
			});
		},
		//确认快速标签
		confirm() {
			let selViewData = this.selView;

			if (selViewData[selViewData.length - 1].data == '') {
				uni.showModal({
					content: '请选择您的快捷备注',
					showCancel: false,
					success: res => {
						if (res.confirm) {
							return;
						}
					}
				});
				return;
			}
			// this.$refs.tipPopup.close();
			this.setData({
				showModal: false
			});
		},
		// 拨打电话
		callPhone() {
			let selView = this.selView;
			let phone = selView[selView.length - 3].data;
			uni.makePhoneCall({
				phoneNumber: phone
			});
		},
		showToastCancel(types, text, suc) {
			types = types || 'cancel';
			text = text || '验证码错误!';
			let image;
			if (types == 'cancel') {
				image = '/static/toast/cancel.png';
			} else if (types == 'success') {
				image = '/static/toast/success.png';
			} else if (types == 'none') {
				image = '';
			}
			uni.showToast({
				image: image,
				icon: 'none',
				duration: 2000,
				color: '#fff',
				title: text,
				mask: true,
				success: () => {
					suc && suc();
				}
			});
		},
		setData(obj) {
			let that = this;
			let keys = [];
			let val, data;
			Object.keys(obj).forEach(key => {
				keys = key.split('.');
				val = obj[key];
				data = that.$data;
				keys.forEach((key2, index) => {
					if (index + 1 == keys.length) {
						that.$set(data, key2, val);
					} else {
						if (!data[key2]) {
							that.$set(data, key2, {});
						}
					}
					data = data[key2];
				});
			});
		}
	}
};
