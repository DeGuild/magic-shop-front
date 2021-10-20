// eslint-disable-next-line import/prefer-default-export
export const UserModule = {
  namespaced: true,
  state: {
    user: null,
    owner: false,
    scrollList: null,
    approval: false,
    selectedScroll: null,
    scrollToFetch: null,
    fetching: false,
    dialog: "Welcome to Mona's shop",
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_APPROVAL(state, status) {
      state.approval = status;
    },
    SET_OWNER(state, bool) {
      state.owner = bool;
    },
    SET_SCROLL_LIST(state, list) {
      state.scrollList = list;
    },
    SET_SCROLL_SELECTED(state, scroll) {
      state.selectedScroll = scroll;
    },
    SET_SCROLL_TO_FETCH(state, scroll) {
      state.scrollToFetch = scroll;
    },
    SET_DIALOG(state, text) {
      state.dialog = text;
    },
    SET_FETCHING(state, bool) {
      state.fetching = bool;
    },
  },
  actions: {
    reset({ commit }) {
      commit('SET_USER', null);
      commit('SET_OWNER', false);
      commit('SET_SCROLL_LIST', null);
      commit('SET_SCROLL_SELECTED', null);
      commit('SET_SCROLL_TO_FETCH', null);
      commit('SET_DIALOG', "Welcome to Mona's shop");
    },
    setUser({ commit }, user) {
      commit('SET_USER', user);
    },
    setApproval({ commit }, status) {
      commit('SET_APPROVAL', status);
    },
    setOwner({ commit }, bool) {
      commit('SET_OWNER', bool);
    },
    setFetching({ commit }, bool) {
      commit('SET_FETCHING', bool);
    },
    setMagicScrolls({ commit }, scrolls) {
      commit('SET_SCROLL_LIST', scrolls);
    },
    setSelectedMagicScroll({ commit }, scroll) {
      commit('SET_SCROLL_SELECTED', scroll);
    },
    setMagicScrollToFetch({ commit }, scroll) {
      commit('SET_SCROLL_TO_FETCH', scroll);
    },
  },
  modules: {},
};
