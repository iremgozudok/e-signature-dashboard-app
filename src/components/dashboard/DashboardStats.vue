<template>
  <div
    class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-8"
  >
    <div
      class="bg-gradient-to-br from-pink-200 to-pink-300 rounded-2xl p-4 sm:p-6 xl:p-8 shadow-lg border-2 border-pink-400 h-28 sm:h-32"
    >
      <div class="flex items-center justify-between h-full">
        <div class="flex flex-col">
          <span class="text-gray-600 text-sm sm:text-base">{{
            $t("dashboard.totalSigning")
          }}</span>
          <span class="text-gray-700 font-semibold text-base sm:text-lg"
            >0</span
          >
        </div>
        <div
          class="bg-pink-100 rounded-full p-2 sm:p-3 lg:p-4 flex items-center justify-center"
        >
          <i
            class="pi pi-pencil text-2xl sm:text-3xl xl:text-4xl text-pink-600"
          ></i>
        </div>
      </div>
    </div>

    <div
      class="bg-gradient-to-br from-blue-200 to-blue-300 rounded-2xl p-4 sm:p-6 xl:p-8 shadow-lg border-2 border-blue-400 h-28 sm:h-32"
    >
      <div class="flex items-center justify-between h-full">
        <div class="flex flex-col">
          <span class="text-gray-600 text-sm sm:text-base">{{
            $t("dashboard.archiveRecord")
          }}</span>
          <span class="text-gray-700 font-semibold text-base sm:text-lg">{{
            archiveCount
          }}</span>
        </div>
        <div
          class="bg-blue-100 rounded-full p-2 sm:p-3 lg:p-4 flex items-center justify-center"
        >
          <i
            class="pi pi-file text-2xl sm:text-3xl xl:text-4xl text-blue-600"
          ></i>
        </div>
      </div>
    </div>

    <div
      class="bg-gradient-to-br from-green-200 to-green-300 rounded-2xl p-4 sm:p-6 xl:p-8 shadow-lg border-2 border-green-400 h-28 sm:h-32"
    >
      <div class="flex items-center justify-between h-full">
        <div class="flex flex-col">
          <span class="text-gray-600 text-sm sm:text-base">{{
            $t("dashboard.remainingCredits")
          }}</span>
          <span class="text-gray-700 font-semibold text-base sm:text-lg">{{
            remainingCredits
          }}</span>
        </div>
        <div
          class="bg-green-100 rounded-full p-2 sm:p-3 lg:p-4 flex items-center justify-center"
        >
          <i
            class="pi pi-credit-card text-2xl sm:text-3xl xl:text-4xl text-green-600"
          ></i>
        </div>
      </div>
    </div>

    <div
      class="bg-gradient-to-br from-purple-200 to-purple-300 rounded-2xl p-4 sm:p-6 xl:p-8 shadow-lg border-2 border-purple-400 h-28 sm:h-32"
    >
      <div class="flex items-center justify-between h-full">
        <div class="flex flex-col">
          <span class="text-gray-600 text-sm sm:text-base">{{
            $t("dashboard.storageSpace")
          }}</span>
          <span class="text-gray-700 font-semibold text-base sm:text-lg"
            >{{ usedStorage }} / 1024 Mb</span
          >
        </div>
        <div
          class="bg-purple-100 rounded-full p-2 sm:p-3 lg:p-4 flex items-center justify-center"
        >
          <i
            class="pi pi-cloud text-2xl sm:text-3xl xl:text-4xl text-purple-600"
          ></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t: $t } = useI18n();

interface Props {
  archiveCount: number;
  remainingCredits: number;
  usedStorage: number;
}

defineProps<Props>();
</script>