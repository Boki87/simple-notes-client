import { createStore } from "vuex";
import { api } from "../api";

export default createStore({
  state() {
    return {
      authenticated: false,
      user: null,
    };
  },
  getters: {
    authenticated(state) {
      return state.authenticated;
    },
    user(state) {
      return state.user;
    },
  },
  mutations: {
    SET_AUTHENTICATED(state, authenticated) {
      state.authenticated = authenticated;
    },
    SET_USER(state, user) {
      state.user = user;
    },
  },
  actions: {
    async login({ commit }, payload) {
      await api.get("/sanctum/csrf-cookie");
      const res = await api.post("/api/login", payload);
      let data = res.data;
      localStorage.setItem("simple-notes-token", data.token);
      commit("SET_AUTHENTICATED", true);
      commit("SET_USER", data.user);
    },

    async register({ commit }, payload) {
      await api.get("/sanctum/csrf-cookie");
      const res = await api.post("/api/register", payload);
      let data = res.data;
      localStorage.setItem("simple-notes-token", data.token);
      commit("SET_AUTHENTICATED", true);
      commit("SET_USER", data.user);
    },

    autoLogin({ commit }) {
      return api
        .get("/api/me")
        .then((res) => {
          let data = res.data;
          localStorage.setItem("simple-notes-token", data.token);
          commit("SET_AUTHENTICATED", true);
          commit("SET_USER", data.user);
        })
        .catch((err) => {
          localStorage.removeItem("simple-notes-token");
        });
    },

    logOut({ commit }) {
      return api
        .post("/api/logout")
        .then((res) => {
          localStorage.removeItem("simple-notes-token");
          commit("SET_AUTHENTICATED", false);
          commit("SET_USER", null);
        })
        .catch((err) => {
          localStorage.removeItem("simple-notes-token");
        });
    },
  },
});
