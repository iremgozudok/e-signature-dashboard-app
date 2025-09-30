<template>
  <div class="p-6">
    <div class="bg-zinc-900 rounded-lg shadow-sm p-6 border border-zinc-700">
      <DashboardStats
        :archive-count="archiveCount"
        :remaining-credits="remainingCredits"
        :used-storage="usedStorage"
      />
      <DashboardActions
        @navigate-to-sign="navigateToSign"
        @navigate-to-timestamp="navigateToTimestamp"
      />
      <DashboardTable
        :timestamped-files="timestampedFiles"
        :loading="loading"
        @preview-file="previewFile"
        @download-file="downloadFile"
        @open-delete-modal="openDeleteModal"
      />
    </div>
  </div>

  <PdfPreviewModal
    v-model:visible="showPreviewModal"
    :file-src="previewFileSrc"
    :file-name="previewFileName"
    :title="$t('dashboard.pdfPreview')"
    :close-button-text="$t('dashboard.close')"
    @close="closePreviewModal"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import PdfPreviewModal from "../components/PdfPreviewModal.vue";
import DashboardStats from "../components/dashboard/DashboardStats.vue";
import DashboardActions from "../components/dashboard/DashboardActions.vue";
import DashboardTable from "../components/dashboard/DashboardTable.vue";

import { useToast } from "@/composables/useToast";
import { useConfirm } from "primevue/useconfirm";

interface TimestampedFile {
  id: string;
  name: string;
  size: string;
  date: string;
  time: string;
  hasTimestamp: boolean;
  fileContent?: string;
}

const router = useRouter();
const { t: $t } = useI18n();
const { success, error } = useToast();
const confirm = useConfirm();

const timestampedFiles = ref<TimestampedFile[]>([]);
const loading = ref(false);
const selectedFile = ref<TimestampedFile | null>(null);
const showPreviewModal = ref(false);
const previewFileName = ref("");
const previewFileSrc = ref<string | null>(null);
const archiveCount = ref(0);
const remainingCredits = ref(10);
const usedStorage = ref(0);

const loadTimestampedFiles = () => {
  const saved = localStorage.getItem("timestampedFiles");
  if (saved) {
    timestampedFiles.value = JSON.parse(saved);
  }
};

const calculateArchiveCount = () => {
  const signedFiles = JSON.parse(localStorage.getItem("signedFiles") || "[]");
  const timestampedFiles = JSON.parse(
    localStorage.getItem("timestampedFiles") || "[]"
  );
  archiveCount.value = signedFiles.length + timestampedFiles.length;
  remainingCredits.value = Math.max(0, 10 - archiveCount.value);

  let totalSize = 0;
  [...signedFiles, ...timestampedFiles].forEach((file) => {
    if (file.fileContent) {
      const base64Length = file.fileContent.length;
      const padding = (file.fileContent.match(/=/g) || []).length;
      const sizeInBytes = (base64Length * 3) / 4 - padding;
      totalSize += sizeInBytes;
    }
  });

  usedStorage.value = Math.round((totalSize / (1024 * 1024)) * 100) / 100;
};

const openDeleteModal = (file: TimestampedFile) => {
  selectedFile.value = file;
  confirm.require({
    message: `${file.name} ${$t("dashboard.deleteConfirm")}`,
    header: $t("modal.deleteFileTitle"),
    icon: "pi pi-exclamation-triangle",
    acceptLabel: $t("modal.confirmText"),
    rejectLabel: $t("modal.cancelText"),
    acceptClass: "p-button-danger",
    rejectClass: "p-button-secondary",
    accept: () => {
      deleteFile();
    },
    reject: () => {
      selectedFile.value = null;
    },
  });
};

const deleteFile = () => {
  if (selectedFile.value) {
    const index = timestampedFiles.value.findIndex(
      (f) => f.id === selectedFile.value!.id
    );
    if (index !== -1) {
      timestampedFiles.value.splice(index, 1);
      localStorage.setItem(
        "timestampedFiles",
        JSON.stringify(timestampedFiles.value)
      );
      calculateArchiveCount();

      success($t("toast.deleteSuccess"));
    } else {
      error($t("toast.deleteError"));
    }
  }
  selectedFile.value = null;
};

const previewFile = async (fileName: string) => {
  const fileData = timestampedFiles.value.find(
    (file) => file.name === fileName
  );

  if (fileData && fileData.fileContent) {
    previewFileName.value = fileName;
    previewFileSrc.value = fileData.fileContent;
    showPreviewModal.value = true;
  } else {
    error($t("toast.fileContentNotFound"));
  }
};

const closePreviewModal = () => {
  showPreviewModal.value = false;
  previewFileName.value = "";
  previewFileSrc.value = null;
};

const downloadFile = (file: TimestampedFile) => {
  if (file.fileContent) {
    const blob = new Blob([file.fileContent], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = file.name || "download.pdf";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    success($t("toast.fileDownloaded"));
  } else {
    error($t("toast.fileContentNotFound"));
  }
};

const navigateToSign = () => {
  router.push("/sign");
};

const navigateToTimestamp = () => {
  router.push("/timestamp");
};

onMounted(() => {
  loadTimestampedFiles();
  calculateArchiveCount();
});
</script>
