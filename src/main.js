import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import VueClickAway from "vue3-click-away";
import "./assets/index.css";

const app = createApp(App);

store.dispatch('autoLogin').then(() => {
    app.use(router).use(store).use(VueClickAway).mount("#app");
})
