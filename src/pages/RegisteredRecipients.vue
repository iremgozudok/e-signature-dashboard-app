<template>
  <div class="p-3 sm:p-6">
    <div
      class="bg-zinc-900 rounded-lg shadow-sm p-3 sm:p-6 border border-zinc-700"
    >
      <div class="hidden xl:flex justify-between items-center mb-6">
        <div>
          <h2 class="text-2xl font-bold text-white mb-2">
            {{ $t("menu.registeredRecipients") }}
          </h2>
          <p class="text-gray-300">{{ $t("recipients.manageRecipients") }}</p>
        </div>
        <Button
          :label="$t('recipients.addNewRecipient')"
          icon="pi pi-plus"
          @click="openAddModal"
          severity="primary"
          class="hidden xl:flex"
        />
      </div>
      <!-- Desktop Table Component -->
      <RecipientsTable
        v-if="!isMobile"
        :recipients="filteredRecipients"
        v-model:global-filter="globalFilter"
        :loading="loading"
        @edit="openEditModal"
        @delete="openDeleteModal"
        class="hidden xl:block"
      />

      <!-- Mobile Cards Component -->
      <RecipientsCards
        v-else
        :recipients="recipients"
        v-model:global-filter="globalFilter"
        @add="openAddModal"
        @edit="openEditModal"
        @delete="openDeleteModal"
        class="xl:hidden"
      />
    </div>
  </div>

  <Dialog
    v-model:visible="showModal"
    :modal="true"
    :style="{ width: '50rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <template #header>
      <h3 class="text-xl font-semibold text-white">
        {{
          isEditing
            ? $t("recipients.editRecipient")
            : $t("recipients.addRecipient")
        }}
      </h3>
    </template>
    <form @submit.prevent="saveRecipient" class="space-y-6 pt-10">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FloatLabel variant="on">
            <InputText
              id="recipientName"
              v-model="formData.recipientName"
              class="w-full"
              :class="{
                'p-invalid': formSubmitted && !formData.recipientName,
              }"
              required="true"
              autofocus
            />
            <label for="recipientName"
              >{{ $t("recipients.recipientName") }} *</label
            >
          </FloatLabel>
          <small
            v-if="formSubmitted && !formData.recipientName"
            class="text-red-400"
          >
            {{ $t("recipients.recipientNameRequired") }}
          </small>
        </div>

        <div>
          <FloatLabel variant="on">
            <InputText
              id="subject"
              v-model="formData.subject"
              class="w-full"
              :class="{ 'p-invalid': formSubmitted && !formData.subject }"
              required="true"
            />
            <label for="subject">{{ $t("recipients.subject") }} *</label>
          </FloatLabel>
          <small v-if="formSubmitted && !formData.subject" class="text-red-400">
            {{ $t("recipients.subjectRequired") }}
          </small>
        </div>
      </div>

      <div>
        <FloatLabel variant="on">
          <InputText
            id="to"
            v-model="formData.to"
            type="email"
            class="w-full"
            :class="{
              'p-invalid':
                formSubmitted && (!formData.to || !isValidEmail(formData.to)),
            }"
            required="true"
          />
          <label for="to">{{ $t("recipients.email") }} *</label>
        </FloatLabel>
        <small v-if="formSubmitted && !formData.to" class="text-red-400">
          {{ $t("recipients.emailRequired") }}
        </small>
        <small
          v-if="formSubmitted && formData.to && !isValidEmail(formData.to)"
          class="text-red-400"
        >
          {{ $t("recipients.invalidEmailFormat") }}
        </small>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div class="flex items-center mb-3">
            <Checkbox id="includeCC" v-model="includeCC" binary class="mr-3" />
            <label for="includeCC" class="text-white">{{
              $t("recipients.addCC")
            }}</label>
          </div>
          <FloatLabel v-if="includeCC" variant="on">
            <InputText
              id="cc"
              v-model="formData.cc"
              type="email"
              class="w-full"
              :class="{
                'p-invalid':
                  formSubmitted && formData.cc && !isValidEmail(formData.cc),
              }"
            />
            <label for="cc">{{ $t("recipients.ccEmail") }}</label>
          </FloatLabel>
          <small
            v-if="formSubmitted && formData.cc && !isValidEmail(formData.cc)"
            class="text-red-400"
          >
            {{ $t("recipients.invalidEmailFormat") }}
          </small>
        </div>

        <div>
          <div class="flex items-center mb-3">
            <Checkbox
              id="includeBCC"
              v-model="includeBCC"
              binary
              class="mr-3"
            />
            <label for="includeBCC" class="text-white">{{
              $t("recipients.addBCC")
            }}</label>
          </div>
          <FloatLabel v-if="includeBCC" variant="on">
            <InputText
              id="bcc"
              v-model="formData.bcc"
              type="email"
              class="w-full"
              :class="{
                'p-invalid':
                  formSubmitted && formData.bcc && !isValidEmail(formData.bcc),
              }"
            />
            <label for="bcc">{{ $t("recipients.bccEmail") }}</label>
          </FloatLabel>
          <small
            v-if="formSubmitted && formData.bcc && !isValidEmail(formData.bcc)"
            class="text-red-400"
          >
            {{ $t("recipients.invalidEmailFormat") }}
          </small>
        </div>
      </div>

      <div>
        <FloatLabel variant="on">
          <Textarea
            id="message"
            v-model="formData.message"
            class="w-full"
            :class="{ 'p-invalid': formSubmitted && !formData.message }"
            rows="4"
            required="true"
          />
          <label for="message">{{ $t("recipients.message") }} *</label>
        </FloatLabel>
        <small v-if="formSubmitted && !formData.message" class="text-red-400">
          {{ $t("recipients.messageRequired") }}
        </small>
      </div>
    </form>

    <template #footer>
      <div class="flex gap-4">
        <Button
          :label="isEditing ? $t('recipients.update') : $t('recipients.save')"
          severity="primary"
          @click="saveRecipient"
          class="px-8"
        />
        <Button
          :label="$t('recipients.cancel')"
          severity="secondary"
          outlined
          @click="closeModal"
          class="px-8"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "@/composables/useToast";
