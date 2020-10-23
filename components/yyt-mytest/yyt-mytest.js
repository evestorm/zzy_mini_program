// 作者:于大明

export default {
	name: 'yyt-mytest',
	// 注册属性
	props: {
		inputItems: {
			type: Array,
			require: false,
			default: ()=>[{
				
			}]
		}
	},
	created(){
		
	},
	data() {
		return {
			title: {},
			text:"asddddddddddddddddddddddddddddddddddddddddddd"
		};
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
	methods: {
		  move () {
		// 获取文字text 的计算后宽度  （由于overflow的存在，直接获取不到，需要独立的node计算）
		      let width = document.getElementById('node').getBoundingClientRect().width 
		      let box = document.getElementById('box')
		      let copy = document.getElementById('copy')
		      copy.innerText = this.text // 文字副本填充
		      let distance = 0 // 位移距离
		//设置位移
		      setInterval(function () { 
		        distance = distance - 1
		 // 如果位移超过文字宽度，则回到起点
		        if (-distance >= width) {
		          distance = 16
		        }
		        box.style.transform = 'translateX(' + distance + 'px)'
		      }, 20) 
		    },
		// 注册事件 注意 暴露给外面的事件 以_on开头 里面的事件不用
		_onClick() {
			this.$emit('onClick');
		}
	}
};