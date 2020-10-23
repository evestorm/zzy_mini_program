import HY07AppService from '@/service/HY/HY07AppService.js';
export default {
	data() {
		return {
			time: '',
			// isDynamicCode: '',
			code: {
				num: '',
				qrCode: '',
				barCode: ''
			}
		};
	},
	onLoad(option) {
		this.init(option);
		this.timer = setInterval(() => {
			this.init(option);
		}, 1000 * 60 * 10);
	},

	onUnload() {
		clearInterval(this.timer);
	},

	onHide() {
		clearInterval(this.timer);
	},

	methods: {
		async init(option) {
			let data = {
				hyUserCardID: option.id
			};
			let res=await HY07AppService.getQrImg(data);
			if(res){
				let code = {
					logoUrl: res.cardLogoUrl ? res.cardLogoUrl : 'https://pic.cwyyt.cn/upload/img/20191106/162105215_img1.png',
					num: this.splitNum(option.code),
					qrCode: res.qrCodeUrl ? getApp().globalData.PicDomain + res.qrCodeUrl : '',
					barCode: res.barcodeCodeUrl ? getApp().globalData.PicDomain + res.barcodeCodeUrl : ''
				};
				this.code=code;
			};
		},
		splitNum(num) {
			let splitRule = [4, 4, 6, 5];
			let array = [];

			if (num) {
				for (let i = 0; i < splitRule.length; i++) {
					let curStr = num.substring(0, splitRule[i]);
					num = num.substring(splitRule[i]);
					array.push(curStr);
				}
			}
			return array;
		},
	}
};
