import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios';
import '@/http/interceptors';
import '@/assets/js/directive';
import '@/assets/css/custom.css';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import '@/components/Global';

import 'viewerjs/dist/viewer.css';
import Viewer from 'v-viewer';

Vue.prototype.$axios = axios;

Vue.use(ElementUI);
Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 9999
  }
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
