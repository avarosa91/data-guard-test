import Vue from 'vue';
import axios from 'axios';

Vue.use(axios);

// Headers
axios.defaults.headers.common.Accept = 'application/json';

// Base URL
axios.defaults.baseURL = process.env.VUE_APP_API_URL;

export default {
  axios,
};
