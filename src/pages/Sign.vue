<template>
  <div class="p-6">
    <div class="bg-zinc-900 rounded-lg shadow-sm p-6 border border-zinc-700">
      <h2 class="text-2xl font-bold text-white mb-4">
        {{ $t("menu.sign") }}
      </h2>

      <FileManager
        ref="fileManager"
        storage-key="signedFiles"
        file-type="sign"
        upload-text-key="sign.uploadFiles"
        processing-text-key="sign.processing"
        files-list-title-key="sign.signedFiles"
        status-label-key="sign.signatureAdded"
        preview-button-key="sign.preview"
        delete-button-key="sign.delete"
        status-field="hasSignature"
        @preview="previewFile"
        @delete="deleteFile"
        @file-uploaded="handleFileUploaded"
      />
    </div>
  </div>

  <PdfPreviewModal
    v-model:visible="showPreviewModal"
    :file-src="previewFileSrc"
    :file-name="previewFileName"
    :show-sign-button="true"
    @sign="signDocument"
    @close="closePreviewModal"
  />

  <Dialog
    v-model:visible="showSignErrorModal"
    :header="$t('sign.signerNotFound')"
    :modal="true"
    :closable="true"
    :style="{ width: '400px' }"
    class="p-fluid"
  >
    <div class="text-center mb-6">
      <div class="text-4xl text-red-500 mb-2">⚠️</div>
      <div class="text-zinc-400">
        {{ $t("sign.signerNotFoundMessage") }}
      </div>
    </div>

    <template #footer>
      <Button
        :label="$t('sign.ok')"
        @click="closeSignErrorModal"
        class="p-button-secondary"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import PdfPreviewModal from "../components/PdfPreviewModal.vue";
import FileManager from "../components/FileManager.vue";
import { useToast } from "@/composables/useToast";
import { useConfirm } from "primevue/useconfirm";
import Dialog from "primevue/dialog";
import Button from "primevue/button";

const fileManager = ref();
const fileToDelete = ref<string | null>(null);
const showPreviewModal = ref(false);
const previewFileName = ref("");
const previewFileSrc = ref<string | null>(null);
const showSignErrorModal = ref(false);

const { success, error } = useToast();
const confirm = useConfirm();
const { t: $t } = useI18n();

const handleFileUploaded = (_fileData: any, file: File) => {
  success(`${file.name} ${$t("sign.fileUploadedSuccessfully")}`);
};

const previewFile = async (fileName: string) => {
  if (fileManager.value) {
    const fileContent = fileManager.value.getFileContent(fileName);
    if (fileContent) {
      previewFileName.value = fileName;
      previewFileSrc.value = fileContent;
      showPreviewModal.value = true;
    } else {
      error($t("sign.fileContentNotFound"));
    }
  }
};

const closePreviewModal = () => {
  showPreviewModal.value = false;
  previewFileName.value = "";
  previewFileSrc.value = null;
};

const signDocument = () => {
  showSignErrorModal.value = true;
};

const closeSignErrorModal = () => {
  showSignErrorModal.value = false;
};

const deleteFile = (fileId: string) => {
  fileToDelete.value = fileId;
  confirm.require({
    message: $t("modal.deleteFileMessage"),
    header: $t("modal.deleteFileTitle"),
    icon: "pi pi-exclamation-triangle",
    acceptLabel: $t("modal.confirmText"),
    rejectLabel: $t("modal.cancelText"),
    acceptClass: "p-button-danger",
    rejectClass: "p-button-secondary",
    accept: () => {
      confirmDelete();
    },
    reject: () => {
      fileToDelete.value = null;
    },
  });
};

const confirmDelete = () => {
  if (fileToDelete.value && fileManager.value) {
    fileManager.value.deleteFile(fileToDelete.value);
    fileToDelete.value = null;
    success($t("toast.fileDeleted"));
  }
};
</script>