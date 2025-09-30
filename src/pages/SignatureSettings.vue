<template>
  <div class="p-2 sm:p-4 lg:p-6">
    <div
      class="bg-zinc-900 rounded-lg shadow-sm p-3 sm:p-4 lg:p-6 border border-zinc-700"
    >
      <h2 class="text-2xl font-bold text-white mb-6">
        {{ $t("signature.title") }}
      </h2>
      <div class="mb-8">
        <Button
          @click="showSignatureModal = true"
          class="bg-gray-600 hover:bg-gray-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg border border-gray-500 w-full sm:w-auto"
        >
          {{ $t("signature.uploadOrDraw") }}
        </Button>
        <div v-if="signaturePreview || imagePreview" class="mt-4">
          <h4 class="text-white mb-2">
            {{ $t("signature.signaturePreview") }}
          </h4>
          <div
            class="bg-white rounded-lg p-4 border border-gray-500 inline-block"
          >
            <img
              v-if="signaturePreview"
              :src="signaturePreview"
              alt="İmza Önizleme"
              class="max-h-20"
            />
            <img
              v-if="imagePreview"
              :src="imagePreview"
              alt="Görsel Önizleme"
              class="max-h-20"
            />
          </div>
        </div>
      </div>

      <div class="mb-8">
        <h3 class="text-lg font-semibold text-white mb-2">
          {{ $t("signature.defaultSignatureText") }}
        </h3>
        <p class="text-gray-300 mb-4">
          {{
            isMobile ? $t("signature.touchInfo") : $t("signature.dragDropInfo")
          }}
        </p>

        <div class="flex flex-col lg:flex-row gap-4">
          <div class="flex-1 w-full lg:w-auto">
            <h4 class="text-white mb-2 text-sm font-medium">
              {{ $t("signature.availableOptions") }}
            </h4>
            <div
              class="bg-gray-800 rounded-lg p-3 min-h-[150px] border border-gray-600"
              @dragover="handleDragOver"
              @drop="handleDropLeft"
            >
              <div
                v-for="item in availableTextItems"
                :key="item.id"
                :draggable="!isMobile"
                @dragstart="handleDragStart($event, item)"
                @click="isMobile ? moveItemToRight(item) : null"
                class="bg-gray-700 p-2 mb-2 rounded cursor-move hover:bg-gray-600 text-white touch-manipulation text-sm"
                :class="{
                  'active:bg-gray-500': isMobile,
                  'opacity-50': isProcessing,
                }"
                :disabled="isProcessing"
              >
                {{ item.text }}
                <span
                  v-if="isMobile"
                  class="text-xs text-gray-400 block mt-1"
                  >{{ $t("signature.touchToMoveDown") }}</span
                >
              </div>
            </div>
          </div>

          <div class="flex-1 w-full lg:w-auto">
            <h4 class="text-white mb-2 text-sm font-medium">
              {{ $t("signature.selectedItems") }}
            </h4>
            <div
              ref="selectedContainer"
              class="bg-gray-800 rounded-lg p-3 min-h-[150px] border border-gray-600"
              @dragover="handleDragOver"
              @drop="handleDropRight"
            >
              <div
                v-for="item in selectedTextItems"
                :key="item.id"
                :draggable="!isMobile"
                @dragstart="handleDragStart($event, item)"
                @click="isMobile ? moveItemToLeft(item) : null"
                class="bg-gray-700 p-2 mb-2 rounded cursor-move hover:bg-gray-600 text-white touch-manipulation text-sm"
                :class="{
                  'active:bg-gray-500': isMobile,
                  'opacity-50': isProcessing,
                }"
                :disabled="isProcessing"
              >
                {{ item.text }}
                <span
                  v-if="isMobile"
                  class="text-xs text-gray-400 block mt-1"
                  >{{ $t("signature.touchToMoveUp") }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-8">
        <h3 class="text-lg font-semibold text-white mb-4">
          {{ $t("signature.preview") }}
        </h3>
        <div
          class="bg-white rounded-lg p-3 sm:p-6 border-2 border-red-500 min-h-[100px] sm:min-h-[120px]"
        >
          <div class="text-red-500 text-sm sm:text-base">
            <div v-for="item in selectedTextItems" :key="item.id" class="mb-1">
              {{ item.text }}
            </div>
          </div>
        </div>
      </div>

      <div class="mb-6">
        <div class="flex items-start gap-2">
          <Checkbox
            v-model="placeOnLastPage"
            inputId="lastPage"
            binary
            class="mt-1"
          />
          <label
            for="lastPage"
            class="text-white text-sm sm:text-base leading-relaxed"
          >
            {{ $t("signature.placeOnLastPage") }}
          </label>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-3">
        <Button @click="saveSettings">
          {{ $t("signature.save") }}
        </Button>
      </div>
    </div>
  </div>

  <Dialog
    v-model:visible="showSignatureModal"
    modal
    :header="$t('signature.createSignature')"
    :style="{ width: '600px' }"
    class="p-fluid"
  >
    <TabView>
      <TabPanel :header="$t('signature.drawSignature')" value="draw">
        <div class="signature-tab">
          <div class="mb-4">
            <VueSignaturePad
              ref="signaturePad"
              width="100%"
              height="200"
              :options="signatureOptions"
            />
          </div>
          <div class="flex gap-2 mb-4">
            <Button
              @click="clearSignature"
              :label="$t('signature.clear')"
              severity="secondary"
              size="small"
            />
            <Button
              @click="saveSignature"
              :label="$t('signature.saveSignature')"
              severity="success"
              size="small"
            />
          </div>
        </div>
      </TabPanel>

      <TabPanel :header="$t('signature.uploadImage')" value="upload">
        <div class="image-upload-tab">
          <FileUpload
            mode="basic"
            accept="image/*"
            :maxFileSize="5000000"
            @select="onImageSelect"
            :chooseLabel="$t('signature.selectImage')"
            class="mb-4"
          />
        </div>
      </TabPanel>
    </TabView>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import { useToast } from "@/composables/useToast";
import { useI18n } from "vue-i18n";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import Checkbox from "primevue/checkbox";
import FileUpload from "primevue/fileupload";
import VueSignaturePad from "vue3-signature-pad";
import Sortable from "sortablejs";

const { success, error } = useToast();
const { t } = useI18n();

const showSignatureModal = ref(false);
const signaturePad = ref(null);
const signaturePreview = ref("");
const imagePreview = ref("");
const placeOnLastPage = ref(false);

const signatureOptions = {
  backgroundColor: "rgb(255, 255, 255)",
  penColor: "rgb(0, 0, 0)",
  minWidth: 1,
  maxWidth: 3,
};

const availableTextItems = ref([
  { id: 1, text: "İrem Nur Gözüdok" },
  { id: 2, text: new Date().toLocaleDateString("tr-TR") },
  { id: 3, text: "E-İmzalıdır." },
]);

interface TextItem {
  id: number;
  text: string;
}

const selectedTextItems = ref<TextItem[]>([]);
const draggedItem = ref<TextItem | null>(null);
const selectedContainer = ref<HTMLElement | null>(null);
const isMobile = ref(false);
const isProcessing = ref(false);

const handleDragStart = (event: DragEvent, item: TextItem) => {
  draggedItem.value = item;
  event.dataTransfer?.setData("text/plain", "");
};

const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
};

