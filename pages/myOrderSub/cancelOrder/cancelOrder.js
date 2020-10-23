import GZH09 from '@/service/GZH/GZH09AppService.js';
import CY28 from '@/service/CY/CY28AppService.js';
export default {
	data() {
		return {
			radioItems: [],
			nowshopid: '',
			//门店id
			customerOrderId: '',
			//用户自行预订id   CY28001
			cancelDesc_Sel: '',
			//取消原因--选中的
			cancelDesc_Input: '',
			//取消原因--输入的,
			isShow: false,
			//默认填写取消订单原因隐藏,
			min: 8,
			//最少字数
			max: 500 //最多字数
				,
			texts: "",
			currentWordNumber: ""
		};
	},

	components: {},
	props: {},
	onLoad(options) {
		this.customerOrderId = options.id;
		this.nowshopid = options.shopId;
		this.getCancelList();
		// this.$wuxToast = getApp().globalData.wux(this).$wuxToast;
	},
	onShow() {},
	methods: {
		async getCancelList() {
			let data = {
				tagType: 1,
				//要获取的标签类型（1.取消订单 2.预订快速备注 3.消费类型）
				shopId: this.nowshopid
			};
			let rdata = await GZH09.GetTagAsync(data);
			let returnData = rdata;
			let tempArr = [];
			if (returnData.length > 0) { //添加一个其它原因
				returnData.forEach((item, i) => {
					//默认选中第一个
					if (i == 0) {
						tempArr.push({
							id: i,
							value: item.id,
							name: item.tagContent,
							checked: true
						});
					} else {
						tempArr.push({
							id: i,
							value: item.id,
							name: item.tagContent
						});
					}
				})
				tempArr.push({
					id: 999,
					name: '其它原因'
				});
				this.radioItems = tempArr;
				this.isShow = false;
			} else {
				this.isShow = true
			}

		},
		//得到输入的取消原因
		getCancelDesc(e) {
			// 获取输入框的内容
			this.cancelDesc_Input = e.detail.value;
			this.cancelDesc_Sel = e.detail.value;

			let cancelDesc_Input = e.detail.value; // 获取输入框内容的长度

			let len = parseInt(cancelDesc_Input.length); //最少字数限制
			// if (len <= this.data.min)
			//   this.setData({
			//     texts: '至少输入8个字哦'
			//   });
			// else if (len > this.data.min)
			//   this.setData({
			//     texts: ' '
			//   });
			//最多字数限制
			if (len >= this.max) {
				this.texts = '超出字数限制~';
				return;
			}
			this.currentWordNumber = len; //当前字数
		},
		//得到选中的快速取消原因标签
		radioChange(e) {
			let radioItems = this.radioItems;
			let len = radioItems.length;
			//如果选中的是其它原因则得到输入的原因
			radioItems.forEach(item => {
				item.checked = item.name == e.detail.value;
			})
			if (e.detail.value == '其它原因') {
				this.cancelDesc_Sel = this.cancelDesc_Input;
				this.radioItems = radioItems;
				this.isShow = true;
			} else {
				this.cancelDesc_Sel = e.detail.value;
				this.radioItems = radioItems;
				this.isShow = false;
			}
		},
		async goSubmit(e) {
			let data = {
				id: this.customerOrderId,
				status: 3,
				//状态（1客户申请 2审核确认 3客户取消 4销售取消）
				cancelReason: this.cancelDesc_Sel
			};
			let rdata = await CY28.UpdateByDto(data);
			this.showToastCancel('success', '订单取消成功', () => {
				uni.navigateBack({
					delta: 1 //默认值是1，返回的页面数，如果 delta 大于现有页面数，则返回到首页。
				});
			})
		},
		showToastCancel(types, text, suc) {
			types = types || 'cancel';
			text = text || '验证码错误!';
			let image;
			if (types == 'cancel') {
				image = '/static/toast/cancel.png';
			} else if (types == 'success') {
				image = '/static/toast/success.png';
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
		}
	}
}
