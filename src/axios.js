import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';

Vue.use(VueAxios, axios);

// Headers
axios.defaults.headers.common.Accept = 'application/json';

// Base URL
axios.defaults.baseURL = 'http://localhost:3000';

export default {
  axios,
};
