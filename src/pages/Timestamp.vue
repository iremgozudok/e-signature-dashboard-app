<template>
  <div class="p-6">
    <div class="bg-zinc-900 rounded-lg shadow-sm p-6 border border-zinc-700">
      <h2 class="text-2xl font-bold text-white mb-4">
        {{ $t("menu.timestamp") }}
      </h2>

      <FileManager
        ref="fileManager"
        storage-key="timestampedFiles"
        file-type="timestamp"
        upload-text-key="timestamp.uploadFiles"
        processing-text-key="timestamp.processing"
        files-list-title-key="timestamp.downloadedFiles"
        status-label-key="timestamp.timestampLabel"
        preview-button-key="timestamp.preview"
        delete-button-key="timestamp.delete"
        status-field="hasTimestamp"
        @preview="previewFile"
        @delete="deleteFile"
        @file-uploaded="handleFileUploaded"
      />
    </div>
  </div>

  <Dialog
    v-model:visible="showModal"
    :header="$t('timestamp.timestampCompleted')"
    :modal="true"
    :closable="true"
    :style="{ width: '400px' }"
    class="p-dialog-dark"
    @hide="closeModal"
  >
    <div class="text-center mb-6">
      <div class="text-white font-medium">{{ uploadedFileName }}</div>
    </div>

    <div class="space-y-3">
      <Button
        @click="sendToMe"
        :label="$t('timestamp.sendToMe')"
        class="w-full"
        severity="secondary"
      />
      <Button
        @click="sendToOther"
        :label="$t('timestamp.sendToOther')"
        class="w-full"
        severity="secondary"
      />
      <Button
        @click="downloadFile"
        :label="$t('timestamp.download')"
        class="w-full"
        severity="primary"
      />
    </div>
  </Dialog>

  <PdfPreviewModal
    v-model:visible="showPreviewModal"
    :file-src="previewFileSrc"
    :file-name="previewFileName"
    @close="closePreviewModal"
  />

  <Dialog
    v-model:visible="showRecipientModal"
    :header="$t('timestamp.selectRecipient')"
    :modal="true"
    :closable="true"
    :style="{ width: '600px' }"
    class="p-dialog-dark"
    @hide="closeRecipientModal"
  >
    <div v-if="registeredRecipients.length === 0" class="text-center py-8">
      <div class="text-4xl text-zinc-500 mb-2">📭</div>
      <div class="text-white mb-2">{{ $t("timestamp.noRecipients") }}</div>
      <div class="text-zinc-400 text-sm">
        {{ $t("timestamp.addRecipientsFirst") }}
      </div>
    </div>

    <div v-else class="space-y-3 max-h-96 overflow-y-auto">
      <div
        v-for="recipient in registeredRecipients"
        :key="recipient.id"
        @click="selectRecipient(recipient)"
        class="bg-zinc-800 rounded-lg p-4 border border-zinc-700 cursor-pointer hover:bg-zinc-700 transition-colors"
      >
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="text-white font-medium">
              {{ recipient.recipientName }}
            </div>
            <div class="text-zinc-400 text-sm">{{ recipient.to }}</div>
            <div class="text-zinc-500 text-xs mt-1">
              {{ recipient.subject }}
            </div>
          </div>
          <div class="text-zinc-400">
            <i class="pi pi-arrow-right"></i>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <Button
        @click="closeRecipientModal"
        :label="$t('timestamp.cancel')"
        severity="secondary"
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
const showModal = ref(false);
const uploadedFileName = ref("");
const uploadedFile = ref<File | null>(null);
const fileToDelete = ref<string | null>(null);
const showPreviewModal = ref(false);
const previewFileName = ref("");
const previewFileSrc = ref<string | null>(null);
const showRecipientModal = ref(false);
const registeredRecipients = ref<
  Array<{
    id: number;
    recipientName: string;
    subject: string;
    to: string;
    cc?: string;
    bcc?: string;
    message: string;
  }>
>([]);

const { success, error } = useToast();
const confirm = useConfirm();
const { t: $t } = useI18n();

const loadRegisteredRecipients = () => {
  const saved = localStorage.getItem("registeredRecipients");
  if (saved) {
    registeredRecipients.value = JSON.parse(saved);
  }
};

loadRegisteredRecipients();

const handleFileUploaded = (_fileData: any, file: File) => {
  uploadedFile.value = file;
  uploadedFileName.value = file.name;
  
  if (fileManager.value) {
    fileManager.value.updateFileStatus(file.name, true);
  }
  
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  uploadedFile.value = null;
  uploadedFileName.value = "";
};

const sendToMe = () => {
  success($t("timestamp.fileSentToMe"));
  closeModal();
};

const sendToOther = () => {
  showRecipientModal.value = true;
};

const selectRecipient = (recipient: any) => {
  success(`${$t("timestamp.fileSentToOther")} - ${recipient.recipientName}`);

  showRecipientModal.value = false;
  closeModal();
};

const closeRecipientModal = () => {
  showRecipientModal.value = false;
};

const downloadFile = () => {
  if (uploadedFile.value) {
    const url = URL.createObjectURL(uploadedFile.value);
    const a = document.createElement("a");
    a.href = url;
    a.download = uploadedFile.value.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (fileManager.value) {
      fileManager.value.updateFileStatus(uploadedFile.value.name, true);
    }

    closeModal();
  }
};

const previewFile = async (fileName: string) => {
  if (fileManager.value) {
    const fileContent = fileManager.value.getFileContent(fileName);
    if (fileContent) {
      previewFileName.value = fileName;
      previewFileSrc.value = fileContent;
      showPreviewModal.value = true;
    } else {
      error($t("timestamp.fileContentNotFound"));
    }
  }
};

const closePreviewModal = () => {
  showPreviewModal.value = false;
  previewFileName.value = "";
  previewFileSrc.value = null;
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