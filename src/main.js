import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import store from "./components/store";
import axios from "axios";
import VueAxios from "vue-axios";
import i18n from "@/plugins/i18n";
import { LMap, LTileLayer, LMarker } from "vue2-leaflet";
// import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import "leaflet/dist/leaflet.css";

// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);
// Vue.use(BootstrapVue)
// Vue.use(IconsPlugin)
Vue.component("l-map", LMap);
Vue.component("l-tile-layer", LTileLayer);
Vue.component("l-marker", LMarker);

new Vue({
  store,
  vuetify,
  i18n,
  router,
  render: (h) => h(App),
  created() {
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        console.log("error here ",{ error });
        //const eror = { error }.error.response.status;
       // const eror = { error }.error.response.status;
        if( { error }.error.response){
        const statusText = { error }.error.response.statusText;
        store.dispatch("changeShowError", true);
        store.dispatch("changeErrorMsg", [statusText]);
      }else{
        store.dispatch("changeShowError", true);
        store.dispatch("changeErrorMsg", ["internal server error"]);
      }
        return Promise.reject(error);
      }
    );

    // Prevent blank screen in Electron builds
    this.$router.push("/").catch((err) => {
      console.log(err);
    });
  },
}).$mount("#app");
