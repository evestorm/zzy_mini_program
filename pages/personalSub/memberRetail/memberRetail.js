// import uniNoticeBar from '@/components/uni-notice-bar/uni-notice-bar.vue';
import HY17 from '@/service/HY/HY17AppService.js'

export default {
	data() {
		return {
			// index: 1,
			// size: 20,
			hyUserCardID: '',
			curDate: '',
			retailIndex: 0,
			record: [],
		}
	},
	// components: {
	// 	uniNoticeBar
	// },
	onLoad(option) {
		this.hyUserCardID = option.id;
		this.retailIndex = option.index;
		this.initDate();
		this.getRecord();
	},
	methods: {
		initDate() {
			let date = this.$util.formatTime().substring(0, 7);
			this.curDate = date;
		},
		getRecord() {
			this.record = [];
			if (this.retailIndex == 0) {
				this.getDisRecordRecordInfo();
			} else {
				this.getVerificationInfo();
			}
		},
		getDate(event) {
			this.curDate = event.detail.value;
			this.getRecord();
		},
		selectRetail(index) {
			if (this.retailIndex == index) return;
			this.retailIndex = index;
			this.initDate();
			this.getRecord();
		},
		async getDisRecordRecordInfo() {
			let data = {
				hyUserCardID: this.hyUserCardID,
				date: `${this.curDate}-01 00:00:00`
			};
			let res = await HY17.GetDisRecordRecordInfo(data);
			if (res) {
				this.record = res.disRecordRecordInfo;
			};
		},
		async getVerificationInfo() {
			let data = {
				hyUserCardID: this.hyUserCardID,
				date: `${this.curDate}-01 00:00:00`
			};
			let res = await HY17.GetVerificationInfo(data);
			if (res) {
				// 假数据
				// res.verificationInfoList = Array.from({length: 12}).map((v, index) => {
				// 	return {
				// 		disRecordUseTime: '2019-02-03 12:12:00',
				// 		bookerName: 'Lance' + index,
				// 		bookerPhone: '18722212222',
				// 		businessName: "双湖园",
				// 		branchName: "双湖宴",
				// 		disRecordCode: '20082008820' // ←假字段，后面以后端传的为准
				// 	}
				// })
				this.record = res.verificationInfoList;
			}
		},
		// 去分销码页面(item是分、核销记录item，index是点了左右哪个tab)
		gotoFenxiaoCode(item, index) {
			if (index == 0) { // 点击了【分销记录某项】
				const url =
					`/pages/personalSub/fenxiaoCode/fenxiaoCode?hyUserCardID=${this.hyUserCardID}&isVerification=${item.isVerification}&val=${item.disRecordCode}`;
				uni.navigateTo({
					url: url
				});
			} else { // 点击了【核销记录某项】
				// 如果以后进入此else也要跳转到fenxiaoCode，别忘了isVerification字段要传，而且为1，表示已核销
			}
		}
	}
}
