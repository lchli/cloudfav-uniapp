import Vue from 'vue'
import App from './App'
import moment from 'moment'
 
// 定义一个全局过滤器实现日期格式化
Vue.filter('datefmt', function (input, fmtstring) {
  return moment.unix(input).format(fmtstring)
})

import VueClipboard from 'vue-clipboard2'
VueClipboard.config.autoSetContainer = true // add this line
Vue.use(VueClipboard)

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App
})

app.$mount();
