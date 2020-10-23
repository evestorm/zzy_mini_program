// 作者:覃彬

export default {
	name: 'yyt-steps',
	// 注册属性
	props: {
		title: {
			type: String,
			default:'订单跟踪',
			require: false,
		},
		stepsLiat:{
			type:Array,
			require:true,
			default:[{
				eventName:'事件',
				eventDateTime:'05-20 16:00'
			}]
		}
	},
	created(){
		
	},
	data() {
		return {
		};
	},
	Computed:{
		stepDataList(){
			return this.stepsLiat?this.stepsLiat:[]
		}
	},
	methods: {
		// 注册事件 注意 暴露给外面的事件 以_on开头 里面的事件不用
		_onClick() {
			this.$emit('closeStep',false);
		}
	},
	Computed: {
		items(){
			return this.inputItems;
		}
	},
	filters: {
		// parseScene(value) {
		// return value+'123';
		// }
	},
};