<template>
  <div>
    <!-- File Upload Area -->
    <div class="mb-6">
      <input
        ref="fileInput"
        type="file"
        accept=".pdf"
        @change="handleFileUpload"
        class="hidden"
      />
      <div
        @click="triggerFileInput"
        @dragover.prevent
        @drop.prevent="handleDrop"
        class="p-5 w-full h-24 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 flex flex-col items-center justify-center"
        :class="uploadAreaClasses"
      >
        <div class="text-3xl mb-1" :class="uploadIconClasses">+</div>
        <div class="text-sm font-medium" :class="uploadTextClasses">
          {{ $t(uploadTextKey) }}
        </div>
      </div>
    </div>

    <!-- Upload Status -->
    <div v-if="isLoading" class="mb-6">
      <div class="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
        <div class="flex items-center justify-center space-x-3">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2"
            :class="loadingSpinnerClasses"
          ></div>
          <div class="text-white font-medium">
            {{ $t(processingTextKey) }}
          </div>
        </div>
        <div class="text-center mt-3">
          <div class="text-sm text-zinc-400">
            {{ uploadedFileName }}
          </div>
        </div>
      </div>
    </div>

    <!-- Files List -->
    <div v-if="files.length > 0" class="mt-6">
      <h3 class="text-lg font-semibold text-white mb-4">
        {{ $t(filesListTitleKey) }}
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="file in files"
          :key="file.id"
          class="bg-zinc-800 rounded-lg p-4 border border-zinc-700"
        >
          <div class="text-center">
            <div class="text-2xl mb-2" :class="fileIconClasses">📄</div>
            <div class="text-sm text-white truncate">{{ file.name }}</div>
            <div class="text-xs text-zinc-400 mt-1">{{ file.size }}</div>
            <div class="text-xs text-zinc-500 mt-1">
              {{ file.date }} {{ file.time }}
            </div>
            <div v-if="file[statusField]" class="text-xs text-green-400 mt-1">
              {{ $t(statusLabelKey) }}
            </div>
          </div>
          <div class="flex justify-center gap-2 mt-3">
            <Button
              type="button"
              @click="$emit('preview', file.name)"
              severity="info"
              size="small"
            >
              {{ $t(previewButtonKey) }}
            </Button>
            <Button
              type="button"
              @click="$emit('delete', file.id)"
              severity="danger"
              size="small"
            >
              {{ $t(deleteButtonKey) }}
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from "primevue/button";
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "@/composables/useToast";

interface FileData {
  id: string;
  name: string;
  size: string;
  date: string;
  time: string;
  hasSignature?: boolean;
  hasTimestamp?: boolean;
  fileContent?: string;
}

interface Props {
  storageKey: string;
  fileType: "sign" | "timestamp";
  uploadTextKey: string;
  processingTextKey: string;
  filesListTitleKey: string;
  statusLabelKey: string;
  previewButtonKey: string;
  deleteButtonKey: string;
  statusField: "hasSignature" | "hasTimestamp";
}

const props = defineProps<Props>();

const emit = defineEmits<{
  preview: [fileName: string];
  delete: [fileId: string];
  fileUploaded: [fileData: FileData, file: File];
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const isLoading = ref(false);
const uploadedFileName = ref("");
const files = ref<FileData[]>([]);

const { success, error, warning } = useToast();
const { t: $t } = useI18n();

const uploadAreaClasses = computed(() => {
  const baseClasses =
    props.fileType === "sign"
      ? "bg-gradient-to-r from-blue-200 to-cyan-200 border-blue-300 hover:from-blue-300 hover:to-cyan-300"
      : "bg-gradient-to-r from-pink-200 to-purple-200 border-pink-300 hover:from-pink-300 hover:to-purple-300";

  return `${baseClasses} ${
    isLoading.value ? "pointer-events-none opacity-50" : ""
  }`;
});

const uploadIconClasses = computed(() => {
  return props.fileType === "sign" ? "text-blue-600" : "text-pink-600";
});

const uploadTextClasses = computed(() => {
  return props.fileType === "sign" ? "text-blue-700" : "text-pink-700";
});

const loadingSpinnerClasses = computed(() => {
  return props.fileType === "sign" ? "border-blue-500" : "border-pink-500";
});

const fileIconClasses = computed(() => {
  return props.fileType === "sign" ? "text-blue-500" : "text-red-500";
});

const saveToLocalStorage = async (fileData: FileData, file: File) => {
  const base64 = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });

  const fileDataWithContent = {
    ...fileData,
    fileContent: base64,
  };

  const existingFiles = JSON.parse(
    localStorage.getItem(props.storageKey) || "[]"
  );
  existingFiles.push(fileDataWithContent);
  localStorage.setItem(props.storageKey, JSON.stringify(existingFiles));
};

