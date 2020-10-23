import util from '@/common/util.js';
import CY20 from '@/service/CY/CY20AppService.js';
import CY35 from '@/service/CY/CY35AppService.js';
import GK01 from '@/service/GK/GK01AppService.js';

// 每次请求页码
const PAGESIZE = 10;

export default {
	// 注册属性
	props: {
		storeID: {
			type: String,
			default: null
		}, // 门店ID 用于过滤
	},
	data() {
		return {
			mescroll: null, //mescroll实例对象 (此行可删,mixins已默认)
			dataList: [], // 订单列表
			emptyEleShow: false, // 默认不显示空列表的元素

			nowWeb: 'shopSearch',
			inputShowed: false,
			inputVal: '', // 手机号输入的实时内容
			phone: '', // 请求时的手机号
			vcode: '', //获取的到手机验证码
			yzm: '获取验证码', //发送验证码提示语
			yzmInputDisabled: true, //发送验证码输入是否启用
			yzmDisabled: false, //发送验证码是否启用
			djs: 60, //倒计时
			showModal: false,


			// ---------------------- dataMescroll配置 ---------------------

			// 下拉刷新的常用配置
			downOption: {
				use: false, // 是否启用下拉刷新; 默认true
				auto: false, // 是否在初始化完毕之后自动执行下拉刷新的回调; 默认true
			},
			// 上拉加载的常用配置
			upOption: {
				use: true, // 是否启用上拉加载; 默认true
				auto: false, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
				page: {
					num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
					size: PAGESIZE // 每页数据的数量,默认10（别忘了和请求参数中的pageSize一样）
				},
				noMoreSize: 0, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
				empty: {
					icon: null,
					use: false,
					tip: ''
				},
				textNoMore: '没有更多啦~',
				toTop: {
					src: '', // 避免遮挡底部[打标签]按钮触发不了
				}
			},
			navFilterBottom: '200', // 顶部筛选bottom高度,mescroll 距顶高度
			swBottom: 0, // mescroll 距底高度
		}
	},
	computed: {
		// 是否显示支付（点菜金额小于定金不让支付）
		isPayMaterialMoney() {
			return function(item) {
				if (item.frontMoney && item.materiaMoney) {
					if (customerOrder.frontMoney > customerOrder.materiaMoney) {
						return false;
					} else {
						return true;
					}
				} else {
					return true;
				}
			}
		},
		// 标签显示
		formatTag() {
			return function(item) {
				let tag = item.tag;
				switch (tag) {
					case '去评价':
						tag = '待评价';
						break;
					case '已完成':
						tag = '已评价';
					case '待支付':
						tag = '待支付';
					default:
						break;
				}
				return tag;
			}
		}
	},
	components: {},
	mounted() {

	},
	methods: {
		calcMescrollTop() {//计算mescroll高度
			this.$nextTick(() => {
				const query = uni.createSelectorQuery().in(this);
				query.select('.bookings-top').boundingClientRect(data => {
					if (data) {
						this.navFilterBottom = (data.bottom + uni.upx2px((65) * 2)).toString();
					}
				}).exec();
			});
		},
		// 打给客户经理
		callPhone(phone) {
			if (!phone) return;
			uni.makePhoneCall({
				phoneNumber: phone,
			});
		},
		// 评价订单
		evaluationOrder(item) {
			uni.navigateTo({
				//保留当前页面，跳转到应用内的某个页面
				url: '/pages/myOrderSub/commentsDetail/commentsDetail?id=' +
					item.customerBookOrderID +
					'&shopId=' +
					item.storeID +
					'&salerId=' +
					item.saleId +
					'&salerName=' +
					item.marketerName
			});
		},
		// ---------------------- methods数据请求 ------------------------------
		/*mescroll组件初始化的回调,可获取到mescroll对象 (此处可删,mixins已默认)*/
		mescrollInit(mescroll) {
			this.mescroll = mescroll;
		},
		/*下拉刷新的回调 */
		downCallback() {
			this.mescroll.resetUpScroll(); // 重置列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
		},
		/*上拉加载的回调*/
		async upCallback(mescroll) {
			// 此时mescroll会携带page的参数:
			let pageNum = mescroll.num; // 页码, 默认从1开始
			let pageSize = mescroll.size; // 页长, 默认每页10条

			let data = {
				phone: this.phone,
				pagesize: pageSize,
				pageindex: pageNum,
				needStatus: 0,
				shopId: this.storeID
			};
			// 获取订单列表
			let result = await CY20.GetOrderList(data, null, (err) => {
				this.mescroll.endErr()
			});
			if (result) {
				result = this.$util.null2str(result);
				// 接口返回的当前页数据列表 (数组)
				let returnData = result.borderList.dataList || [];
				let tempList = [];
				for (let i = 0; i < returnData.length; i++) {
					tempList.push({
						"customerBookOrderID": returnData[i].customerBookOrderID ? returnData[i].customerBookOrderID : returnData[i]
							.bookOrderID,
						"shopImg": returnData[i].shopImg,
						"shopName": returnData[i].shopName,
						"marketerName": returnData[i].marketerName,
						"tag": returnData[i].tag,
						"marketerPhone": returnData[i].marketerPhone,
						"bookDate": returnData[i].bookOn.substring(0, 10),
						"diningTypeName": returnData[i].diningTypeName,
						"bookTime": returnData[i].willArrivedOn,
						"bookOrderTypeName": returnData[i].bookOrderTypeName,
						"frontMoney": returnData[i].frontMoney,
						"paid": returnData[i].paid,
						"isComment": returnData[i].isComment,
						"tableTableName": returnData[i].tableTableName,
						"isComment": returnData[i].isComment,
						"storeID": returnData[i].bookOrderStoreID,
						"saleId": returnData[i].bookOrderMarketerID,
					});
				}
				returnData = tempList;
				// 接口返回的总页数 (比如列表有26个数据,每页10条,共3页; 则totalPage值为3)
				let totalPage = Math.ceil(result.borderList.rowCount / PAGESIZE);
				console.log({
					totalPage
				});
				//设置列表数据
				if (this.mescroll.num == 1) this.dataList = []; //如果是第一页需手动置空列表
				this.dataList = this.dataList.concat(returnData); //追加新数据
				this.emptyEleShow = this.dataList.length <= 0;
				console.log({
					'数据列表dataList': this.dataList
				});
				//方法一(推荐): 后台接口有返回列表的总页数 totalPage
				this.mescroll.endByPage(returnData.length, totalPage);
			} else {
				// 失败隐藏下拉加载状态
				this.mescroll.endErr();
			}
		},
		// 刷新列表
		refresh(cb) {
			console.log(this.mescroll);
			this.mescroll.resetUpScroll && this.mescroll.resetUpScroll();
			cb && cb();
		},
		// 点击搜索按钮
		triggerSearch() {
			console.log(this.inputVal);
			if (this.inputVal.length == 11) {
				if (!this.$util.validatemobile(this.inputVal)) {
					this.showToastCancel('cancel', '手机号输入有误');
					return;
				}
				this.phone = this.inputVal;
				this.showModal = true;
				this.inputShowed = false;
				console.log(this.showModal, this.inputShowed);
			} else {
				this.showModal = false;
				uni.showToast({
					title: '请输入11位手机号',
					icon: 'none'
				})
			}
		},
		//手机号文本框输入事件
		inputTyping(e) {
			this.inputVal = e.detail.value;
			if (e.detail.value.length > 0) {
				this.inputShowed = true;
			} else {
				this.inputShowed = false;
				this.showModal = false;
			}
		},
		showToastCancel(type, text) {
			this.$util.showToastCancel(type, text);
		},
		//输入验证码
		vcodeInput(e) {
			let val =e.detail.value;
			if (val.length != 6) {
				return;
			}

			if (val.length == 6) {
				CY35.CheckPhoneCode({
					phone: this.inputVal,
					code: val
				},result=>{
					if (result.isSuccess == 1) {
						// 开始验证
						setTimeout(() => {
							uni.showToast("success", "验证码正确");
						});
						this.showModal = false;
						this.inputShowed = true;
						this.yzmInputDisabled = true;
						this.djs = 0;
						this.refresh(() => {
							this.inputShowed = false;
						});
					} else {
						this.showToastCancel("cancel", "验证码错误");
					}
				});
				
			}
		},
		//发送验证码
		async getVcode(e) {
			//手机号输入有误
			if (!util.validatemobile(this.inputVal)) {
				this.showToastCancel('cancel', '手机号输入有误');
				return;
			} //按钮禁用时不做任何操作
			if (this.yzmDisabled) {
				return;
			}
			let data = {
				tel: this.inputVal
			};
			this.djs = 60; //禁用button
			//重置倒计时
			this.yzmDisabled = true;
			this.yzmInputDisabled = false;
			this.showModal = true;
			this.yzm = '重新发送(' + 60 + 's)';

			let yzmInterval = setInterval(() => {
				if (this.djs <= 0) {
					this.yzm = '获取验证码';
					this.yzmDisabled = false;
					clearInterval(yzmInterval);
				} else {
					this.djs--;
					this.yzm = '重新发送(' + this.djs + 's)';
				}
			}, 1000);
			uni.showToast('success', '验证码发送成功');
			let rdata = await GK01.SendCode(data, null, false)
			// 验证码不在这儿赋值了，得用手机接收
			// this.vcode = rdata; // 无效
			this.showModal = true;
		},
		// 取消发送验证码
		cancel(e) {
			// 取消时，把phone也清空。否则会导致切回order订单tab时，如果用户之前填了另一个号码但没填验证码时，会调用refresh直接拉取该号码下的订单
			this.inputShowed = false;
			this.showModal = false;
			this.inputVal = '';
			this.yzmInputDisabled = true;
			this.djs = 0;
			this.phone = ''
			return;
		},

	}
}
