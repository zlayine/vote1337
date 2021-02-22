import Vue from 'vue'
import Vuex from "vuex";
import { routes } from './routes';
import VueRouter from "vue-router";
import StoreData from './store';
import Vuetify from 'vuetify';
import VueTour from 'vue-tour'
import App from './App.vue'
import 'vuetify/dist/vuetify.min.css';
import '@fortawesome/fontawesome-free/css/all.css'
import 'vue-tour/dist/vue-tour.css'

import { initialize } from './auth.js'

Vue.config.productionTip = false

export default new Vuetify({
	icons: {
		iconfont: 'fa',
	},
})

Vue.use(Vuetify);
Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(VueTour)

const store = new Vuex.Store(StoreData);

const router = new VueRouter({
	routes,
	mode: 'history',
	scrollBehavior(to, from, savedPosition) {
		return { x: 0, y: 0 }
	}
});

initialize(store, router);

new Vue({
	router,
	store,
	vuetify: new Vuetify(),
	render: h => h(App)
}).$mount('#app')
