export default {
	data() {
		return {
			shopBusinessDtail: {},
			shopId: '', //门店id
		};
	},

	components: {},
	props: {},
	onLoad(options) {
		let shopBusinessDtail = JSON.parse(options.shopItem);
		this.shopBusinessDtail = shopBusinessDtail;
		this.shopId = options.shopId;
	},
	onShow() {},
	methods: {}
};
