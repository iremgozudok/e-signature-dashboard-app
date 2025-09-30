<template>
  <div class="mt-8">
    <div class="flex justify-between items-center mb-5">
      <h2 class="text-2xl font-bold text-white">
        {{ $t("dashboard.recentArchivedFiles") }}
      </h2>
    </div>

    <div
      class="hidden xl:block bg-zinc-800 rounded-lg p-4 border border-zinc-600"
    >
      <DataTable
        :value="filteredTimestampedFiles"
        :paginator="true"
        :rows="10"
        :rowsPerPageOptions="[5, 10, 20]"
        class="modern-datatable"
        dataKey="id"
        :loading="loading"
        responsiveLayout="scroll"
        tableStyle="min-width: 50rem"
      >
        <template #header>
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-4">
              <div class="bg-zinc-700 p-3 rounded-xl">
                <i class="pi pi-clock text-white text-xl"></i>
              </div>
              <div>
                <p class="text-gray-400 text-sm">
                  <span v-if="globalFilter"
                    >{{ filteredTimestampedFiles.length }}
                    {{ $t("dashboard.results") }}</span
                  >
                  <span v-else
                    >{{ timestampedFiles.length }}
                    {{ $t("dashboard.files") }}</span
                  >
                </p>
              </div>
            </div>
            <div class="relative">
              <IconField iconPosition="left">
                <InputIcon class="pi pi-search text-gray-400" />
                <InputText
                  v-model="globalFilter"
                  :placeholder="$t('dashboard.searchFiles')"
                  class="w-64 pl-10 pr-10 py-2 bg-zinc-700 border border-zinc-600 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
                />
              </IconField>
              <button
                v-if="globalFilter"
                @click="globalFilter = ''"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <i class="pi pi-times text-sm"></i>
              </button>
            </div>
          </div>
        </template>

        <Column
          field="name"
          :header="$t('dashboard.fileName')"
          sortable
          style="width: 30%"
        >
          <template #body="slotProps">
            <div class="flex items-center space-x-3">
              <div
                class="w-10 h-10 bg-zinc-600 rounded-full flex items-center justify-center"
              >
                <i class="pi pi-file-pdf text-white text-sm"></i>
              </div>
              <span class="text-white font-medium">{{
                slotProps.data.name
              }}</span>
            </div>
          </template>
        </Column>

        <Column
          field="date"
          :header="$t('dashboard.date')"
          sortable
          style="width: 20%"
        >
          <template #body="slotProps">
            <div class="bg-zinc-800 rounded-lg p-3">
              <span class="text-white font-medium">{{
                slotProps.data.date
              }}</span>
              <div class="text-gray-400 text-sm">
                {{ slotProps.data.time }}
              </div>
            </div>
          </template>
        </Column>

        <Column
          field="operation"
          :header="$t('dashboard.operation')"
          sortable
          style="width: 20%"
        >
          <template #body>
            <div class="flex items-center space-x-2">
              <i class="pi pi-clock text-zinc-400"></i>
              <span class="text-gray-300">{{
                $t("dashboard.timestampOperation")
              }}</span>
            </div>
          </template>
        </Column>

        <Column
          field="size"
          :header="$t('dashboard.size')"
          sortable
          style="width: 15%"
        >
          <template #body="slotProps">
            <div class="bg-zinc-800 rounded-lg p-3">
              <span class="text-gray-300 text-sm">{{
                slotProps.data.size
              }}</span>
            </div>
          </template>
        </Column>

        <Column
          :header="$t('dashboard.actions')"
          :exportable="false"
          style="width: 15%"
        >
          <template #body="slotProps">
            <div class="flex space-x-2">
              <Button
                icon="pi pi-eye"
                severity="secondary"
                size="small"
                @click="$emit('previewFile', slotProps.data.name)"
                :v-tooltip="$t('dashboard.preview')"
              />
              <Button
                icon="pi pi-download"
                severity="secondary"
                size="small"
                @click="$emit('downloadFile', slotProps.data)"
                :v-tooltip="$t('dashboard.download')"
              />
              <Button
                icon="pi pi-trash"
                severity="danger"
                size="small"
                @click="$emit('openDeleteModal', slotProps.data)"
                :v-tooltip="$t('dashboard.delete')"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Mobile and Tablet Card Layout -->
    <div class="xl:hidden space-y-4">
      <div
        v-for="file in filteredTimestampedFiles"
        :key="file.id"
        class="bg-zinc-700 rounded-lg p-3 sm:p-4 border border-zinc-600"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center space-x-3">
            <div class="flex flex-col items-center">
              <div class="bg-red-500 text-white text-xs px-2 py-1 rounded mb-1">
                PDF
              </div>
              <div
                class="w-6 h-6 bg-red-500 rounded flex items-center justify-center"
              >
                <i class="pi pi-file-pdf text-white text-xs"></i>
              </div>
            </div>

            <div class="flex-1">
              <h3 class="font-bold text-white text-sm sm:text-base">
                {{ file.name }}
              </h3>
              <p class="text-gray-400 text-xs sm:text-sm">
                {{ file.date }} {{ file.time }}
              </p>
            </div>
          </div>
        </div>

        <div class="flex justify-between items-center mb-3">
          <span class="text-gray-400 text-xs sm:text-sm">{{ file.size }}</span>
          <button
            class="bg-green-500 text-white text-xs sm:text-sm px-3 py-1 rounded-full"
          >
            {{ $t("dashboard.timestampOperation") }}
          </button>
        </div>

        <div class="flex space-x-2">
          <button
            @click="$emit('previewFile', file.name)"
            class="flex-1 bg-zinc-600 text-white text-xs sm:text-sm py-2 px-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-zinc-500 transition-colors"
          >
            <i class="pi pi-eye"></i>
            <span>{{ $t("dashboard.preview") }}</span>
          </button>

          <div class="relative">
            <button
              @click="toggleFileMenu(file.id)"
              class="bg-zinc-600 text-white p-2 rounded-lg hover:bg-zinc-500 transition-colors"
            >
              <i class="pi pi-ellipsis-v"></i>
            </button>

            <div
              v-if="activeFileMenu === file.id"
              class="absolute right-0 top-full mt-1 bg-zinc-800 rounded-lg shadow-lg border border-zinc-600 py-1 z-10 min-w-48"
            >
              <button
                @click="$emit('downloadFile', file)"
                class="w-full text-left px-4 py-2 text-sm text-white hover:bg-zinc-700 flex items-center space-x-2"
              >
                <i class="pi pi-download text-gray-400"></i>
                <span>{{ $t("dashboard.download") }}</span>
              </button>
              <button
                @click="$emit('openDeleteModal', file)"
                class="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 flex items-center space-x-2"
              >
                <i class="pi pi-trash text-red-400"></i>
                <span>{{ $t("dashboard.delete") }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";

import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";

interface TimestampedFile {
  id: string;
  name: string;
  size: string;
  date: string;
  time: string;
  hasTimestamp: boolean;
  fileContent?: string;
}

const { t: $t } = useI18n();

interface Props {
  timestampedFiles: TimestampedFile[];
  loading: boolean;
}

const props = defineProps<Props>();

defineEmits<{
  previewFile: [fileName: string];
  downloadFile: [file: TimestampedFile];
  openDeleteModal: [file: TimestampedFile];
}>();

const globalFilter = ref("");
const activeFileMenu = ref<string | null>(null);

const filteredTimestampedFiles = computed(() => {
  if (!globalFilter.value) {
    return props.timestampedFiles;
  }

  const filter = globalFilter.value.toLowerCase();
  return props.timestampedFiles.filter(
    (file) =>
      file.name.toLowerCase().includes(filter) ||
      file.date.toLowerCase().includes(filter) ||
      file.time.toLowerCase().includes(filter) ||
      file.size.toLowerCase().includes(filter)
  );
});

const toggleFileMenu = (fileId: string) => {
  activeFileMenu.value = activeFileMenu.value === fileId ? null : fileId;
};

const closeFileMenu = () => {
  activeFileMenu.value = null;
};

document.addEventListener("click", (e) => {
  if (!(e.target as Element).closest(".relative")) {
    closeFileMenu();
  }
});
</script>

<style scoped>
.modern-datatable :deep(.p-datatable-header) {
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
}
</style>