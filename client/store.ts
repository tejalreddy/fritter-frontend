import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    filter: null, // Username to filter shown freets by (null = show all)
    freets: [], // All freets created in the app
    username: null, // Username of the logged in user
    likes: [], // freets the current logged in user has liked
    following: [], // users the user is following
    followers: [], // users who follow the user
    alerts: {}, // global success/error messages encountered during submissions to non-visible forms
    begin_time: null,
    categories: [], // the user's categories
    insightsData: [], // data for the insights chart
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    updateFilter(state, filter) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to fitler freets by
       */
      state.filter = filter;
    },
    updateFreets(state, freets) {
      /**
       * Update the stored freets to the provided freets.
       * @param freets - Freets to store
       */
      state.freets = freets;
    },
    async refreshFreets(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = state.filter ? `/api/users/${state.filter}/freets` : '/api/freets';
      const res = await fetch(url).then(async r => r.json());
      state.freets = res;
    },
    async refreshLikes(state) {
      /**
       * Update if a user likes or dislikes a freet
       */
      if (state.username !== null) {
        const url = '/api/users/session'
        const res = await fetch(url).then(async r => r.json());
        state.likes = res.user.likes;
      }
    },
    async refreshFollows(state) {
      /**
       * Update if a user likes or dislikes a freet
       */
       if (state.username !== null) {
        const url = '/api/users/session'
        const res = await fetch(url).then(async r => r.json());
        state.following = res.user.following;
        state.followers = res.user.followers;
       }
    },
    async setBeginTime(state) {
      /**
       * Set the current beginning time of a user using the platform
       */
       if (state.username !== null) {
        state.begin_time = Date.now();
       }
    },
    async refreshCategories(state) {
      /**
       * Get all of a user's categories
       */
       if (state.username !== null) {
        const url = '/api/categories'
        const res = await fetch(url).then(async r => r.json());
        state.categories = res
       }
    },

    async getInsightsData(state) {
      if (state.username !== null) {
        const url = '/api/insights'
        const res = await fetch(url).then(async r => r.json());
        state.insightsData = res;
      }
    }
  },
  getters: {
    getUserFreets: state => {
      return state.freets.filter(freet => freet.author === state.username);
    }
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
