import HY07 from '@/service/HY/HY07AppService.js';

export default {
	data() {
		return {
			loaded: false,
			openId: '',
			tel: '',
			cardInfo: null
		};
	},
	async onLoad(option) {
		getApp().globalData.curUrl = {
			path: this.$util.getCurrentPageUrl(),
			query: option
		};
		await getApp().globalData.verifyAu()
		this.getMyCard();
	},
	methods: {
		// 去会员中心
		goMemberCenter(event) {
			let id = event.currentTarget.dataset.id;
			uni.navigateTo({
				url: `/pages/personalSub/memberCenter/memberCenter?id=${id}&isGet=1`
			});
		},

		splitNum() {
			let splitRule = [4, 4, 6, 7];
			this.cardInfo.forEach(item => {
				if (!item.cardImgUrl) {
					item.cardImgUrl = 'https://pic.cwyyt.cn/upload/img/20200319/120912912_card-bj.png';
				} else {
					item.cardImgUrl = item.cardImgUrl;
				}

				if (!item.cardLogoUrl) {
					item.cardLogoUrl = 'https://pic.cwyyt.cn/upload/img/20200319/121504154_card-logo.png';
				} else {
					item.cardLogoUrl = item.cardLogoUrl;
				}

				let array = [];

				if (item.hyUserCode) {
					splitRule.forEach(em => {
						let curStr = item.hyUserCode.substring(0, em);
						item.hyUserCode = item.hyUserCode.substring(em);
						array.push(curStr);
					})
					// for (let i = 0; i < splitRule.length; i++) {
					// 	let curStr = item.hyUserCode.substring(0, splitRule[i]);
					// 	item.hyUserCode = item.hyUserCode.substring(splitRule[i]);
					// 	array.push(curStr);
					// }
				}

				item.hyUserCode = array;
			});
			this.loaded = true;
		},

		async getMyCard() {
			let data = {
				zZYOpenid: getApp().globalData.userInfo.spOpenId,
				hyUserTel: getApp().globalData.userInfo.phone
			};
			let res = await HY07.myMemberCard(data);
			if (res) {
				this.cardInfo = res;
				this.splitNum();

			}
		}
	}
};
