<template>
  <div class="p-6">
    <div class="bg-zinc-900 rounded-lg shadow-sm p-6 border border-zinc-700">
      <h2 class="text-2xl font-bold text-white mb-6">
        {{ $t("menu.support") }}
      </h2>

      <Form
        ref="formRef"
        v-slot="$form"
        :initialValues="initialValues"
        :resolver="resolver"
        @submit="submitForm"
        class="space-y-6"
      >
        <div>
          <label class="block text-white text-lg font-medium mb-2">
            {{ $t("support.subject") }}
          </label>
          <p class="text-gray-400 text-sm mb-3">
            {{ $t("support.subjectPlaceholder") }}
          </p>
          <InputText
            name="subject"
            type="text"
            :placeholder="$t('support.subjectPlaceholderText')"
            class="w-full"
            fluid
            required
          />
          <Message
            v-if="$form.subject?.invalid"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $form.subject.error?.message }}
          </Message>
        </div>

        <div>
          <label class="block text-white text-lg font-medium mb-2">
            {{ $t("support.message") }}
          </label>
          <p class="text-gray-400 text-sm mb-3">
            {{ $t("support.messagePlaceholder") }}
          </p>
          <Textarea
            name="message"
            rows="6"
            :placeholder="$t('support.messagePlaceholderText')"
            class="w-full"
            required
          />
          <Message
            v-if="$form.message?.invalid"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $form.message.error?.message }}
          </Message>
        </div>

        <div>
          <label class="block text-white text-lg font-medium mb-2">
            {{ $t("support.screenshot") }}
          </label>
          <p class="text-gray-400 text-sm mb-3">
            {{ $t("support.screenshotInfo") }}
          </p>

          <div
            @click="triggerFileInput"
            @dragover.prevent
            @drop.prevent="handleFileDrop"
            class="border-2 border-dashed border-zinc-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors duration-200"
          >
            <div class="flex flex-col items-center space-y-4">
              <div
                class="w-16 h-16 bg-zinc-700 rounded-full flex items-center justify-center"
              >
                <i class="pi pi-image text-2xl text-gray-400"></i>
              </div>

              <div class="text-gray-300">
                <p class="text-lg font-medium">
                  {{ $t("support.dragDropScreenshot") }}
                </p>
                <p class="text-sm text-gray-400">
                  {{ $t("support.clickToUpload") }}
                </p>
              </div>

              <div class="text-xs text-gray-500 space-y-1">
                <p>{{ $t("support.supportedFormats") }}</p>
                <p>{{ $t("support.maxSize") }}</p>
              </div>
            </div>
          </div>

          <input
            ref="fileInput"
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            @change="handleFileSelect"
            class="hidden"
          />

          <div
            v-if="selectedFile"
            class="mt-4 p-3 bg-zinc-800 rounded-lg border border-zinc-600"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <i class="pi pi-file text-blue-400"></i>
                <span class="text-white text-sm">{{ selectedFile.name }}</span>
                <span class="text-gray-400 text-xs"
                  >({{ formatFileSize(selectedFile.size) }})</span
                >
              </div>
              <button
                type="button"
                @click="removeFile"
                class="text-red-400 hover:text-red-300 transition-colors"
              >
                <i class="pi pi-times"></i>
              </button>
            </div>
          </div>
        </div>

        <div
          v-if="isSubmitted"
          class="flex items-center space-x-3 p-4 bg-green-900/20 border border-green-600 rounded-lg"
        >
          <div
            class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
          >
            <i class="pi pi-check text-white text-xs"></i>
          </div>
          <span class="text-green-400 font-medium">{{
            $t("support.success")
          }}</span>
        </div>

        <div class="flex justify-end">
          <Button
            type="submit"
            :loading="isSubmitting"
            :label="isSubmitting ? $t('support.sending') : $t('support.send')"
            icon="pi pi-send"
          />
        </div>
      </Form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useToast } from "@/composables/useToast";
import { useI18n } from "vue-i18n";
import { Form } from "@primevue/forms";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import Message from "primevue/message";

const { success, error: showError } = useToast();
const { t: $t } = useI18n();
const fileInput = ref<HTMLInputElement>();
const formRef = ref();

const initialValues = {
  subject: "",
  message: "",
};

const resolver = (values: any) => {
  const errors: any = {};

  if (!values.subject || values.subject.trim() === "") {
    errors.subject = { message: $t("support.fillThisField") };
  }

  if (!values.message || values.message.trim() === "") {
    errors.message = { message: $t("support.fillThisField") };
  }

  return errors;
};

const selectedFile = ref<File | null>(null);
const isSubmitting = ref(false);
const isSubmitted = ref(false);

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    validateAndSetFile(file);
  }
};

const handleFileDrop = (event: DragEvent) => {
  const file = event.dataTransfer?.files[0];
  if (file) {
    validateAndSetFile(file);
  }
};

const validateAndSetFile = (file: File) => {
  const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
  if (!allowedTypes.includes(file.type)) {
    showError($t("support.onlyImageFormats"));
    return;
  }

  const maxSize = 2 * 1024 * 1024;
  if (file.size > maxSize) {
    showError($t("support.fileSizeLimit"));
    return;
  }

  selectedFile.value = file;
};

const removeFile = () => {
  selectedFile.value = null;
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const submitForm = async (values: any) => {
  isSubmitting.value = true;
  isSubmitted.value = false;

  try {
    const formData = {
      subject: values.subject,
      message: values.message,
      file: selectedFile.value
        ? {
            name: selectedFile.value.name,
            size: selectedFile.value.size,
            type: selectedFile.value.type,
          }
        : null,
      timestamp: new Date().toISOString(),
    };

    console.log("Hata Raporu Gönderildi:", formData);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    success($t("support.reportSent"), 5000);

    if (formRef.value && formRef.value.reset) {
      formRef.value.reset();
    }
    removeFile();
    isSubmitted.value = true;
  } catch (error) {
    showError($t("support.reportError"));
  } finally {
    isSubmitting.value = false;
  }
};
</script>