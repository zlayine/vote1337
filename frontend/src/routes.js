import Home from './pages/Home.vue'
import Auth from './pages/Auth.vue'
import Reports from './pages/Reports.vue'
import AddMeal from './pages/AddMeal.vue'

export const routes = [
    {
        path: "/",
        component: Home,
        meta: {
            requiresAuth: false,
        }
    },
    {
        path: "/addmeal",
        component: AddMeal,
        meta: {
            requiresAuth: false,
        }
    },
    {
        path: "/auth",
        component: Auth,
        meta: {
            requiresAuth: false,
        }
    },
	{
        path: "/reports",
        component: Reports,
        meta: {
            requiresAuth: true,
        }
    },
];