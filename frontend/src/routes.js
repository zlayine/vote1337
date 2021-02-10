import Home from './pages/Home.vue'
import Auth from './pages/Auth.vue'
import AddMeal from './pages/AddMeal.vue'

export const routes = [
    {
        path: "/",
        component: Home,
        meta: {
            requiresAuth: true,
        }
    },
    {
        path: "/addmeal",
        component: AddMeal,
        meta: {
            requiresAuth: true,
        }
    },
    {
        path: "/auth",
        component: Auth,
        meta: {
            requiresAuth: false,
        }
    },
];