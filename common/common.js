import storage from '@/common/unistorage/index.js';
import _ from "@/lib/lodash/lodash.js";
export default {
	/**
	 * @description tabBar跳转传参
	 * @param {String} url 跳转链接 e.g. '/pages/customer/customer'
	 * @param {Object} payload 参数对象 e.g. {tabIndex: 0}
	 */
	setSwitchTo(config) {
		let {
			url,
			payload
		} = config;
		// 把数据缓存到storage
		storage.setTabBarPayload(payload);
		uni.switchTab({
			url,
		})
	},
}

