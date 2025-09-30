<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    maximizable
    modal
    :header="title || $t('pdfPreview.title')"
    :style="{ width: '80vw', height: '85vh' }"
    :breakpoints="{ '1199px': '90vw', '575px': '95vw' }"
    class="pdf-preview-dialog"
    @hide="closeModal"
  >
    <template #header>
      <div class="flex items-center justify-between w-full">
        <div>
          <h3 class="text-lg font-semibold text-white m-0">
            {{ title || $t("pdfPreview.title") }}
          </h3>
          <div class="text-sm text-gray-300 mt-1">{{ fileName }}</div>
        </div>
      </div>
    </template>

    <div class="pdf-preview-content">
      <div v-if="fileSrc" class="text-center">
        <div class="pdf-viewer-container flex justify-center flex-1">
          <VuePdf
            :src="fileSrc"
            :page="1"
            class="pdf-viewer rounded shadow-lg max-w-full h-auto"
          />
        </div>
      </div>
    </div>

    <template #footer>
      <div class="mt-5">
        <Button
          v-if="showSignButton"
          @click="handleSign"
          :label="signButtonText || $t('pdfPreview.sign')"
          icon="pi pi-pencil"
          class="p-button-sm"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from "vue";

const VuePdf = defineAsyncComponent(() => import("pdf-vue3"));
import { useI18n } from "vue-i18n";
import Dialog from "primevue/dialog";
import Button from "primevue/button";

interface Props {
  visible: boolean;
  fileSrc?: string | null;
  fileName?: string;
  title?: string;
  showSignButton?: boolean;
  signButtonText?: string;
}

const { t: $t } = useI18n();

withDefaults(defineProps<Props>(), {
  visible: false,
  fileSrc: null,
  fileName: "",
  title: "",
  showSignButton: false,
  signButtonText: "",
});

const emit = defineEmits<{
  "update:visible": [value: boolean];
  sign: [];
  close: [];
}>();

const closeModal = () => {
  emit("update:visible", false);
  emit("close");
};

const handleSign = () => {
  emit("sign");
};
</script>