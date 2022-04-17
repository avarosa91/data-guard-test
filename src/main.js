import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import routes from '@/router';
import store from '@/store';
import '@/axios';

Vue.config.productionTip = false;

// Install BootstrapVue
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);
Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
