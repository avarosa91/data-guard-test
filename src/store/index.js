import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        tabsData: null,
        plugins: null,
    },
    getters: {
        tabData: (state) => state.tabsData ?? {},
        plugins: (state) => state.plugins ?? {},
    },
    mutations: {
        SET_DATA: (state, payload) => {
            Object.entries(payload).forEach(([key, value]) =>
            payload[key].enabledAll = value.disabled.length < value.inactive.length + value.active.length)
            state.tabsData = payload;
        },
        SET_PLUGINS: (state, payload) => {
            state.plugins = payload;
        },
    },
    actions: {
        async fetchTabsData({ commit }) {
            const response = await Vue.axios.get('/tabdata');
            commit('SET_DATA', response.data);
            return response;
        },
        async fetchPlugins({ commit }) {
            const response = await Vue.axios.get('/plugins');
            commit('SET_PLUGINS', response.data);
            return response;
        },
        // eslint-disable-next-line no-unused-vars
        async changeTabsData({ commit }, { payload }) {
            return Vue.axios.post('/tabdata', payload);
        },
    },
});