const handleDropRight = (event: DragEvent) => {
  event.preventDefault();
  if (draggedItem.value) {
    const isInAvailable = availableTextItems.value.includes(draggedItem.value);
    const isInSelected = selectedTextItems.value.includes(draggedItem.value);

    if (isInAvailable && !isInSelected) {
      selectedTextItems.value.push(draggedItem.value);
      availableTextItems.value = availableTextItems.value.filter(
        (item) => item.id !== draggedItem.value!.id
      );
    }
    draggedItem.value = null;
  }
};

const handleDropLeft = (event: DragEvent) => {
  event.preventDefault();
  if (draggedItem.value) {
    const isInAvailable = availableTextItems.value.includes(draggedItem.value);
    const isInSelected = selectedTextItems.value.includes(draggedItem.value);

    if (isInSelected && !isInAvailable) {
      availableTextItems.value.push(draggedItem.value);
      selectedTextItems.value = selectedTextItems.value.filter(
        (item) => item.id !== draggedItem.value!.id
      );
    }
    draggedItem.value = null;
  }
};

const detectMobile = () => {
  isMobile.value =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth <= 768;
};

const moveItemToRight = (item: TextItem) => {
  if (isProcessing.value) return;

  if (
    availableTextItems.value.includes(item) &&
    !selectedTextItems.value.includes(item)
  ) {
    isProcessing.value = true;
    selectedTextItems.value.push(item);
    availableTextItems.value = availableTextItems.value.filter(
      (i) => i.id !== item.id
    );

    setTimeout(() => {
      isProcessing.value = false;
    }, 300);
  }
};

