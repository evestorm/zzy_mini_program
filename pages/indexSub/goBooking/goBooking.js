// pages/indexSub/goBooking/goBooking.js
import CY17 from "@/service/CY/CY17AppService.js";
import GZH09AppService from "@/service/GZH/GZH09AppService.js";
import GZH10AppService from "@/service/GZH/GZH10AppService.js";
import CY20AppService from "@/service/CY/CY20AppService.js";
import GK18AppService from "@/service/GK/GK18AppService.js";

export default {
	data() {
		return {
			webUrl: getApp().globalData.PicDomain,
			urlOption: {},
			currentView: 0,
			currentView1: 0,
			currentView2: 0,
			// currentView3: [],
			// currentView4: [],
			currentView5: 0,
			currentView11: 0,
			currentView112: 0,
			currentView14: 0,
			currentView15: 0,
			scrollTop: 0,
			scrollLeft: 0,
			//tab标题的滚动条位置
			isShow: false,
			showModal: false,
			showModal1: false,
			isLoadEnd: false,
			//是否加载已完成
			// headImg: '', // 门店图片
			// desknum:0,//桌数
			isChecked: 0,
			//默认选中桌数0桌
			// extraDesknum:0,//备桌数
			isChecked1: 0,
			//默认选中备桌数0桌
			tableNumLen: 3,
			//桌数的最大输入长度
			readyTableNumLen: 2,
			//备桌数的最大输入长度
			tabArr: {
				currentTab: 0,
				currentContent: 0
			},
			date: this.$util.getDateStr('', 7, 1),
			date1: this.$util.getDateStr('', '', 1),
			index: 0,
			curSelect: true,
			curSelOne: false,
			list: [{
				id: 0,
				text: "豪华包房",
				data: 1
			}, {
				id: 1,
				text: "商务包房",
				data: 2
			}, {
				id: 2,
				text: "普通包房",
				data: 3
			}],
			list1: [{
				id: 0,
				text: "生日派对",
				data: 1
			}, {
				id: 1,
				text: "商务宴请",
				data: 2
			}, {
				id: 2,
				text: "朋友聚会",
				data: 3
			}, {
				id: 3,
				text: "家庭聚会",
				data: 4
			}],
			list2: [{
				id: 0,
				data: 4,
				text: "2~4"
			}, {
				id: 1,
				data: 8,
				text: "4~8"
			}, {
				id: 2,
				data: 12,
				text: "8~12"
			}, {
				id: 3,
				data: 16,
				text: "12~16"
			}, {
				id: 4,
				data: 20,
				text: "16~20"
			}, {
				id: 5,
				data: 24,
				text: "20~24"
			}, {
				id: 6,
				data: 30,
				text: "24~30"
			}],
			list3: [],
			// list4: [],
			// list5: [],
			list14: [],
			list15: [],
			////////////////////////////
			userInfo: {},
			//登录用户
			selView: [],
			//订包房选中类型
			selView1: [],
			//订宴会选中类型
			nowshopid: "",
			//预订的门店
			bookTypeList: [],
			//预订类型
			bookTypeList1: [],
			//常用预订类型
			bookTypeList2: [],
			//其他预订类型
			canbieList: [],
			//餐别
			selCanbieTime: 0,
			//选择餐别时间段索引(订包房)
			selCanbieTime1: 0,
			//选择餐别时间段索引(订宴会)
			marketer: {},
			//专属的客服经理
			tableNumDesc: "",
			//eg：10桌备2桌
			tableNumDesc1: "",
			//eg：10桌备2桌(存桌数)
			tableNumDesc2: "",
			//eg：10桌备2桌(存备桌数)
			currentShopInfo: '',
			// 当前门店信息
			// salesInfoToId: "", //从客服经理页面进来的id\
			toView: '', //滑动定位页面元素的id
			salesInfoToId: "",
			srollHeight: "",
			dateValue: "",
			currentTab: "",
			list4: "",
			list5: ""
		};
	},
	async onLoad(option) {
		getApp().globalData.curUrl = {
			// path: '/pages/indexSub/goBooking/goBooking',
			path: this.$util.getCurrentPageUrl(),
			query: option
		};
		let res = await getApp().globalData.verifyAu(); // 验证权限获取用户信息
		this.urlOption = option
		this.currentShopInfo = option.shopInfo ? JSON.parse(option.shopInfo) : '';
		this.nowshopid = option.storeID || option.id;
		this.userInfo = getApp().globalData.userInfo;
		let self = this; //得到当前门店id 
		this.getShopInfo();
		//得到当前用户信息
		this.getBasicType(); //有客服经理id的两种情况（1.从客服经理详情页面进来   2.扫描客服经理二维码从门店进来的）
		//迭代第一版   只有销售页面分享进来的才有头像和CY28的销售id

		if (getApp().globalData.shaleSaleId) {
			//通过传入id得到客服经理详情
			self.getSalesDetails(getApp().globalData.shaleSaleId);
			this.salesInfoToId = getApp().globalData.shaleSaleId;
		} else {
			//通过门店和用户得到默认的客服经理
			self.getSelfSaler();
		}
	},
	onReady() {
		this.isLoadEnd = true;
	},
	async onShow() {
		let [error, res] = await uni.getSystemInfo();
		this.srollHeight = res.windowHeight;
	},
	methods: {
		// 记录分享进入的日志
		updateShareInfo(description) {
			getApp().globalData.getShareInfo({
				query: this.urlOption,
				curOpenid: getApp().globalData.userInfo.spOpenId,
				path: `/pages/indexSub/goBooking/goBooking`,
				title: '立即预定',
				description: `立即预定-${description}`
			});
		},

		// 获取门店主图
		async getShopImg() {
			let data = {
				pageIndex: 1,
				pageSize: 1,
				order: 'StorePicID desc',
				filter: {
					Type: 'and',
					Conditions: [{
						Attribute: 'StoreID',
						Datatype: 'nvarchar',
						Operatoer: 'eq',
						Value: this.nowshopid
					}, {
						Attribute: 'IsMain',
						Datatype: 'int',
						Operatoer: 'eq',
						Value: '1'
					}]
				}
			};
			let rdata = await GZH10AppService.GetViewPage(data);
			this.marketer.imgUrl = getApp().globalData.PicDomain + rdata.dataList[0].imgUrl
		},
		//选择日期将值存储
		selectDate(e) {
			this.dateValue = e.detail.value;
		},
		//滑动切换
		swiperTab(e) {
			this.currentTab = e.detail.current;
		},
		//点击切换
		clickTab(e) {
			let dataId = e.currentTarget.dataset.current;
			let obj = {};
			obj.currentTab = dataId;
			obj.currentContent = dataId;
			this.tabArr = obj;
		},
		//保存选择（选择种类，文本）
		selViewFun(num, txt, dat, selected) {
			this.selView[num].id = num; // if (num == 3 || num == 4) {
			//   if (selected) {
			//     let index1 = this.data.selView[num].text.indexOf(txt);
			//     let index2 = this.data.selView[num].data.indexOf(dat);
			//     this.data.selView[num].text.splice(index1, 1);
			//     this.data.selView[num].data.splice(index2, 1);
			//   } else {
			//     this.data.selView[num].text.push(txt);
			//     this.data.selView[num].data.push(dat);
			//   };
			// } else if (num == 5) {
			//   this.data.selView[num].text = [];
			//   this.data.selView[num].data = [];
			//   for (let i = 0; i < txt.length; i++) {
			//     this.data.selView[num].text.push(txt[i].text);
			//     this.data.selView[num].data.push(txt[i].data);
			//   };
			// } else {
			//   this.data.selView[num].text = txt;
			//   this.data.selView[num].data = dat;
			// };

			this.selView[num].text = txt;
			this.selView[num].data = dat;
			this.setData({
				selView: this.selView
			});
		},
		//订包房选择事件
		clickView(e) {
			let id = e.currentTarget.dataset.index;
			this.currentView = id;
			this.toView = "room" + id;
			this.selViewFun(0, e.currentTarget.dataset.txt, id + 1);
		},
		clickView1(e) {
			let id = e.currentTarget.dataset.index;
			this.currentView1 = id;
			this.toView = "move" + id;
			this.selViewFun(1, e.currentTarget.dataset.txt, id + 1);
		},
		clickView2: function(e) {
			let id = e.currentTarget.dataset.index;
			this.currentView2 = id;
			this.toView = "peoperNum" + id;
			this.selViewFun(2, e.currentTarget.dataset.txt + '人', this.list2[id].data);
		},
		getBir(e) { //包房选择更多日期
			let isAdd = true;
			this.list3.forEach(item => { //新选日期是否与之前重复
				isAdd = e.target.value == item.data ? false : true;
			})
			if (isAdd) {
				let data = {
					data: e.target.value,
					diningType: JSON.parse(JSON.stringify(this.list4)),
					id: this.list3.length,
					selected: true,
					text: this.$util.getDateStr(e.target.value)
				}
				this.list3.push(data);
				let id = this.list3.length - 1;
				let selected = false; //this.list3[id - 1].selected;
				let initIndex;
				this.list3.forEach((item, index) => {
					if (item.selected) initIndex = index;
				})
				let array = [id, initIndex];
				this.setData({
					list3: this.list3,
					toView: "date" + this.list3.length,
					curSelect: array[Number(selected)] === 0 || array[Number(selected)] ? array[Number(selected)] : false
				})
			}
		},
		//选择日期
		clickView3: function(e) { //点击日期
			let id = e.currentTarget.dataset.index;
			let selected = e.currentTarget.dataset.selected;
			let list3 = this.list3;
			let initIndex;
			list3.forEach((item, index) => {
				index == id && (item.selected = !selected);
				item.selected && (initIndex = index);
			});
			let array = [id, initIndex];
			this.setData({
				// currentView3: this.data.currentView3,
				toView: "date" + id,
				list3: list3,
				curSelect: array[Number(selected)] === 0 || array[Number(selected)] ? array[Number(selected)] : false
			});
		},
		//选择更多
		bindDateChange(e) { //宴会选择日期
			let text = e.detail.value;
			let isBelong = false;
			this.list3.forEach(item => {
				isBelong = text == item.data ? true : false;
			});

			if (!isBelong) {
				let diningType = JSON.parse(JSON.stringify(this.list3[0].diningType));
				diningType.forEach((item, index) => {
					item.selected = !Boolean(index);
				});
				this.list3.push({
					id: this.list3.length,
					selected: true,
					text: text.substring(5).split('-').join('.'),
					data: text,
					diningType: diningType
				});
				this.setData({
					// currentView3: this.data.currentView3,
					toView: "date" + this.list3.length - 1,
					list3: this.list3
				});
			} // this.setData({
			//     currentView3: 999
			// })
			// this.selView(3, e.detail.value, e.detail.value);

		},
		clickView4(e) { //点击餐别中餐、晚餐
			let id = e.currentTarget.dataset.index;
			let selected = e.currentTarget.dataset.selected;
			let diningType = this.list3[this.curSelect].diningType;
			let initIndex;
			diningType.forEach((item, index) => {
				index == id && (item.selected = !selected);
				item.selected && (initIndex = index)
			});
			let array = [id, initIndex];
			this.setData({
				list3: this.list3,
				curSelOne: array[Number(selected)] === 0 || array[Number(selected)] ? array[Number(selected)] : false
			});
			//   let index = this.data.currentView4.indexOf(id);
			//   this.data.currentView4.splice(index, 1);
			// } else {
			//   this.data.currentView4.push(id);
			// }
			// this.setData({
			//   currentView4: this.data.currentView4,
			//   toView: "food" + id
			// });
			// console.log(this.data.currentView4)
			// this.selView(4, e.currentTarget.dataset.txt, this.data.list4[id].data, selected);
			//改变餐别同时改变餐别时间
			// let list4 = this.data.list4;
			// let tempCanbiesTimes = [];
			// for (let i = 0; i < list4.length; i++) {
			//   if (list4[i].selected) {
			//     tempCanbiesTimes.push({
			//       id: i,
			//       text: list4[i].time[0],
			//       data: list4[i].time[0],
			//     });
			//   } 
			// };
			// this.setData({
			//     list5: tempCanbiesTimes
			// });
			//修改餐别的同时修改餐别时间段
			// this.selView(5, tempCanbiesTimes);
		},
		// clickView5: function (e) {
		//     let id = e.currentTarget.dataset.index
		//     this.setData({
		//         currentView5: id,
		//         selCanbieTime: id,
		//       toView: "time" + id
		//     })
		//     this.selView(5, e.currentTarget.dataset.txt, this.data.list5[id].data);
		// },
		//根据门店id和用户id获取专属的门店客服经理
		async getSelfSaler() {
			let marketer = this.marketer;
			let data = {
				shopId: this.nowshopid,
				userId: getApp().globalData.LoginUserId
			};
			let returnData = await CY20AppService.GetSaler(data);
			if (returnData) {
				let marketers = {
					"marketerID": returnData.marketerID,
					"name": returnData.name,
					"imgUrl": returnData.imgUrl,
					"phone": returnData.phone,
					"desc": returnData.desc,
					"company": returnData.company,
					"hasSaler": true
				};
				this.marketer = marketers;
			}
		},
		//根据门店id获取基本类型数据
		async getBasicType() {
			let data = {
				shopId: this.nowshopid
			};
			let returnData = await GZH09AppService.GetBasicsStoreDataAsync(data) //, rdata => {
			this.curSelect = 0;
			this.curSelOne = 0;
			let bookTypeList1 = this.bookTypeList1; //不常用预订类型
			let bookTypeList2 = this.bookTypeList2;
			let bookTypes1 = [];
			let bookTypes2 = [];
			let j = 0,
				k = 0;
			returnData.bookTypes.forEach(item => {
				if (item.isCommonFeast == 1) {
					bookTypes1.push({
						"id": j,
						"data": item.id,
						"text": item.name,
						"isCommonFeast": item.isCommonFeast
					});
					j++;
				} else {
					bookTypes2.push({
						"id": k,
						"data": item.id,
						"text": item.name,
						"isCommonFeast": item.isCommonFeast
					});
					k++;
				}
			})
			bookTypes1.push({
				"id": bookTypes1.length,
				"text": "其他宴会",
				"isCommonFeast": 1
			}); //餐别

			let canbies = [];
			returnData.canbies.forEach((item, index) => {
				canbies.push({
					id: index,
					data: item.canbieId.trim(),
					text: item.canbieName,
					time: item.canbieTimes,
					selected: index == 0 ? true : false,
				});
			}) //拼接餐别时间段

			let tempCanbiesTimes = [];
			canbies[0].time.forEach((item, index) => {
				tempCanbiesTimes.push({
					id: index,
					text: item,
					data: item
				});
			}) //根据当前时间赋值日期list

			let list3 = [];
			let date = ['今天', '明天'];

			for (let i = 0; i <= 6; i++) {
				let text;
				text = (i == 0 || i == 1) ? date[i] : this.$util.getDateStr('', i);
				list3.push({
					id: i,
					data: this.$util.getDateStr('', i == 0 ? '' : i, 1),
					text: text,
					diningType: JSON.parse(JSON.stringify(canbies)),
					selected: i == 0 ? true : false
				});

			};
			//判断当前时间是否早于今天餐别时间是选择第一个 否 选择第二天
			let selTime = -1,
				nowTime = new Date(),
				month = nowTime.getMonth() + 1;
			let nowYear = nowTime.getFullYear() + '/' + month + '/' + nowTime.getDate();
			for (let i = 0; i < list3[0].diningType.length; i++) {
				let time1 = `${nowYear} ${list3[0].diningType[i].time[0]}:00`;
				if (selTime == -1) {
					if (Date.parse(nowTime) < Date.parse(time1)) {
						list3[0].diningType[i].selected = true;
						selTime = i;
					} else {
						list3[0].diningType[i].selected = false;
					}
				}
			}
			if (selTime == -1) {
				list3[0].selected = false;
				list3[1].selected = true;
			}
			this.userInfo = getApp().globalData.userInfo;
			this.list3 = list3;
			this.list4 = canbies;
			this.list5 = tempCanbiesTimes;

			this.selView = [ //订包房
				{
					id: 0,
					text: this.list[0].text,
					data: this.list[0].data
				}, {
					id: 0,
					text: this.list1[0].text,
					data: this.list1[0].data
				}, {
					id: 0,
					text: this.list2[0].text + '人',
					data: this.list2[0].data
				}
			];
			this.selView1 = [ //订宴会
				{
					id: 0,
					text: bookTypes1[0].text,
					data: bookTypes1[0].data
				}, {
					id: 0,
					text: "未预定桌数",
					data: ""
				}, {
					id: 0,
					text: this.$util.getDateStr('', '', 1),
					data: this.$util.getDateStr('', '', 1)
				}, {
					id: 0,
					text: canbies[0].text,
					data: canbies[0].data
				}, {
					id: 0,
					text: tempCanbiesTimes[0].text,
					data: tempCanbiesTimes[0].data
				}
			];
			this.list14 = canbies;
			this.list15 = tempCanbiesTimes;
			this.bookTypeList1 = bookTypes1;
			this.bookTypeList2 = bookTypes2;
		},
		//切换宴会类型
		clickView11(e) {
			let id = e.currentTarget.dataset.index;
			this.currentView11 = id

			if (e.currentTarget.dataset.index == this.bookTypeList1.length - 1) {
				this.isShow = true;
				this.selView1Fun(0, this.bookTypeList2[0].text, this.bookTypeList2[0].data);
			} else {
				this.isShow = false;
				this.selView1Fun(0, this.bookTypeList1[id].text, this.bookTypeList1[id].data);
			}
		},
		//其他宴会
		clickView112(e) {
			let id = e.currentTarget.dataset.index;
			this.currentView112 = id;
			this.selView1Fun(0, this.bookTypeList2[id].text, this.bookTypeList2[id].data);
		},
		//保存选择（选择种类，文本）
		selView1Fun(num, txt, dat) {
			this.selView1[num].id = num;
			this.selView1[num].text = txt;
			this.selView1[num].data = dat;
			this.setData({
				selView1: this.selView1
			});
		},
		bindDateChange1(e) {
			this.date1 = e.detail.value;
			this.selView1Fun(2, e.detail.value, e.detail.value);
		},
		clickView14(e) {
			let id = e.currentTarget.dataset.index;
			this.currentView14 = id;
			this.selView1Fun(3, e.currentTarget.dataset.txt, this.list14[id].data); //改变餐别同时改变餐别时间
			let list14 = this.list14;
			let tempCanbiesTimes = [];
			list14[id].time.forEach((item, index) => {
				tempCanbiesTimes.push({
					id: index,
					text: item,
					data: item
				});
			})
			this.list15 = tempCanbiesTimes; //修改餐别的同时修改餐别时间段
			this.selView1Fun(4, tempCanbiesTimes[this.selCanbieTime1].text, tempCanbiesTimes[this.selCanbieTime1].text);
		},
		clickView15(e) {
			let id = e.currentTarget.dataset.index;
			this.currentView15 = id;
			this.selCanbieTime1 = id;
			this.selView1Fun(4, e.currentTarget.dataset.txt, this.list15[id].data);
		},
		selectTableNumber() {
			this.showModal1 = true
		},
		//桌数取消事件
		cancel() {
			this.showModal1 = false;
			this.tableNumDesc2 = 0;
			//初始备桌数为0
			this.isChecked1 = 0;
			//初始备桌数样式
			this.tableNumDesc1 = 0;
			//初始桌数为0
			this.isChecked = 0;
			//初始桌数样式
			// tableNumDesc: "",
			this.tableNumDesc1 = "";
			this.tableNumDesc2 = "";
		},
		//桌数确定事件
		confirm() {
			this.tableNumDesc = this.tableNumDesc1 + "桌备" + this.tableNumDesc2 + "桌";
			this.selView1Fun(1, this.tableNumDesc, this.tableNumDesc);
			this.showModal1 = false;
			this.showModal = true;
			this.tableNumDesc2 = 0;
			//初始备桌数为0
			// tableNumDesc1: 0, //初始桌数为0
			this.isChecked1 = 0;
			//初始备桌数样式
			this.isChecked = 0; //初始桌数样式

		},
		//备桌数取消事件
		cancel1() {
			this.showModal = false;
			this.tableNumDesc2 = 0;
			//初始备桌数为0
			this.isChecked1 = 0;
			//初始备桌数样式
			this.tableNumDesc1 = 0;
			//初始桌数为0
			this.isChecked = 0;
			//初始桌数样式
			// tableNumDesc: "",
			this.tableNumDesc1 = "";
			this.tableNumDesc2 = "";
		},
		//备桌确定事件
		confirm1: function() {
			this.tableNumDesc = this.tableNumDesc1 + "桌备" + parseInt(this.tableNumDesc2) + "桌";
			this.selView1Fun(1, this.tableNumDesc, this.tableNumDesc);
			this.showModal = false;
			this.tableNumDesc2 = 0;
			//初始备桌数为0
			this.isChecked1 = 0;
			//初始备桌数样式
			this.tableNumDesc1 = 0;
			//初始桌数为0
			this.isChecked = 0; //初始桌数样式

		},
		//输入桌数
		tableNum: function(e) {
			// this.data.tableNumDesc1 = parseInt(e.detail.value);
			let tableNum = e.detail.value;
			let tableNumLen = parseInt(tableNum.length);

			if (tableNumLen < this.tableNumLen) {
				this.tableNumDesc1 = parseInt(e.detail.value);
			} else {
				uni.showModal({
					content: '超出桌数限制',
					showCancel: false,
					success: function(res) {
						if (res.confirm) {
							return;
						}
					}
				});
			}
		},
		//输入备桌数
		readyTableNum: function(e) {
			let readyTableNum = e.detail.value;
			let readyTableNumLen = parseInt(readyTableNum.length);

			if (readyTableNumLen < this.readyTableNumLen) {
				this.tableNumDesc2 = parseInt(e.detail.value)
			} else {
				uni.showModal({
					content: '超出备桌数限制',
					showCancel: false,
					success: function(res) {
						if (res.confirm) {
							return;
						}
					}
				});
			}
		},
		//选择桌数
		selectDesknum: function(e) {
			let index = e.currentTarget.dataset.index;
			let deskNum = this.tableNumDesc1 + index;
			deskNum = deskNum.substr(0, deskNum.length - 1);

			if (deskNum.length < 3) {
				this.isChecked = index;
				//选中的样式
				this.tableNumDesc1 = parseInt(this.tableNumDesc1 + index); //选中的备桌数
			} else {
				uni.showModal({
					title: '超出桌数限制',
					showCancel: false,
					success: function(res) {
						if (res.confirm) {
							return;
						}
					}
				});
			}
		},
		//选择备桌数
		selectExtraDesknum: function(e) {
			let inx = e.currentTarget.dataset.inx;
			let extraDesNum = this.tableNumDesc2 + inx;
			extraDesNum = extraDesNum.substr(0, extraDesNum.length - 1);

			if (extraDesNum.length < 2) {
				this.isChecked1 = inx;
				//选中的样式
				this.tableNumDesc2 = parseInt(this.tableNumDesc2 + inx); //选中的备桌数
			} else {
				uni.showModal({
					title: '超出备桌数限制',
					showCancel: false,
					success: function(res) {
						if (res.confirm) {
							return;
						}
					}
				});
			}
		},
		goBack() {
			this.showModal1 = true;
			this.showModal = false;
		},
		//去预订详情(定包房)
		nowBook(e) {
			let listCopy = JSON.parse(JSON.stringify(this.list3));
			listCopy = listCopy.filter(item => {
				let boolean = item.diningType.some(innerItem => innerItem.selected);
				if (boolean) {
					item.diningType = item.diningType.filter(dinItem => dinItem.selected);
				};
				return item.selected && boolean;
			});
			this.selView[3] = listCopy;
			uni.setStorageSync('booking_data', this.selView);
			let saleId = "";
			let company = ""; //只有从客服经理页面进来的才会将销售id存入cy28（客服经理为空时，商户平台默认为登录人），CY19取出来的不算

			if (getApp().globalData.shaleSaleId) {
				saleId = getApp().globalData.shaleSaleId == getApp().globalData.shaleSaleId;
				getApp().globalData.shaleSaleId = "";
				company = this.marketer.company ? this.marketer.company : '';
			} else {
				saleId = this.marketer.marketerID;
				company = this.marketer.company ? this.marketer.company : '';
			}

			const url =
				`/pages/indexSub/bookingEdit/bookingEdit?id=${this.nowshopid}&company=${company}&saleId=${saleId}&types=1`;
			uni.navigateTo({
				url,
			});
		},
		//去预订详情（订宴会）
		nowBook1(e) {
			let self = this;

			uni.setStorageSync('booking_data1', this.selView1);
			let saleId = "";
			let company = "";

			if (getApp().globalData.shaleSaleId) {
				saleId = getApp().globalData.shaleSaleId;
				getApp().globalData.shaleSaleId = "";
				company = this.marketer.company ? this.marketer.company : '';
			} else {
				saleId = this.marketer.marketerID;
				company = this.marketer.company ? this.marketer.company : '';
			}
			const url =
				`/pages/indexSub/bookingEdit/bookingEdit?id=${this.nowshopid}&company=${company}&saleId=${saleId}&types=2`;
			uni.navigateTo({
				url,
			});
		},
		callPhone(e) {
			let phone = this.marketer.phone;
			uni.makePhoneCall({
				phoneNumber: phone
			});
		},
		//跳转到客服经理详情
		// goSalesManagerInfo: function() {
		// 	let that = this;
		// 	uni.navigateTo({
		// 		url: `/pages/common/salesManagerInfo/salesManagerInfo?salesID=${that.marketer.marketerID}&shopID=${that.nowshopid}`
		// 	});
		// },

		//获取客服经理详情
		async getSalesDetails(id) {
			let data = {
				pageIndex: 1,
				pageSize: 1,
				order: 'Name desc',
				filter: {
					Type: 'and',
					Conditions: [{
						Attribute: 'MarketerID',
						Datatype: 'varchar',
						Operatoer: 'eq',
						Value: id
					}]
				}
			};
			let rdata = await CY17.GetViewPage(data);
			let returnData = rdata.dataList[0];
			let marketers = {
				marketerID: id,
				imgUrl: returnData.imgUrl ? returnData.imgUrl_picServer : '',
				name: returnData.name ? returnData.name : '',
				phone: returnData.phone ? returnData.phone : '',
				desc: returnData.desc ? returnData.desc : '暂无简介',
				hasSaler: true
			};

			if (!marketers.imgUrl) {
				this.getShopImg();
			}

			this.marketer = marketers;

		},

		async getShopInfo() {
			let data = {
				pageIndex: 1,
				pageSize: 1,
				order: 'StoreID desc',
				filter: {
					Type: 'and',
					Conditions: [{
						Attribute: 'StoreID',
						Datatype: 'nvarchar',
						Operatoer: 'eq',
						Value: this.nowshopid
					}]
				}
			};
			let rdata = await GZH09AppService.GetViewPage(data);
			this.updateShareInfo(`${rdata.dataList[0].businessName}(${rdata.dataList[0].branchName})`);
			let currentShopInfo = rdata.dataList[0];
			currentShopInfo.storeName = currentShopInfo.businessName + '(' + currentShopInfo.branchName + ')';
			currentShopInfo.storeLogo = getApp().globalData.PicDomain + currentShopInfo.imgUrl;
			this.currentShopInfo = currentShopInfo

		},
		// goShop: function() {
		// 	let that = this;
		// 	uni.navigateTo({
		// 		url: '/pages/indexSub/shopInfo/shopInfo?id=' + that.nowshopid
		// 	});
		// },
		setData: function(obj) {
			let that = this;
			let keys = [];
			let val, data;
			Object.keys(obj).forEach(function(key) {
				keys = key.split('.');
				val = obj[key];
				data = that.$data;
				keys.forEach(function(key2, index) {
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
