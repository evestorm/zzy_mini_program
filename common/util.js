import _ from "@/lib/lodash/lodash.js";
// 去前后空格  (is_global可选，为'g'时清除所有空格)
function trim(str, is_global) {
	if (!str) {
		return "";
	}

	let result;
	result = str.replace(/(^\s+)|(\s+$)/g, "");

	if (is_global != undefined && is_global.toLowerCase() == "g") {
		result = result.replace(/\s/g, "");
	}

	return result;
} // 成功信息


function showToastMsg(msg, duration, image, icon) {
	msg = msg || 'success!';
	duration = duration || 1000;
	image = image || '';
	icon = icon || 'success';
	uni.showToast({
		title: msg,
		icon: icon,
		duration: duration,
		image: image
	});
}
/**
 * 时间戳或时间 格式化
 * 两个参数：
 * 第一个参数：可选，时间或时间戳，默认为当前时间。第二个参数：可选，转换的格式，默认为(YYYY-MM-DD hh:mm:ss)。
 * 不补0：(YYYY-M-D h:m:s) 2018-1-1 0:0:0
 * 加入星期：(YYYY-MM-DD www hh:mm:ss) 2018-01-01 星期一 00:00:00
 * 加入周：(YYYY-MM-DD ww hh:mm:ss) 2018-01-01 周一 00:00:00
 */


function formatTime(date, fmt) {
	if (date == "Invalid Date") {
		return "";
	}

	date = date || new Date();
	date = date instanceof Date || typeof date == 'number' ? new Date(date) : new Date();
	fmt = fmt || 'YYYY-MM-DD hh:mm:ss';
	let obj = {
			'Y': date.getFullYear(),
			'M': date.getMonth() + 1,
			'D': date.getDate(),
			'w': date.getDay(),
			'h': date.getHours(),
			'm': date.getMinutes(),
			's': date.getSeconds()
		},
		week = ['日', '一', '二', '三', '四', '五', '六'];

	for (let i in obj) {
		fmt = fmt.replace(new RegExp(i + '+', 'g'), function(e) {
			let itemStr = obj[i] + '';
			if (i == 'w') return (e.length > 2 ? '星期' : '周') + week[itemStr];

			for (let j = 0, len = itemStr.length; j < e.length - len; j++) itemStr = '0' + itemStr;

			return itemStr;
		});
	}

	return fmt;
}
/**
 * 时间戳转换为时分秒
 * 两个参数：
 * 第一个参数：可选，秒数，默认为0。第二个参数：可选，转换的格式，默认为(hh: mm: ss)。
 * 不补0 (h: m: s) 0:0:0
 * 加入天：(DD天hh: mm: ss) 06天06:06:06
 */


function formatTimestamp(date, fmt) {
	date = date / 1000 || 0;
	fmt = fmt || 'hh:mm:ss';
	let obj;

	function setObj(h, m) {
		obj = {
			'D': parseInt(date / 60 / 60 / 24),
			'h': h == 1 ? parseInt(date / 60 / 60) % 24 : parseInt(date / 60 / 60),
			'm': m == 1 ? parseInt(date / 60) % 60 : parseInt(date / 60),
			's': parseInt(date) % 60
		};
	}

	fmt.indexOf('h') == -1 ? setObj(0, 0) : fmt.indexOf('D') == -1 ? setObj(0, 1) : setObj(1, 1);

	for (let i in obj) {
		fmt = fmt.replace(new RegExp(i + '+', 'g'), function(e) {
			let itemStr = obj[i] + '';

			for (let j = 0, len = itemStr.length; j < e.length - len; j++) itemStr = '0' + itemStr;

			return itemStr;
		});
	}

	return fmt;
} //获取今天+1+2的日期字符串


function getDateStr(today, addDayCount, hasYear, addYearCount) {
	let dd;

	if (today) {
		dd = new Date(today);
	} else {
		dd = new Date();
	}

	if (!addDayCount) {
		addDayCount = 0;
	}

	if (!addYearCount) {
		addYearCount = 0;
	}

	dd.setDate(dd.getDate() + addDayCount); //获取AddDayCount天后的日期

	dd.setYear(dd.getFullYear() + addYearCount); //获取AddYearCount天后的日期

	let y = dd.getFullYear();
	let m = dd.getMonth() + 1; //获取当前月份的日期

	let d = dd.getDate();

	if (m < 10) {
		m = '0' + m;
	}

	;

	if (d < 10) {
		d = '0' + d;
	}

	;

	if (!hasYear) {
		return m + "." + d;
	}

	return y + "-" + m + "-" + d; // return m + "." + d;
}

function validatemobile(mobile) {
	mobile = trim(mobile, 'g');

	if (mobile.length == 0) {
		return false;
	}

	if (mobile.length != 11) {
		return false;
	}

	let myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;

	if (!myreg.test(mobile)) {
		return false;
	}

	return true;
} //传入经纬度计算距离


function distance(la1, lo1, la2, lo2) {
	if (!la1 || !lo1 || !la2 || !lo2) {
		return "";
	}

	let La1 = la1 * Math.PI / 180.0;
	let La2 = la2 * Math.PI / 180.0;
	let La3 = La1 - La2;
	let Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
	let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 /
		2), 2)));
	s = s * 6378.137; //地球半径

	s = Math.round(s * 10000) / 10000;
	return s; // console.log("计算结果",s)
} // 对象转url参数


// 对象转url参数
/**
 * @param {Object} obj数据
 * @param {Object} 第一个字符
 * @param {Object} key
 * @param {Object} encode
 */
