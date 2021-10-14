// eslint-disable-next-line import/prefer-default-export
export const UserModule = {
  namespaced: true,
  state: {
    user: null,
    scrollList: null,
    selectedScroll: null,
    dialog: 'Welcome to Mona\'s shop',
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_SCROLL_LIST(state, list) {
      state.user = list;
    },
    SET_SCROLL_SELECTED(state, scroll) {
      state.user = scroll;
    },
  },
  actions: {
    setUser({ commit }, user) {
      commit('SET_USER', user);
    },
    setScrolls({ commit }, user) {
      commit('SET_SCROLL_LIST', user);
    },
    setSelectedScroll({ commit }, user) {
      commit('SET_SCROLL_SELECTED', user);
    },
  },
  modules: {},
};
