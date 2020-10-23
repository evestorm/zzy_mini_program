import YHBanquetProject from '@/service/YH/YHBanquetProjectAppService.js';
export default {
	data() {
		return {
			title: '评价', // 页面的title
			into: {
				projectConfGUID: '111', //项目的guid
				name: '主持人',
				type: '婚宴',
				date: '2019-12-23',
				banquetOrderGUID: '222', //宴会单Guid
				banquetProjectGUID: '',
			},
			data: {
				cstScore: 0,
				cstComment: '',
				id: '',
				modifiedName: getApp().globalData.userInfo.nickName,
				banquetOrderGUID: '',
			}
		};
	},
	// 页面加载事件
	onLoad(option) {
		if (option.banquetProjectGUID) {
			this.data.id = option.banquetProjectGUID;
			this.into.projectConfGUID = option.projectConfGUID;
			this.into.name = decodeURIComponent(option.name, true);
			this.into.type = decodeURIComponent(option.type, true);
			this.into.banquetProjectGUID = option.banquetProjectGUID;
			this.into.date = (decodeURIComponent(option.date, true));
			this.data.banquetOrderGUID = (decodeURIComponent(option.banquetOrderGUID, true));
		}

	},
	methods: {
		async updateFile() {
			let res = await YHBanquetProject.UpdateByDto(this.data);
			if (res) {
				uni.navigateBack({
					delta: 1
				});
			}
		},
		change(value) {
			this.data.cstScore = value;
		}
	},
	filters: {
		//parseScene: function (value) {
		// return value+'123';
		//}
	},
	watch: {
		//"currentStore.storeId": {
		//    handler: function (val, oldval) {
		//        if (val) {
		//            vmDivItem1.$options.methods.getMonthSummaryData.bind(vmDivItem1)(1, val);
		//            vmDivItem3.$options.methods.getTodyBookData.bind(vmDivItem3)(1, val);
		//        }
		//    }
		//}
	}
	// ## 方法
};