const moveItemToLeft = (item: TextItem) => {
  if (isProcessing.value) return;

  if (
    selectedTextItems.value.includes(item) &&
    !availableTextItems.value.includes(item)
  ) {
    isProcessing.value = true;
    availableTextItems.value.push(item);
    selectedTextItems.value = selectedTextItems.value.filter(
      (i) => i.id !== item.id
    );

    setTimeout(() => {
      isProcessing.value = false;
    }, 300);
  }
};

const clearSignature = () => {
  if (signaturePad.value && "clearSignature" in signaturePad.value) {
    (signaturePad.value as any).clearSignature();
  }
};

const saveSignature = () => {
  if (signaturePad.value && "saveSignature" in signaturePad.value) {
    const { isEmpty, data } = (signaturePad.value as any).saveSignature();
    if (!isEmpty) {
      signaturePreview.value = data;
      imagePreview.value = ""; // Diğer imza türünü temizle
      showSignatureModal.value = false;
    }
  }
};

const onImageSelect = (event: any) => {
  const file = event.files[0];
  if (file) {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      error(t("signature.onlyImageFiles"), 4000);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string;
      signaturePreview.value = ""; // Diğer imza türünü temizle
      showSignatureModal.value = false;
      success(t("signature.imageUploaded"));
    };
    reader.readAsDataURL(file);
  }
};

const saveSettings = () => {
  const settings = {
    selectedTextItems: selectedTextItems.value,
    placeOnLastPage: placeOnLastPage.value,
    signaturePreview: signaturePreview.value,
    imagePreview: imagePreview.value,
  };

  localStorage.setItem("signatureSettings", JSON.stringify(settings));
  success(t("signature.settingsSaved"), 2000);
};

const loadSettings = () => {
  const saved = localStorage.getItem("signatureSettings");
  if (saved) {
    const settings = JSON.parse(saved);
    selectedTextItems.value = settings.selectedTextItems || [];
    placeOnLastPage.value = settings.placeOnLastPage || false;
    signaturePreview.value = settings.signaturePreview || "";
    imagePreview.value = settings.imagePreview || "";

    // Kullanılan öğeleri available'dan çıkar
    if (settings.selectedTextItems) {
      availableTextItems.value = availableTextItems.value.filter(
        (item) =>
          !settings.selectedTextItems.some(
            (selected: any) => selected.id === item.id
          )
      );
    }
  }
};

onMounted(() => {
  loadSettings();
  detectMobile();

  if (!isMobile.value) {
    nextTick(() => {
      if (selectedContainer.value) {
        new Sortable(selectedContainer.value, {
          animation: 150,
          ghostClass: "sortable-ghost",
          onEnd: (evt: any) => {
            const item = selectedTextItems.value[evt.oldIndex];
            if (item) {
              selectedTextItems.value.splice(evt.oldIndex, 1);
              selectedTextItems.value.splice(evt.newIndex, 0, item);
            }
          },
        });
      }
    });
  }

  window.addEventListener("resize", detectMobile);
});
</script>