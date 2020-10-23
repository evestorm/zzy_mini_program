// 网络请求
import YHBanquetOrder from '@/service/YH/YHBanquetOrderAppService.js';
import YHBanquetProject from '@/service/YH/YHBanquetProjectAppService.js';
import YHBanquetTask from '@/service/YH/YHBanquetTaskAppService.js';

import App from '@/App.vue';

const banquetInfoArr = [{
		id: 'banquetRelevant',
		name: '宴会相关'
	},
	{
		id: 'accountProfile',
		name: '客户档案'
	},
	{
		id: 'serviceProject',
		name: '服务项目'
	},
	{
		id: 'banquetExec',
		name: '宴会执行',
	}
];

export default {
	data() {
		return {
			// --------------------- data查看权限 ------------------
			isCanSee: false, // 默认不允许查看
			userInfo: {}, // 用户信息
			// --------------------- data网络请求 ------------------
			banquetExecQuery: {
				banquetOrderGUID: '', // 宴会订单id
				banquetExectorDisplayType: 2, // 宴会执行方式(1:项目,2:时间)
				exectorId: '', // 执行人id
				isExecuted: '', // 任务执行(未完成:0, 已完成1, 全部:空)
				isSmallProgram: 1, // 是否为小程序访问
			},
			projectArr: [], // 宴会按项目排序数据
			timeArr: [], // 宴会按时间排序数据

			banquetDetailData: {
				// 客户基本信息
				banquetOrderName: '', // 订单名称
				banquetDate: '', // 宴会执行日期
				banquetImgUrl: '', // 宴会图片
				orderCstName: '', // 客户姓名
				orderCstPhone: '', // 客户电话
				orderCstCompany: '', // 客户单位
				headImg: '', // 客户头像
				// 宴会相关
				banquetThemeTypeName: '', // 宴会类型名称
				themeConfName: '', // 宴会主题配置名称
				bOrderOfExecutorViewDtos: [], // 执行人集合
				banquetOrderRemark: '', // 宴会单备注(也是订单备注)
				clueRemark: '', // 线索备注

				// 预订单信息
				bookOrderBookOrderID: null, // 预定订单主键ID
				bookOn: '', // 预定日期
				bookOrderTypeName: '', // 宴会类型名称
				diningTypeName: '', // 餐别名称
				bookTableNum: 0, // 预定桌数
				frontMoney: 0.0, // 定金
				areaName: '', // 区域名称
				bOrderOfRecordViewDtos: '', // 档案信息集合[]

				// 宴会套餐
				banquetPackageName: '', // 宴会套餐名称
				packageTableCount: 0, // 桌数
				packagePrice: 0.0, // 套餐价格
				packageRemark: '', // 套餐备注

				// 服务项目
				bOrderOfProjectCommentViewDtos: [], // 项目评价集合[]

				// 暂未用到
				customerID: '', // 客户id
				orderCstAddress: '', // 客户住址
				themeConfGUID: '', // 宴会主题GUID
				banquetThemeTypeID: '', // 宴会类型id

				orderSignDate: '', // 签单时间
				clueGUID: '', // 线索GUID(YH_Clue)

				coordinatorID: '', // 统筹人id
				coordinatorName: '', // 统筹人名称
				marketerName: '', // 销售经理名称
				marketerID: '', // 销售经理id

				banquetOrderState: '', // 宴会单状态(1,进行中;2,已完成;3,取消)

				banquetPackageGUID: '', // 套餐GUID(YH_BanquetPackage)
				banquetPackageName: '', // 宴会套餐名称
				packagePrice: 0.0, // 套餐价格
				packageRemark: '', // 套餐备注
				packageTableCount: 0, // 桌数
				packageSpareTableCount: 0, // 备用桌数
				yH_BanquetOrderBookOrderID: '', // 宴会单(门店)预订单ID(CY20001)

				executorUserID: '', // 执行人ID(CY17001)
				executorName: '', // 执行人名称
				executorImgUrl: '', // 执行人头像相对路径
				executorImgUrl_Server: '' // 执行人头像完整路径
			}, // 宴会单详情

			// -------------------- dataUI视图 --------------------
			banquetInfoArr: banquetInfoArr, // 宴会信息tab
			banquetInfoSelected: 0, // 宴会信息选中
			banquetInfoScrollLeft: 0, // 宴会信息tab的x轴偏移

			// ---------------- data吸顶功能 ---------------------
			selectorQuery: {}, // selectorQuery 对象
			actionWrapperHeight: 0, // tab高度
			actionWrapperBottom: 0, // tab底部距顶高度
		}
	},
	computed: {
		// 头像设置
		getImgUrl() {
			return function(url) {
				if (url != '' && url != null) {
					return 'url(' + encodeURI(url) + ')';
				} else {
					return 'url(https://pic.cwyyt.cn/upload/img/20200115/1725412541_salesperson.png)';
				}
			};
		},
		// 宴会类型+主题类型
		banquetTypeAndThemeType() {
			let tempArr = [];
			if (this.banquetDetailData.banquetThemeTypeName !== '') {
				tempArr.push(this.banquetDetailData.banquetThemeTypeName);
			}
			if (this.banquetDetailData.themeConfName !== '') {
				tempArr.push(this.banquetDetailData.themeConfName);
			}
			return tempArr.join(' + ');
		}
	},
	onLoad(payload) {
		// 进入宴会详情页,请传递 banquetId ,也就是宴会订单ID
		const {
			banquetId, // 宴会单id
			banquetInfoSelected, // 宴会信息下的tabIdx
		} = payload;
		this.banquetId = banquetId;

		// 如果有banquetInfoTabSelect,则默认选中 [宴会信息下对应的索引]
		if (banquetInfoSelected) {
			this.isActive = 1;
			this.banquetInfoSelected = banquetInfoSelected;
		}

		this.banquetExecQuery.banquetOrderGUID = this.banquetId;

		// 请求宴会订单详情数据
		this.getBanquetDetailData();
		this.getBanquetExec();
		this.canISee();
	},
	onShow() {
		this.canISee();
	},
	mounted() {
		this.initFixedTop();
	},
	methods: {
		// 当前用户是否有权限看此页面
		async canISee() {
			getApp().globalData.curUrl = {
				// path: '/pages/mechaSearch/shopSearch/shopSearch',
				path: this.$util.getCurrentPageUrl(),
				query: ''
			};
			let res = await getApp().globalData.verifyAu(); // 验证权限获取用户信息
			this.userInfo = getApp().globalData.userInfo;
			if (this.userInfo.phone) {
				let isCanData = {
					banquetOrderGUID: this.banquetId,
					phone: this.userInfo.phone
				}
				let result = await YHBanquetOrder.IsCanViewBanquetOrder(isCanData);
				this.isCanSee = result.isCanView == 1
				this.getBanquetDetailData();
				this.initFixedTop();
			}
		},
		// 去当前宴会门店
		gotoStore() {
			if (this.banquetDetailData.buUnitGUID) {
				uni.navigateTo({
					url: '/pages/indexSub/shopInfo/shopInfo?id=' + this.banquetDetailData.buUnitGUID
				})
			}
		},
		// backToHome() {
		// 	uni.switchTab({
		// 		url: '/pages/index/index'
		// 	});
		// },
		// ------------------- methodsNavbar事件 -----------------
		// 导航栏左侧按钮事件
		tapLeftFromNav() {
			uni.navigateBack({
				delta: 1
			});
		},
		// ------------------ methods客户基本信息 -----------------------
		// 右边按钮去预定(暂时废弃,说不定出啥幺蛾子)
		nowBook() {
			uni.navigateTo({
				url: '/pages/indexSub/goBooking/goBooking?id=' + this.banquetDetailData.buUnitGUID + '&salesID=' + this.marketerID
			});
		},

		// 取消订单提示框的左右按钮
		cancelOrder() {
			this.$refs.cancelPopup.close();
		},

		// ------------------ methods宴会相关 -----------------------
		// 营销页详情
		gotoMarketingPage(typeName) {
			let marketSetID = '';
			switch (typeName) {
				case 'theme': // 主题营销页
					marketSetID = this.banquetDetailData.themeMarketSeID;
					break;
				case 'combo': // 套餐营销页
					marketSetID = this.banquetDetailData.marketSeID;
					break;
				default:
					break;
			}

			uni.navigateTo({
				url: `/pages/outUrl/outUrl?marketSetID=${marketSetID}`
			});
		},

		// ------------------- methods宴会服务成员 ----------------------
		// 打电话给执行人或统筹人(废弃)
		gotoCallPhone(phone) {
			uni.makePhoneCall({
				phoneNumber: phone
			});
		},

		// ------------------- methods服务项目 -----------------
		// 立即评价
		gotoEvaluation(rate) {
			// 传项目id + 当前[客户档案的tab索引]
			let obj = {
				banquetProjectGUID: rate.id, // 项目id
				name: rate.projectConfName, // 项目名称
				type: this.banquetDetailData.banquetThemeTypeName, // 类型名称
				date: this.banquetDetailData.banquetDate.substring(0, 10), // 日期
				banquetOrderGUID: this.banquetId, // 宴会单ID
				banquetInfoSelected: this.banquetInfoSelected, // 当前tab索引
			}
			let params = this.$util.urlEncode(obj).substring(1);
			let url = `/pages/myOrderSub/estimate/estimate?${params}`;
			uni.navigateTo({
				url,
			});
		},

		// ---------------- methods宴会执行 ----------------------

		// 检查任务是否可关闭,如果关闭则刷新页面,否则跳转提醒页面 (好像没调用)
		async checkTheTaskCanBeClose(task) {
			// 没修改前的任务状态[1:已完成/0:未完成]
			let currentStatus = task.isExecuted;
			// 要修改成的任务状态
			let isExecuted = task.isExecuted == '1' ? '0' : '1';
			// 检查是否可关任务权限的同时提示任务还需要提交的内容
			let result = await YHBanquetTask.GetTaskCompleteTip({
				banquetTaskGUID: task.id,
				factExecutorID: storage.getAppUserInfo().marketerId,
			});
			// 有权限才会进success,否则走fail回调
			const {
				isUploadFile, // 是否需要上传文件
				isUploadImg, // 是否需要上传图片
				isRemark, // 是否备注
				isRelatedDate, // 是否关联日期
				isCstSign, // 是否客户签字
			} = result;
			const obj = result;

			if (currentStatus == '1') { // 如果之前是已完成,现在就走取消已完成的逻辑
				// 更新任务状态
				let updateData = {
					id: task.id,
					isExecuted: isExecuted,
					factExecutorID: storage.getAppUserInfo().marketerId,
				};
				let resp = await YHBanquetTask.UpdateByDto(updateData);
				if (resp) {
					this.getBanquetExec();
				}
			} else { // 否则是未完成转已完成的逻辑
				// 都填写过,直接发请求完成的命令
				if (isUploadFile && isUploadImg && isRemark && isRelatedDate && isCstSign) {
					// 更新任务状态
					let updateData = {
						id: task.id,
						isExecuted: isExecuted,
						factExecutorID: storage.getAppUserInfo().marketerId,
					};
					let resp = await YHBanquetTask.UpdateByDto(updateData);
					if (resp) {
						this.getBanquetExec();
					}
				} else {
					// 跳转任务提示
					let params = this.$util.urlEncode(obj).substring(1);
					let url = '/pages/banquet/taskTip/taskTip?taskId=' + task.id + '&' + params;
					uni.navigateTo({
						url,
					});
				}
			}
		},

		// ---------------------- methods网络请求 ---------------------
		// 异步请求宴会订单详情
		async getBanquetDetailData() {
			const data = {
				id: this.banquetId
			};
			let result = await YHBanquetOrder.GetViewDto(data) //, result => {
			if (result && result != null) {
				// 防止 线索备注,订单备注,客户档案数组,宴会套餐备注,宴会执行人数组,宴会主题,客户头像 为null
				result.clueRemark = this.$util.emptyToString(result.clueRemark);
				result.banquetOrderRemark = this.$util.emptyToString(
					result.banquetOrderRemark
				);
				result.bOrderOfRecordViewDtos =
					result.bOrderOfRecordViewDtos == null ? [] :
					result.bOrderOfRecordViewDtos;
				result.packageRemark = this.$util.emptyToString(result.packageRemark);
				result.bOrderOfProjectCommentViewDtos =
					result.bOrderOfProjectCommentViewDtos == null ? [] :
					result.bOrderOfProjectCommentViewDtos;
				result.bOrderOfExecutorViewDtos =
					result.bOrderOfExecutorViewDtos == null ? [] :
					result.bOrderOfExecutorViewDtos;
				result.headImg = this.$util.emptyToString(result.headImg);

				// 处理统筹人和客服经理都相同的情况:
				let arr = result.bOrderOfExecutorViewDtos.filter(v => v.isCoordinator && v.isMarketer);
				if (arr.length > 0) {
					result.bOrderOfExecutorViewDtos.splice(1, 0, this._.cloneDeep(arr[0]));
					result.bOrderOfExecutorViewDtos[0].isMarketer = 0;
					result.bOrderOfExecutorViewDtos[1].isCoordinator = 0;
				}

				result.themeConfName = this.$util.emptyToString(
					result.themeConfName
				);

				this.banquetDetailData = result;
			}
		},
		// 异步请求宴会执行
		async getBanquetExec() {
			const data = this.banquetExecQuery;
			data.banquetOrderGUID = this.banquetId;
			let result = await YHBanquetOrder.GetBanquetExectorDetail(data);
			// const result = GetBanquetExectorDetail; // mock的数据
			if (result) {
				const {
					bOrderOfProjectViewDtos,
					bOrderOfTimeViewDtos
				} = result;
				// 如果 banquetExectorDisplayType 为 1, 取项目,否则取时间
				if (this.banquetExecQuery.banquetExectorDisplayType == 1) {
					this.projectArr = bOrderOfProjectViewDtos;
				} else {
					this.timeArr = bOrderOfTimeViewDtos;
				}
			};
		},

		// ------------------- methodsUI视图 -------------------
		// 宴会信息顶部固定tab选择
		banquetInfoTabSelect(e) {
			this.banquetInfoSelected = e.currentTarget.dataset.id;
			this.banquetInfoScrollLeft = (this.banquetInfoSelected - 1) * 100;
		},
		// 滑动swiper改变[宴会信息顶部固定tab选择]
		changeBanquetInfoSelected(e) {
			const {
				current
			} = e.detail;
			this.banquetInfoSelected = current;
			this.banquetInfoScrollLeft = (this.banquetInfoSelected - 1) * 60;
		},

		// ----------------------- methods吸顶功能 -------------------
		// 初始化吸顶标题的工作
		initFixedTop() {
			// 获取 SelectorQuery 对象实例。可以在这个实例上使用 select 等方法选择节点
			uni.createSelectorQuery().in(this).select(".action-wrapper").boundingClientRect(data => {
				if (data) {
					this.actionWrapperHeight = data.height;

					uni.getSystemInfo({
						success: (res) => {
							this.actionWrapperBottom = res.screenHeight - data.bottom;
						}
					});
				}
			}).exec();
		}
	}
}