const loadFromLocalStorage = () => {
  const savedFiles = JSON.parse(localStorage.getItem(props.storageKey) || "[]");
  files.value = savedFiles;
};

const removeFromLocalStorage = (fileId: string) => {
  const existingFiles = JSON.parse(
    localStorage.getItem(props.storageKey) || "[]"
  );
  const updatedFiles = existingFiles.filter(
    (file: FileData) => file.id !== fileId
  );
  localStorage.setItem(props.storageKey, JSON.stringify(updatedFiles));
  files.value = updatedFiles;
};

const showNotification = (
  message: string,
  type: "success" | "error" | "warning" = "success"
) => {
  if (type === "success") {
    success(message);
  } else if (type === "error") {
    error(message);
  } else if (type === "warning") {
    warning(message);
  }
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const isFileAlreadyExists = (fileName: string): boolean => {
  return files.value.some((file) => file.name === fileName);
};

const getAllStoredFiles = (): FileData[] => {
  const signedFiles = JSON.parse(localStorage.getItem("signedFiles") || "[]");
  const timestampedFiles = JSON.parse(
    localStorage.getItem("timestampedFiles") || "[]"
  );
  return [...signedFiles, ...timestampedFiles];
};

const checkArchiveLimit = (): boolean => {
  const allFiles = getAllStoredFiles();
  return allFiles.length >= 10;
};

const checkStorageLimit = (newFileSize: number): boolean => {
  const allFiles = getAllStoredFiles();

  let totalSize = 0;
  allFiles.forEach((file) => {
    if (file.fileContent) {
      const base64Length = file.fileContent.length;
      const padding = (file.fileContent.match(/=/g) || []).length;
      const sizeInBytes = (base64Length * 3) / 4 - padding;
      totalSize += sizeInBytes;
    }
  });

  const currentSizeInMB = totalSize / (1024 * 1024);
  const newFileSizeInMB = newFileSize / (1024 * 1024);

  return currentSizeInMB + newFileSizeInMB > 1024;
};

const validateFile = (file: File): string | null => {
  if (file.type !== "application/pdf") {
    return $t(`${props.fileType}.onlyPdfFiles`);
  }
  if (checkArchiveLimit()) {
    return $t(`${props.fileType}.fileLimitReached`);
  }
  if (checkStorageLimit(file.size)) {
    return $t(`${props.fileType}.storageLimitReached`);
  }
  if (isFileAlreadyExists(file.name)) {
    return $t(`${props.fileType}.fileAlreadyExists`);
  }

  return null;
};

const processFile = async (file: File) => {
  isLoading.value = true;
  uploadedFileName.value = file.name;

  const now = new Date();
  const fileId = Date.now().toString();
  const fileSize = (file.size / 1024 / 1024).toFixed(2) + " MB";
  const fileData: FileData = {
    id: fileId,
    name: file.name,
    size: fileSize,
    date: now.toLocaleDateString("tr-TR"),
    time: now.toLocaleTimeString("tr-TR"),
    [props.statusField]: false,
  };

  files.value.push(fileData);
  await saveToLocalStorage(fileData, file);

  await new Promise((resolve) => setTimeout(resolve, 2000));

  isLoading.value = false;
  emit("fileUploaded", fileData, file);
};

const validateAndProcessFile = async (file: File) => {
  const validationError = validateFile(file);

  if (validationError) {
    const isWarning = validationError.includes("fileAlreadyExists");
    showNotification(validationError, isWarning ? "warning" : "error");
    return;
  }

  await processFile(file);
};

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    await validateAndProcessFile(file);
  }
};

const handleDrop = async (event: DragEvent) => {
  const droppedFiles = event.dataTransfer?.files;
  if (droppedFiles && droppedFiles.length > 0) {
    const file = droppedFiles[0];
    if (file) {
      await validateAndProcessFile(file);
    }
  }
};

const deleteFile = (fileId: string) => {
  removeFromLocalStorage(fileId);
};

const getFileContent = (fileName: string): string | null => {
  const existingFiles = JSON.parse(
    localStorage.getItem(props.storageKey) || "[]"
  );
  const fileData = existingFiles.find(
    (file: FileData) => file.name === fileName
  );
  return fileData?.fileContent || null;
};

const updateFileStatus = (fileName: string, status: boolean) => {
  const existingFiles = JSON.parse(
    localStorage.getItem(props.storageKey) || "[]"
  );
  const updatedFiles = existingFiles.map((file: FileData) => {
    if (file.name === fileName) {
      return { ...file, [props.statusField]: status };
    }
    return file;
  });
  localStorage.setItem(props.storageKey, JSON.stringify(updatedFiles));
  files.value = updatedFiles;
};

defineExpose({
  deleteFile,
  getFileContent,
  updateFileStatus,
});

onMounted(() => {
  loadFromLocalStorage();
});
</script>