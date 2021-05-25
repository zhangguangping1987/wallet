import Vue from 'vue'
import App from './App'
import api from './constant/api.js'
import tools from './constant/tools.js'
import uView from "uview-ui";
Vue.use(uView);
Vue.config.productionTip = false
import './static/font/iconfont.js'
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
