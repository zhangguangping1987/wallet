import config from './config'
import Vue from 'vue'
const api = {
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
  isPlainObject: function(obj){
    if(!obj || typeof obj != 'object' || obj.nodeType || (obj == obj.window)){
      return false;
    }
    return Object.prototype.toString.call(obj) === '[object Object]';
  },
  // 是否为纯数组
  isArray: Array.isArray || function(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  },
  // 是否为函数
  isFunction: function(obj){
    return typeof obj === 'function';
  },
  /**
     * 封装 wx.request：
     *【配置参数】：
     * 支持原 wx.request 所有 config，新增
     * info ：请求信息，用于错误/正确信息提示（格式：[动词]+[操作项]，如：获取文章列表，保存科室信息...）
     * showSuccess ：接口调用成功时，是否显示成功提示框，默认不显示
     * showLoading ：是否显示loading，默认不显示
     * showError ：接口调用失败时，是否显示失败提示框，默认不显示
     */
  request: function (cfg) {
 //    // var token = wx.setStorageSync('token');
 //    // var token = 'ed65141d-ee31-406d-a5a3-0daa74b87f55'
	// var token = '6afa6183-2d3a-4480-81ac-5aec3e012517'
    var _cfg = this.extend(true, {
      method: cfg.methods|| 'POST',
      info: '',
      showSuccess: false,
      showLoading: true,
      showError: false
    }, cfg);
    _cfg.url = config.base_url + cfg.url
    // _cfg.header = { visitType: '3', Authorization: `Bearer ${wx.getStorageSync('loginInfo') ? wx.getStorageSync('loginInfo')['access_token'] : ''}`, ...cfg.header }
    // _cfg.header = { Authorization: `Bearer ${token}`, ...cfg.header }
	_cfg.success = function(){ _onSuccess.apply(this, Array.prototype.slice.call(arguments))};
    _cfg.fail = function () { _onFail.apply(this, Array.prototype.slice.call(arguments)) };
    _cfg.complete = function () { _onComplete.apply(this, Array.prototype.slice.call(arguments)) };
    if(_cfg.showLoading){
      wx.showLoading({
        title: '请稍候',
        mask: true
      })
    }
    function _onSuccess(resp) {
      if(resp.data.code === 200 || resp.data.code === 0){
        // 请求成功
        if (_cfg.showSuccess){
          wx.showModal({
            title: '成功',
            content: _cfg.info + '成功',
            showCancel: false,
            confirmColor: '#009CDE'
          })
        }
        if(typeof cfg.success === 'function'){
          cfg.success.call(this, resp.data.data);
        }
      } else if (resp.data.code === 301){
        // token失效
          wx.showToast({
            title: '请重新登录！',
            icon: 'none',
            mask: true,
            duration: 2000,
            success:() => {
              setTimeout(() => {
                wx.navigateTo({
                url: '/pages/my-info/auth/auth'
                })
              },2000)
            }
          })
      }else{
		  uni.showModal({
		      title: '提示',
		      content: resp.data.msg,
			  showCancel:false,
		      success:(res)=>{
		          if (res.confirm) {
		            if(cfg.fail){
		             cfg.fail.call(this, resp.data);
		            }
		          } else if (res.cancel) {
		          }
		      }
		  });
	  }
    }

    function _onFail(resp) {
      _triggerFail.apply(this, Array.prototype.slice.call(arguments));
    }

    function _onComplete(resp){
      if(_cfg.showLoading){
        wx.hideLoading();
      }
      if(typeof cfg.complete === 'function'){
        cfg.complete.call(this, resp.data.data);
      }
    }

    function _triggerFail(resp){
      if (_cfg.showError) {
        wx.showModal({
          title: '提示',
          content: _cfg.info ? _cfg.info + '失败' + '，信息：' + resp.data.msg || '无' : resp.data.msg || '网络请求失败',
          showCancel: false,
          confirmColor: '#009CDE'
        });
		uni.showModal({
		    title: '提示',
		    content: _cfg.info ? _cfg.info + '失败' + '，信息：' + resp.data.msg || '无' : resp.data.msg || '网络请求失败',
			showCancel:false,
		    success: function (res) {
		        // if (res.confirm) {
		        //     console.log('用户点击确定');
		        // } else if (res.cancel) {
		        //     console.log('用户点击取消');
		        // }
		    }
		});
      }
      if (typeof cfg.fail === 'function') {
        cfg.fail.call(this, resp.data);
      }
    }
    wx.request(_cfg);
    // console.log(_cfg)
  },
}


Vue.prototype.$api = api
module.exports = api