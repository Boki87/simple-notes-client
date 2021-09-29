import { createRouter, createWebHistory } from "vue-router";
import store from "../store";

import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import GoogleLogin from "../views/GoogleLogin.vue";
import Register from "../views/Register.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    beforeEnter: (to, from, next) => {
      if (!store.getters.authenticated) {
        return next({ name: "login" });
      }
      return next();
    },
  },
  {
    path: "/login/google",
    name: "login.google",
    component: GoogleLogin,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/register",
    name: "register",
    component: Register,
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
