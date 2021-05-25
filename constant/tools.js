import Vue from 'vue'
const tools = {
	/**
	 * 格式化时间：
	 *【配置参数】：
	 * d ：毫秒值
	 * fmt ：格式化的时间格式，如：yyyyMMdd
	 */
	formatDate: function(d, fmt) {
		if (typeof d === "string") {
			var [match, year, month, day, hour, minute, second] = d.match(
				/(\d+)-(\d+)-(\d+)\s*(\d+):(\d+):(\d+)/);
			d = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(
				second));
		}
		d = !!d ? new Date(d) : new Date();
		const o = {
			"M+": d.getMonth() + 1, //月份
			"d+": d.getDate(), //日
			"h+": d.getHours(), //小时
			"m+": d.getMinutes(), //分
			"s+": d.getSeconds(), //秒
			"q+": Math.floor((d.getMonth() + 3) / 3), //季度
			"S": d.getMilliseconds() //毫秒
		};
		if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
			if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[
				k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	},
	/**
	 * 用法同 jQuery 的 $.extend
	 *【配置参数】：
	 * 是否深拷贝，默认 false
	 * 目标对象
	 * 源对象
	 */
	extend: function() {
		var src, copyIsArray, copy, name, options, clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false;

		// Handle a deep copy situation
		if (typeof target === "boolean") {
			deep = target;

			// skip the boolean and the target
			target = arguments[i] || {};
			i++;
		}

		// Handle case when target is a string or something (possible in deep copy)
		if (typeof target !== "object" && !this.isFunction(target)) {
			target = {};
		}

		// extend jQuery itself if only one argument is passed
		if (i === length) {
			target = this;
			i--;
		}

		for (; i < length; i++) {
			// Only deal with non-null/undefined values
			if ((options = arguments[i]) != null) {
				// Extend the base object
				for (name in options) {
					src = target[name];
					copy = options[name];

					// Prevent never-ending loop
					if (target === copy) {
						continue;
					}

					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (this.isPlainObject(copy) || (copyIsArray = this.isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && this.isArray(src) ? src : [];

						} else {
							clone = src && this.isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[name] = this.extend(deep, clone, copy);

						// Don't bring in undefined values
					} else if (copy !== undefined) {
						target[name] = copy;
					}
				}
			}
		}

		// Return the modified object
		return target;
	},
	// 是否为纯对象
	isPlainObject: function(obj) {
		if (!obj || typeof obj != 'object' || obj.nodeType || (obj == obj.window)) {
			return false;
		}
		return Object.prototype.toString.call(obj) === '[object Object]';
	},
	// 是否为纯数组
	isArray: Array.isArray || function(obj) {
		return Object.prototype.toString.call(obj) === '[object Array]';
	},
	// 是否为函数
	isFunction: function(obj) {
		return typeof obj === 'function';
	},
	isHasEmoji(str) {
		return str.match(/(\ud83c[\udf00-\udfff]|\ud83d[\udc00-\ude4f]|\ud83d[\ude80-\udeff])/g);
	},
	_setStorage: function(key, data) {
		let time = 0;

		function setData(sdata) {
			if (time < 3) {
				time += 1;
				try {
					wx.setStorageSync(key, sdata);
				} catch (error) {
					setData(sdata);
				}
			}
		}
		setData(data);
	},
	/**
	 * 传入的金额单位都为分，经过次接口转出为元。
	 * */
	formatMoney(value) {
		value = value / 100; //
		let money = Number(value).toFixed(2).replace(/^(\d*).(\d*)/, (...args) => args[1].replace(
			/\B(?=(?:\d{3})+$)/g, ',') + '.' + args[2]);
		return money
	},
	/**
	 * 转化URL和参数 生成returnURL，只针对上级页面需要的参数
	 * url：当前页面URL
	 * preParams：上个页面的URL
	 * */
	getParams4url(params) {
		if (params) {
			let str = decodeURIComponent(params)
			return JSON.parse(str)
		} else {
			return {}
		}
	},
	setParams4url(params) {
		return encodeURIComponent(JSON.stringify(params))
	},
	/**
	 * 获取当前月的第一天
	 * 返回格式: YYYY-mm-dd
	 *    例子: 当日为: 2020-11-27
	 *      返回日期为: 2020-11-01
	 * */
	getCurrentMonthFirstDay(date1) {
		let date = new Date(date1);
		date.setDate(1);
		let month = parseInt(date.getMonth() + 1);
		let day = date.getDate();
		if (month < 10) {
			month = '0' + month
		}
		if (day < 10) {
			day = '0' + day
		}
		return date.getFullYear() + '-' + month + '-' + day;
	},

	/**
	 * 获取当前月的最后一天
	 * 返回格式: YYYY-mm-dd
	 *    例子: 当日为: 2020-11-27
	 *      返回日期为: 2020-11-30
	 * */
	getCurrentMonthLastDay(date1) {
		let date = new Date(date1);
		let currentMonth = date.getMonth();
		let nextMonth = ++currentMonth;
		let nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
		let oneDay = 1000 * 60 * 60 * 24;
		let lastTime = new Date(nextMonthFirstDay - oneDay);
		let month = parseInt(lastTime.getMonth() + 1);
		let day = lastTime.getDate();
		if (month < 10) {
			month = '0' + month
		}
		if (day < 10) {
			day = '0' + day
		}
		return date.getFullYear() + '-' + month + '-' + day;
	}
}

Vue.prototype.$tools = tools
module.exports = tools
