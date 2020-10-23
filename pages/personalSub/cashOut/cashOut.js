import HY18 from '@/service/HY/HY18AppService.js'
export default {
	data() {
		return {
			hyCardID: '',
			hyUserCardID: '',
			remain: 0,
			rate: 0,
			amount: '',
		}
	},
	onLoad(option) {
		this.hyUserCardID = option.id;
		this.hyCardID = option.hyCardID;
		this.getRemain();
	},
	computed: {
		placeTips() {
			return `本次最多可以提现${this.remain}元`;
		},
		// 可否提现判定（是数字且大于0）
		canCashOut() {
			const amount = new Number(this.amount);
			return !isNaN(amount) && amount.valueOf() > 0
		},
	},
	watch: {
		amount(newValue, oldValue) {}
	},
	methods: {
		checkNum(e) {
			let val = e.target.value.replace(/(^\s*)|(\s*$)/g, "")
			console.log(val)
			if (!val) {
				this.amount = '';
				return
			}
			let reg = /[^\d.]/g

			// 只能是数字和小数点，不能是其他输入
			val = val.replace(reg, "")
			// // 保证第一位只能是数字，不能是点
			val = val.replace(/^\./g, "");
			// // 小数只能出现1位
			val = val.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
			// // 小数点后面保留2位
			val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
			console.log(val);
			this.$nextTick(() => {
				this.amount = val;
			})
		},
		async getRemain() {
			let data = {
				hyUserCardID: this.hyUserCardID
			};
			let res = await HY18.GetaccountBalance(data);
			if (res) {
				this.remain = res.belance;
				this.rate = res.takeMoneyRate;
			}
		},
		cashOutAll() {
			let num = this.remain;
			this.amount = num;
		},
		async withdrawal() {
			if (!this.amount) return;
			let data = {
				hyUserCardID: this.hyUserCardID,
				amount: this.amount
			};
			let res = await HY18.Withdrawal(data);
			if (res) {
				this.title = res.msg;
				this.icon = 'success';
				this.duration = 2000;
				setTimeout(() => {
					uni.redirectTo({
						url: `/pages/personalSub/consumeRecord/consumeRecord?id=${this.hyUserCardID}&hyCardID=${this.hyCardID}`
					})
				}, 2500)
			}
		}
	}
}
