// 作者:qinbin
export default {
	name: 'yyt-countdown',
	data() {
		return {
			time: {
				hh: 0,
				mm: 0,
				ss: 0
			},
			interTime: null // 定时器
		};
	},
	// 注册属性
	props: {
		// 接收父组件传来的时间
		receiveTime: {
			type: String,
			default: "2020-12-22 00:00:00"
		},
		transform:{//组件大小缩放
			type: String,
			default: "scale(1,1)"
		}
	},
	created() {
		this._onCountDown(this.receiveTime);
	},
	methods: {
		// 倒计时函数
		_onCountDown(endTime) {
			if (this.interTime) {
				clearInterval(this.interTime);
			}
			//定时更新当前时间
			this.interTime = setInterval(() => {
				let m1 = this.$moment();
				let m2 = this.$moment(endTime);
				var du = this.$moment.duration(m2 - m1, 'ms'),
					days = du.get('days'),
					hours = du.get('hours') + days * 24,
					mins = du.get('minutes'),
					ss = du.get('seconds');

				if (hours <= 0 && mins <= 0 && ss <= 0) {
					clearInterval(this.interTime);
					this.$emit('onStopTime', '定时器停止')
				} else {
					this.time.hh = this._.padStart(hours, 2, '0');
					this.time.mm = this._.padStart(mins, 2, '0');
					this.time.ss = this._.padStart(ss, 2, '0');
					this.$emit('onGetTime', this.time);
				}
			}, 1000);
		}
	}
};
