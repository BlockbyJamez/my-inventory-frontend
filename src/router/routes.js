import { createRouter, createWebHashHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import ForgotPassword from "@/views/ForgotPassword.vue";
import { useAuthStore } from "@/stores/authStore";
import Home from "@/components/Home.vue";
import ProductList from "@/components/ProductList.vue";
import ProductForm from "@/components/ProductForm.vue";
import TransactionView from "@/components/TransactionView.vue";
import PermissionView from "@/components/PermissionView.vue";
import LogView from "@/components/LogView.vue";

const routes = [
  { path: "/login", name: "Login", component: LoginView },
  { path: "/register", name: "Register", component: RegisterView },
  { path: "/forgot-password", component: ForgotPassword },
  { path: "/", name: "Home", component: Home, meta: { requiresAuth: true } },
  {
    path: "/products",
    name: "ProductList",
    component: ProductList,
    meta: { requiresAuth: true },
  },
  {
    path: "/add",
    name: "ProductForm",
    component: ProductForm,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/transactions",
    name: "TransactionView",
    component: TransactionView,
    meta: { requiresAuth: true },
  },
  { path: "/permissions", component: PermissionView },
  { path: "/logs", component: LogView },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.user) {
    next("/login");
  } else if (to.path === "/login" && auth.user) {
    next("/");
  } else if (to.meta.requiresAdmin && auth.user?.role !== "admin") {
    alert("此頁面僅限管理員使用");
    next("/products");
  } else {
    next();
  }
});

export default router;
