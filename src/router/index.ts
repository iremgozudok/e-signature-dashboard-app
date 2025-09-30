import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "../stores/user";

import AuthLayout from "../components/layouts/AuthLayout.vue";
import DashboardLayout from "../components/layouts/DashboardLayout.vue";
import LoginPage from "../pages/Login.vue";
import DashboardPage from "../pages/Dashboard.vue";
import SignPage from "../pages/Sign.vue";
import TimestampPage from "../pages/Timestamp.vue";
import ProfileSettingsPage from "../pages/ProfileSettings.vue";
import SignatureSettingsPage from "../pages/SignatureSettings.vue";
import RegisteredRecipientsPage from "../pages/RegisteredRecipients.vue";
import SupportPage from "../pages/Support.vue";

const routes = [
  { path: "/", redirect: "/login" },
  {
    path: "/login",
    component: AuthLayout,
    children: [
      { path: "", component: LoginPage }
    ]
  },
  {
    path: "/dashboard",
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      { path: "", component: DashboardPage }
    ]
  },
  {
    path: "/sign",
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      { path: "", component: SignPage }
    ]
  },
  {
    path: "/timestamp",
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      { path: "", component: TimestampPage }
    ]
  },
  {
    path: "/profile-settings",
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      { path: "", component: ProfileSettingsPage }
    ]
  },
  {
    path: "/signature-settings",
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      { path: "", component: SignatureSettingsPage }
    ]
  },
  {
    path: "/registered-recipients",
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      { path: "", component: RegisteredRecipientsPage }
    ]
  },
  {
    path: "/support",
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      { path: "", component: SupportPage }
    ]
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const userStore = useUserStore();

  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next("/login");
  }
  else if (to.path === "/login" && userStore.isLoggedIn) {
    next("/dashboard");
  } else {
    next();
  }
});

export default router;