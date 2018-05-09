// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store/'
import router from './router'
import iView from 'iview'
import axios from 'axios'
import VueAxios from 'vue-axios'
// import VueResource from 'vue-resource'
import 'iview/dist/styles/iview.css'


Vue.use(iView);
Vue.use(VueAxios, axios)
// Vue.use(VueResource);
// Vue.http.options.emulateJSON = true;//会在请求头里加上Content-Type: application/json。
axios.defaults.withCredentials=true;//用axios发送post请求去登录，能成功返回数据，但是用作权限验证的cookie就是没有保存,经查阅，axios 默认不发送cookie，跨域也是一个原因，需要全局设置
Vue.config.productionTip = false

// Vue.prototype.baseurl='http://xiuxiu.fjtygs.com/xiuxiumanager/';//设置全局的url
Vue.prototype.baseurl='http://120.76.163.131:8083/xiuxiumanager/';//设置全局的url
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

