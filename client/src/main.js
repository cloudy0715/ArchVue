import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import jQuery from 'jquery'
import './../node_modules/bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/js/all'

window.$ = window.jQuery = jQuery

// cytoscape
import cytoscape from "cytoscape";
import dagre from 'cytoscape-dagre';

cytoscape.use( dagre );
Vue.prototype.cytoscape = cytoscape

// BootstrapVue
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

// Import the Auth0 configuration
import { domain, clientId, audience } from "../auth_config.json";

// Import the plugin here
import { Auth0Plugin } from "./auth";

// Install the authentication plugin here
Vue.use(Auth0Plugin, {
  domain,
  clientId,
  audience,
  onRedirectCallback: appState => {
    router.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    );
  }
});

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')