import { useConfirm } from "primevue/useconfirm";

import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Checkbox from "primevue/checkbox";
import FloatLabel from "primevue/floatlabel";

import RecipientsTable from "../components/recipients/RecipientsTable.vue";
import RecipientsCards from "../components/recipients/RecipientsCards.vue";

interface Recipient {
  id: number;
  recipientName: string;
  subject: string;
  to: string;
  cc?: string;
  bcc?: string;
  message: string;
}

const { t: $t } = useI18n();
const { success } = useToast();
const confirm = useConfirm();
const recipients = ref<Recipient[]>([]);

const loadRecipients = () => {
  const saved = localStorage.getItem("registeredRecipients");
  if (saved) {
    recipients.value = JSON.parse(saved);
  } else {
    recipients.value = [];
  }
};

const saveRecipients = () => {
  localStorage.setItem(
    "registeredRecipients",
    JSON.stringify(recipients.value)
  );
};

const loading = ref(false);
const showModal = ref(false);
const isEditing = ref(false);
const selectedRecipient = ref<Recipient | null>(null);
const globalFilter = ref("");
const includeCC = ref(false);
const includeBCC = ref(false);
const formSubmitted = ref(false);

const isMobile = computed(() => {
  return window.innerWidth < 1280;
});

const filteredRecipients = computed(() => {
  if (!globalFilter.value) {
    return recipients.value;
  }

  const filter = globalFilter.value.toLowerCase();
  return recipients.value.filter(
    (recipient) =>
      recipient.recipientName.toLowerCase().includes(filter) ||
      recipient.subject.toLowerCase().includes(filter) ||
      recipient.to.toLowerCase().includes(filter) ||
      (recipient.cc && recipient.cc.toLowerCase().includes(filter)) ||
      (recipient.bcc && recipient.bcc.toLowerCase().includes(filter)) ||
      recipient.message.toLowerCase().includes(filter)
  );
});

