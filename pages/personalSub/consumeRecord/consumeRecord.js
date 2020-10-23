import HY02AppService from '@/service/HY/HY02AppService.js';
import HY07AppService from '@/service/HY/HY07AppService.js';
import HY12AppService from '@/service/HY/HY12AppService.js';
export default {
	data() {
		return {
			userInfo: {},
			cardInfo: {},
			index: 1,
			size: 10,
			noData: false,
			curDate: '',
			id: '',
			hyCardID: '',
			record: [],
			classifyShow: false,
			isCanTakeMoney: 0,
			isEnableStore: 0,
			classify: [{
				text: '全部',
				index: 0,
				select: true
			}, {
				text: '消费',
				index: 1,
				select: false
			}, {
				text: '返现',
				index: 2,
				select: false
			}, {
				text: '充值',
				index: 3,
				select: false
			}, {
				text: '提现',
				index: 4,
				select: false
			}],
			option: {}, // onload传入option
		};
	},
	onLoad(option) {
		this.option = option;
	},
	onShow() {
		this.initData(this.option);
	},
	onReachBottom() {
		if (!this.noData) {
			this.index = ++this.index;
			this.getPointsRecord(this.id, this.curDate, this.record);
		}
	},
	computed: {
		curClassify() {
			return this.classify.filter(item => item.select)[0];
		},
	},
	filters: {
		feeTypeText(value) {
			switch (value.feeType) {
				case 1:
					return '本次消费';
					break;
				case 2:
					return '本次返现';
					break;
				case 3:
					return '本次充值';
					break;
				case 4:
					return '本次提现';
					break;
			}
		}
	},
	methods: {
		initData(option) {
			this.id = option.id;
			this.hyCardID = option.hyCardID;
			if (option.index == 0 || option.index) {
				this.classify[0].select = false;
				this.classify[option.index].select = true;
			}
			let date = this.$util.formatTime().substring(0, 7);
			this.curDate = date
			this.getUserInfo();
			this.getCardInfo();
			this.getAuthority();
			this.getPointsRecord(option.id, date);
		},
		getUserInfo() { //获取用户信息
			this.userInfo = getApp().globalData.userInfo;
		},
		async getCardInfo() { //获取会员卡信息
			let data = {
				hyUserCardID: this.id
			};
			let res = await HY07AppService.GetCardInfo(data);
			if (res) {
				this.cardInfo = res;
			}
		},
		getDate(event) {
			this.curDate = event.detail.value;
			this.getPointsRecord(this.id, this.curDate);
		},
		async getAuthority() { //获取权限
			let data = {
				hyCardID: this.hyCardID
			};
			let res = await HY02AppService.GetPermissions(data);
			if (res) {
				console.log('权限', res)
				this.isCanTakeMoney = res.isCanTakeMoney;
				this.isEnableStore = res.isEnableStore;
			};
		},
		async getPointsRecord(id, date, array) {
			if (!array) {
				this.index = 1;
				this.noData = false;
				array = [];
			};
			let data = {
				"hyUserCardID": id,
				"feeType": this.curClassify.index,
				"date": `${date}-01 00:00:00`,
				"pageSise": this.size,
				"pageIndex": this.index
			};
			let res = await HY12AppService.GetBalanceInfo(data);
			if (res) {
				if (res.balanceInfo) {
					res.balanceInfo.forEach(item => {
						item.businessName = item.businessName ? item.businessName : '';
						item.branchName = item.branchName ? item.branchName : '';
						item.chgTime = item.chgTime.replace(/-/g, '.').split(' ');
						item.changesAmount = item.changesAmount.toString();
						item.changesAmount = item.changesAmount.indexOf('-') >= 0 ? item.changesAmount : `+${item.changesAmount}`;
						array.push(item);
					});
					this.record = array;
					if (res.balanceInfo.length < this.size) {
						this.noData = true;
					}
				};
			};
		},
		selClassify(item) {
			this.classify.forEach(item => {
				item.select = false;
			});
			item.select = true;
			this.getPointsRecord(this.id, this.curDate);
			this.classifyShow = false;
		}
	}
};
