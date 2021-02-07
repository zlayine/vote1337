import Vue from 'vue'
import Vuex from "vuex";
import { routes } from './routes';
import VueRouter from "vue-router";
import StoreData from './store';
import Vuetify from 'vuetify';
import App from './App.vue'
import 'vuetify/dist/vuetify.min.css';

Vue.config.productionTip = false

export default new Vuetify({
	icons: {
		iconfont: 'mdi',
	},
})

Vue.use(Vuetify);
Vue.use(Vuex);
Vue.use(VueRouter);

const store = new Vuex.Store(StoreData);

const router = new VueRouter({
	routes,
	mode: 'history'
});

new Vue({
	router,
	store,
	vuetify: new Vuetify(),
	render: h => h(App)
}).$mount('#app')
