import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AllUsersView from "@/views/AllUsersView.vue";
import ProfileView from "@/views/ProfileView.vue";
import RegisterUser from "@/views/RegisterUser.vue";
import ProductView from "@/views/ProductView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: "/all-users",
      name: "all-users",
      component: AllUsersView // temp
    },
    {
      path: "/register",
      name: "register",
      component: RegisterUser // done
    },
    {
      path: "/all-products",
      name: "all-products",
      component: ProductView // temp
    },
    {
      path: "/users/:id",
      name: "users/:id",
      component: ProfileView
    }
  ],
})

export default router
