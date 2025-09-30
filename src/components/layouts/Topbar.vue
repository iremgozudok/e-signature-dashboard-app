<template>
  <div
    class="sticky top-0 z-40 bg-[#121212] shadow-sm border-b border-zinc-800 px-6 py-4 flex justify-between items-center"
  >
    <div class="flex items-center">
      <button
        @click="toggleSidebar"
        class="lg:hidden mr-3 p-2 text-gray-300 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
      >
        <i class="pi pi-bars text-lg"></i>
      </button>
      <img
        src="/logo.png"
        alt="Logo"
        class="h-8 w-auto mr-3 cursor-pointer hover:opacity-80 transition-opacity"
        @click="goToDashboard"
      />
    </div>

    <div class="flex items-center space-x-4">
      <div class="relative">
        <button
          @click="toggleLanguage"
          class="flex items-center space-x-2 lg:px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
          :title="$t('language.switchTo')"
        >
          <i class="pi pi-globe text-sm"></i>
          <span class="font-semibold">{{
            currentLanguage === "tr" ? "TR" : "EN"
          }}</span>
        </button>
      </div>

      <div class="relative">
        <button
          @click="toggleUserMenu"
          class="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
        >
          <div
            class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center"
          >
            <i class="pi pi-user text-white text-sm"></i>
          </div>
          <span class="hidden lg:block"
            >{{ userStore.user.firstName }} {{ userStore.user.lastName }}</span
          >
        </button>

        <div
          v-if="showUserMenu"
          class="absolute right-0 mt-2 w-48 bg-zinc-900 rounded-md shadow-lg py-1 z-50 border border-zinc-600"
        >
          <a
            href="#"
            @click="goToProfile"
            class="block px-4 py-2 text-sm text-gray-300 hover:bg-zinc-800 hover:text-white cursor-pointer"
            >{{ $t("user.profile") }}</a
          >
          <hr class="my-1" />
          <button
            @click="logout"
            class="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-zinc-800 hover:text-red-300"
          >
            {{ $t("user.logout") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useUserStore } from "../../stores/user";

const router = useRouter();
const { locale } = useI18n();
const userStore = useUserStore();
const showUserMenu = ref(false);
const currentLanguage = ref(locale.value);

const toggleSidebar = () => {
  const sidebar = document.querySelector(".sidebar");
  if (sidebar) {
    sidebar.classList.toggle("sidebar-open");
  }
};

const toggleLanguage = () => {
  const newLocale = currentLanguage.value === "tr" ? "en" : "tr";
  currentLanguage.value = newLocale;
  locale.value = newLocale;
  localStorage.setItem("language", newLocale);
};

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

const goToDashboard = () => {
  router.push("/dashboard");
};

const goToProfile = () => {
  router.push("/profile-settings");
  showUserMenu.value = false;
};

const logout = () => {
  userStore.logout();
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  router.push("/login");
  showUserMenu.value = false;
};

const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".relative")) {
    showUserMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>