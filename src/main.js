import Vue from 'vue';
import { manager } from '@/services/lc-realtime';
import App from './App';


Vue.config.productionTip = false;
App.mpType = 'app';

Vue.prototype.$bus = new Vue();

const app = new Vue(App);
app.$mount();

const Fly = require('flyio/dist/npm/wx');

Vue.prototype.$http = new Fly();

// Initialize LeanCloud Realtime
manager.setup({
  appId: 'MAt7GaT4VjeOXrHC4NSBuGYP-gzGzoHsz',
  appKey: 'gXiqlO8xkJoheaDY6XrLJtlG',
  region: 'cn', // 美国节点为 "us"
});

export default {
  // 这个字段走 app.json
  config: {
    // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
    pages: [
      '^pages/message/conv-list/main',
      'pages/message/conv/main'],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black',
    },
  },
};