function urlEncode(param, firstSymbol, key, encode) {
	if (param == null) return '';
	let paramStr = '';
	let t = typeof(param);
	if (t == 'string' || t == 'number' || t == 'boolean') {
		paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
	} else {
		for (let i in param) {
			let k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i)
			paramStr += urlEncode(param[i], '&', k, encode)
		}
	}

	firstSymbol = firstSymbol || '&';

	paramStr = firstSymbol + paramStr.substring(1, paramStr.length);
	return paramStr;
}


// 获取完整的URL ('pagea/index/index?s=123',{a:'test'})
function getFullUrl(url,param){
	let firstSymbol='&';
	if(url.indexOf('?')==-1){
		firstSymbol='?'
	}
	return url+urlEncode(param,firstSymbol);
}


function toDecimal(num, v) {
	let vv = Math.pow(10, v);
	return Math.round(num * vv) / vv;
} // JS获取URL中参数值（QueryString）

// 对数字进行格式化，num为要处理的数字，digit为保留的小数位数
function formatNum(num, digit = 2) {
	return parseFloat((Math.round(num * 100) / 100)).toFixed(parseInt(digit));
}


function getQueryString(url, name) {
	let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	let r = url.substring(url.indexOf('?')).substr(1).match(reg);
	if (r != null) return decodeURI(r[2]);
	return null;
}

// 获取当前页url
function getQueryUrl(url) {
	let index = url.indexOf('?');
	if (index == -1) return url;
	let r = url.substring(0, index);
	return r;
}

// 获取当前界面和完整参数
function getCurrentPageUrl() {
	let pages = getCurrentPages(); // 获取加载的页面
	let currentPage = pages[pages.length - 1]; // 获取当前页面的对象
	let url = currentPage.route; // 当前页面url
	return url;
}

// 获取当前页带参数的url
function getCurrentPageUrlAndArgs() {
	let pages = getCurrentPages(); //获取加载的页面
	let currentPage = pages[pages.length - 1]; //获取当前页面的对象
	let url = currentPage.route; //当前页面url
	let options = currentPage.options||currentPage.$route.query; //如果要获取url中所带的参数可以查看options
	
	//拼接url的参数
	let urlWithArgs = url + '?';

	for (let key in options) {
		let value = options[key];
		urlWithArgs += key + '=' + value + '&';
	}

	urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1);
	return urlWithArgs;
}

// 把字段为null的转为空字符串
function emptyToString(field) {
	console.log(_.isNil(field));
	return _.isNil(field) ? '' : field;
}

/**
 * null => ''
 * @param {*} data 要处理的数据
 */
function null2str(data) {
	for (let x in data) {
		if (data[x] === null) { // 如果是null 把直接内容转为 ''
			data[x] = '';
		} else {
			if (Array.isArray(data[x])) { // 是数组遍历数组 递归继续处理
				data[x] = data[x].map(z => {
					return null2str(z);
				});
			}
			if (typeof(data[x]) === 'object') { // 是json 递归继续处理
				data[x] = null2str(data[x])
			}
		}
	}
	return data;
}

// 显示自定义图标
function showToastCancel(types, text) {
	types = types || 'cancel';
	text = text || '错误!';
	let image;
	if (types == 'cancel') {
		image = '/static/toast/cancel.png';
	} else if (types == 'success') {
		image = '/static/toast/success.png';
	}
	uni.showToast({
		image: image,
		icon: 'none',
		duration: 2000,
		color: '#fff',
		title: text,
		mask: true
	});
}

// 预览图片 多个图片用,分割 比如 'img1','img2'
function previewImage(url) {
	let imgArr=[];
	imgArr.push(url);
	uni.previewImage({
		urls: imgArr
	})
}
function parseKm(num,n){
	if(!num){
		return ''
	}
	let m=0;
	if(num>=1000){
		m=(num/1000).toFixed(n)+'km';
	}else{
		m=num+'m';
	}
		return m;
}

/** 检查哪些属性发生变化时需要刷新 适用obj
 * @param {Object} newValue 
 * @param {Object} oldValue
 * @param {Object} checkFields 需要检查的属性 ['name','age']
 */
function isChgForWatch(newValue,oldValue,checkFields){
	// 第一次watch
	if(oldValue===undefined) return true;
	
	// 对比变化
	for(let i=0;i<checkFields.length;i++){
		if(oldValue[checkFields[i]]!=newValue[checkFields[i]]){
			return true;
		}
	}
	
	// 最终返回
	return false;
}

module.exports = {
	getCurrentPageUrl,
	// 获取当前界面的Url
	getCurrentPageUrlAndArgs,
	// 当前界面的URL加参数
	trim: trim,
	//清除空格
	showToastMsg: showToastMsg,
	//弹出消息提示
	formatTime: formatTime,
	//格式化时间、时间戳
	formatTimestamp: formatTimestamp,
	//格式化时间戳
	getDateStr: getDateStr,
	//获取今天+1+2的日期字符串
	validatemobile: validatemobile,
	//判断是否为手机
	urlEncode: urlEncode,
	//判断是否为手机
	distance: distance,
	//传入经纬度计算距离
	toDecimal: toDecimal,
	// 数字保留指定小数
	formatNum: formatNum,
	//对多位小数进行四舍五入
	getQueryString: getQueryString,
	//JS获取URL中参数值（QueryString）
	getQueryUrl: getQueryUrl, // js获取URL不携带参数的
	emptyToString, // 把字段为null的转为空字符串
	// null 转''
	null2str,
	// 展示取消的toast
	showToastCancel,
	previewImage, // 预览图片
	getFullUrl, // 获取完整的url
	parseKm,//超过1000米显示1km 保留1位小数
	isChgForWatch // 检查哪些属性发生变化时需要刷新 适用obj
};
