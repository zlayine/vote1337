import Home from './pages/Home.vue'
import Auth from './pages/Auth.vue'
import AddMeal from './pages/AddMeal.vue'
import NotFound from './pages/NotFound.vue'

export const routes = [
	{
		path: "/",
		name: "home",
		component: Home,
		meta: {
			requiresAuth: true,
		}
	},
	{
		path: "/addmeal",
		name: "addmeal",
		component: AddMeal,
		meta: {
			requiresAuth: true,
		}
	},
	{
		path: "/auth",
		name: "auth",
		component: Auth,
		meta: {
			requiresAuth: false,
		}
	},
	{
		path: "*",
		component: NotFound,
	}
];