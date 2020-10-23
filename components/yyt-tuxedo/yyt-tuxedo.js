// 作者:何文韬

export default {
	name: 'yyt-tuxedo',
	// 注册属性
	props: {
		// 广播内容
		contentList: {
			type: Array,
			default :() => []
		},
		// 右侧图片
		orderPeopleImgList: {
			type: Array,
			default :() => []
		},
	},
	async created() {
		if(this.orderPeopleImgList.length>8)
		{
			this.orderPeopleImgList=this.orderPeopleImgList.slice(0, 8);
		}
		console.log(this.contentList);
	},
	data() {
		return {
			current:0,  //swipercurrent
			interval:5000, //每页停留时长
			rollTime:5,//滚动时长
			
		};
	},
	methods: {
		// 滑动
		changeAutoplay(e){
			let index=e.detail.current;
			let indexlength=this.contentList[index].length;
			this.current=index;
			// console.log(parseInt(indexlength/8));
			if(indexlength>20)
			{
				this.rollTime= parseInt(indexlength/8)>=30?30:parseInt(indexlength/8);
				this.interval=this.rollTime*1000;
			}
			else
			{
				this.interval=5000;
			}
			// const query = uni.createSelectorQuery().in(this);
			// query.select('#noticeno0').boundingClientRect(data => {
			//   console.log("得到布局位置信息" + JSON.stringify(data));
			//   console.log("节点离页面顶部的距离为" + data.top);
			// }).exec();
		},
		// 注册选中事件
		_onclick(item) {
			this.$emit('onclick', item);
		}
	},
	computed: {

	},
	filters: {

	},
	watch: {

	}

};
