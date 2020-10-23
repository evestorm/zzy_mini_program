// 作者:于大明

export default {
	name: 'yyt-rate',
	// 注册属性
	props: {
		// 多少分
		score: {
			type: [Number,String],
			require: true,
			default: 0
		}
	},
	created(){
		
	},
	data() {
		return {
			title: {}
		};
	},
	computed: {
		// 转int
		myScore(){
			return parseInt(this.score);
		}
	},
	filters: {
		// parseScene(value) {
		// return value+'123';
		// }
	},
	methods: {
		// 注册事件
		_onClick() {
			this.$emit('onClick');
		}
	}
};