const formData = reactive({
  recipientName: "",
  subject: "",
  to: "",
  cc: "",
  bcc: "",
  message: "",
});

const resetForm = () => {
  formData.recipientName = "";
  formData.subject = "";
  formData.to = "";
  formData.cc = "";
  formData.bcc = "";
  formData.message = "";
  includeCC.value = false;
  includeBCC.value = false;
  formSubmitted.value = false;
};

const openAddModal = () => {
  isEditing.value = false;
  resetForm();
  showModal.value = true;
};

const openEditModal = (recipient: Recipient) => {
  isEditing.value = true;
  selectedRecipient.value = recipient;
  formData.recipientName = recipient.recipientName;
  formData.subject = recipient.subject;
  formData.to = recipient.to;
  formData.cc = recipient.cc || "";
  formData.bcc = recipient.bcc || "";
  formData.message = recipient.message;
  includeCC.value = !!recipient.cc;
  includeBCC.value = !!recipient.bcc;
  formSubmitted.value = false;
  showModal.value = true;
};

const openDeleteModal = (recipient: Recipient) => {
  selectedRecipient.value = recipient;
  confirm.require({
    message: `${recipient.recipientName} ${$t("modal.deleteRecipientMessage")}`,
    header: $t("modal.deleteRecipientTitle"),
    icon: "pi pi-exclamation-triangle",
    acceptLabel: $t("modal.confirmText"),
    rejectLabel: $t("modal.cancelText"),
    acceptClass: "p-button-danger",
    rejectClass: "p-button-secondary",
    accept: () => {
      deleteRecipient();
    },
    reject: () => {
      selectedRecipient.value = null;
    },
  });
};

const closeModal = () => {
  showModal.value = false;
  resetForm();
  selectedRecipient.value = null;
};

const saveRecipient = () => {
  formSubmitted.value = true;
  if (
    !formData.recipientName ||
    !formData.subject ||
    !formData.to ||
    !formData.message
  ) {
    return;
  }

  if (!isValidEmail(formData.to)) {
    return;
  }

  if (includeCC.value && formData.cc && !isValidEmail(formData.cc)) {
    return;
  }

  if (includeBCC.value && formData.bcc && !isValidEmail(formData.bcc)) {
    return;
  }

  if (isEditing.value && selectedRecipient.value) {
    const index = recipients.value.findIndex(
      (r) => r.id === selectedRecipient.value!.id
    );
    if (index !== -1) {
      const existingRecipient = recipients.value[index];
      if (existingRecipient) {
        recipients.value[index] = {
          id: existingRecipient.id,
          recipientName: formData.recipientName,
          subject: formData.subject,
          to: formData.to,
          cc: includeCC.value ? formData.cc : undefined,
          bcc: includeBCC.value ? formData.bcc : undefined,
          message: formData.message,
        };
      }
    }
  } else {
    const newRecipient: Recipient = {
      id: Date.now(),
      recipientName: formData.recipientName,
      subject: formData.subject,
      to: formData.to,
      cc: includeCC.value ? formData.cc : undefined,
      bcc: includeBCC.value ? formData.bcc : undefined,
      message: formData.message,
    };
    recipients.value.push(newRecipient);
  }

  saveRecipients();

  if (isEditing.value) {
    success($t("toast.recipientUpdated"));
  } else {
    success($t("toast.recipientCreated"));
  }

  closeModal();
};

const deleteRecipient = () => {
  if (selectedRecipient.value) {
    const index = recipients.value.findIndex(
      (r) => r.id === selectedRecipient.value!.id
    );
    if (index !== -1) {
      recipients.value.splice(index, 1);
      saveRecipients();

      success($t("toast.recipientDeleted"));
    }
  }
  selectedRecipient.value = null;
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

onMounted(() => {
  loadRecipients();
});
</script>
