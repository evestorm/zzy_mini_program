import Vue from 'vue';
import App from './App';
import store from '@/store'
import _ from "@/lib/lodash/lodash.js"

import moment  from "@/lib/moment/moment.min.js"
import * as filters from '@/lib/vue-filter/vue-filters.js'
import util from '@/common/util.js'
import storage from '@/common/unistorage/index.js'
import AppConst from '@/AppConst.js'

let filterObj={}; // 全局filter obj
// 添加全局过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
  filterObj[key]=filters[key];
})

// 扩展vue原型属性
prototypeEx(Vue);

Vue.config.productionTip = false;
App.mpType = 'app';

const app = new Vue({
    ...App
});
app.$mount();


// 扩展Vue原型
function prototypeEx(Vue){
	// vue prototype 扩展
	Vue.prototype._ = _; // 加入 lodash使用
	Vue.prototype.$moment = moment; // 加入 moment使用
	Vue.prototype.$util = util; // util 帮助方法
	Vue.prototype.$AppConst = AppConst; // app常量
	Vue.prototype.$storage = storage; // 用于存储
	Vue.prototype.$filter = filterObj; // 全部过滤
}