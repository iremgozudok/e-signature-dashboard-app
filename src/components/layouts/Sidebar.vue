<template>
  <div
    class="sidebar bg-[#121212] w-68 min-h-screen border-r border-zinc-700 pt-6"
    @click="closeSidebarOnOverlay"
  >
    <div class="p-6 flex flex-col h-full" @click.stop>
      <nav class="space-y-2">
        <router-link
          to="/dashboard"
          @click="closeSidebarOnRouteClick"
          class="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-zinc-800 hover:text-white rounded-lg transition-colors"
          :class="{
            'bg-purple-600 text-white border-r-2 border-purple-400':
              $route.path === '/dashboard',
          }"
        >
          <i class="pi pi-home md:text-lg text-sm"></i>
          <span class="font-medium">{{ $t("menu.home") }}</span>
        </router-link>

        <router-link
          to="/sign"
          @click="closeSidebarOnRouteClick"
          class="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-zinc-800 hover:text-white rounded-lg transition-colors"
          :class="{
            'bg-purple-600 text-white border-r-2 border-purple-400':
              $route.path === '/sign',
          }"
        >
          <i class="pi pi-pencil text-sm md:text-lg"></i>
          <span class="font-medium">{{ $t("menu.sign") }}</span>
        </router-link>

        <router-link
          to="/timestamp"
          @click="closeSidebarOnRouteClick"
          class="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-zinc-800 hover:text-white rounded-lg transition-colors"
          :class="{
            'bg-purple-600 text-white border-r-2 border-purple-400':
              $route.path === '/timestamp',
          }"
        >
          <i class="pi pi-clock text-sm md:text-lg"></i>
          <span class="font-medium">{{ $t("menu.timestamp") }}</span>
        </router-link>
      </nav>

      <div class="mt-8 flex-1">
        <h3
          class="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3"
        >
          Ayarlar
        </h3>

        <div class="border-t border-zinc-700 mb-4"></div>

        <nav class="space-y-2">
          <router-link
            to="/profile-settings"
            @click="closeSidebarOnRouteClick"
            class="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-zinc-800 hover:text-white rounded-lg transition-colors"
            :class="{
              'bg-purple-600 text-white border-r-2 border-purple-400':
                $route.path === '/profile-settings',
            }"
          >
            <i class="pi pi-user text-sm md:text-lg"></i>
            <span class="font-medium">{{ $t("menu.profileSettings") }}</span>
          </router-link>

          <router-link
            to="/signature-settings"
            @click="closeSidebarOnRouteClick"
            class="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-zinc-800 hover:text-white rounded-lg transition-colors"
            :class="{
              'bg-purple-600 text-white border-r-2 border-purple-400':
                $route.path === '/signature-settings',
            }"
          >
            <i class="pi pi-pencil text-sm md:text-lg"></i>
            <span class="font-medium">{{ $t("menu.signatureSettings") }}</span>
          </router-link>

          <router-link
            to="/registered-recipients"
            @click="closeSidebarOnRouteClick"
            class="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-zinc-800 hover:text-white rounded-lg transition-colors"
            :class="{
              'bg-purple-600 text-white border-r-2 border-purple-400':
                $route.path === '/registered-recipients',
            }"
          >
            <i class="pi pi-users text-sm md:text-lg"></i>
            <span class="font-medium">{{
              $t("menu.registeredRecipients")
            }}</span>
          </router-link>
        </nav>
      </div>

      <div class="mt-auto pt-4 pb-16 border-t border-zinc-700">
        <nav class="space-y-2">
          <router-link
            to="/support"
            @click="closeSidebarOnRouteClick"
            class="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-zinc-800 hover:text-white rounded-lg transition-colors"
            :class="{
              'bg-purple-600 text-white border-r-2 border-purple-400':
                $route.path === '/support',
            }"
          >
            <i class="pi pi-question-circle text-sm md:text-lg"></i>
            <span class="font-medium">{{ $t("menu.support") }}</span>
          </router-link>

          <button
            @click="logout"
            class="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-900 hover:text-red-300 rounded-lg transition-colors"
          >
            <i class="pi pi-sign-out text-sm md:text-lg"></i>
            <span class="font-medium">{{ $t("user.logout") }}</span>
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useUserStore } from "../../stores/user";

const router = useRouter();
const userStore = useUserStore();

const logout = () => {
  userStore.logout();
  localStorage.clear();
  router.push("/login");
};

const closeSidebarOnOverlay = (event: Event) => {
  const target = event.target as HTMLElement;
  if (target.classList.contains("sidebar")) {
    target.classList.remove("sidebar-open");
  }
};

const closeSidebarOnRouteClick = () => {
  const sidebar = document.querySelector(".sidebar");
  if (sidebar && window.innerWidth < 1024) {
    sidebar.classList.remove("sidebar-open");
  }
};
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 4rem;
  height: calc(100vh - 4rem);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  z-index: 30;
  transform: translateX(-100%);
  transition: transform 0.3s ease-in-out;
}

@media (min-width: 1024px) {
  .sidebar {
    transform: translateX(0);
  }
}

.sidebar.sidebar-open {
  transform: translateX(0);
}

.sidebar.sidebar-open::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: -1;
}
</style>