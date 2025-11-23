import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AllUsersView from "@/views/AllUsersView.vue";
import ProfileView from "@/views/ProfileView.vue";
import RegisterView from "@/views/RegisterView.vue";
import ProductView from "@/views/ProductView.vue";
import LogInView from "@/views/LogInView.vue";
import ProductDetailView from "@/views/ProductDetailView.vue"; // -> Kristini lisatud

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
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: "/all-products",
      name: "all-products",
      component: ProductView // temp
    },
    {
      path: "/products/:id",  // ← Kristini lisatud
      name: "productDetail",
      component: ProductDetailView,
      props: true
    },
    {
    },
    {
      path: "/users/:id",
      name: "profile",
      component: ProfileView,
      props: true

    },
    {
      path: "/login",
      name: "login",
      component: () => import('../views/LogInView.vue')
    }
  ],
})

export default router
