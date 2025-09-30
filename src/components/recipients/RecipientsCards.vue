<template>
  <div>
    <div class="mb-4 sm:mb-6">
      <div class="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
        <div class="bg-zinc-700 p-2 sm:p-3 rounded-xl">
          <i class="pi pi-users text-white text-lg sm:text-xl"></i>
        </div>
        <div>
          <h3 class="text-white font-bold text-lg sm:text-xl">
            {{ $t("recipients.registeredRecipients") }}
          </h3>
          <p class="text-gray-400 text-xs sm:text-sm">
            <span v-if="globalFilter"
              >{{ filteredRecipients.length }}
              {{ $t("recipients.results") }}</span
            >
            <span v-else
              >{{ recipients.length }}
              {{ $t("recipients.recipientsRegistered") }}</span
            >
          </p>
        </div>
      </div>
      <Button
        :label="$t('recipients.addNewRecipient')"
        icon="pi pi-plus"
        @click="$emit('add')"
        severity="primary"
        class="w-full"
      />
    </div>
    <div class="relative mb-4 sm:mb-6">
      <IconField iconPosition="left">
        <InputIcon class="pi pi-search text-gray-400" />
        <InputText
          :model-value="globalFilter"
          @update:model-value="$emit('update:globalFilter', $event || '')"
          :placeholder="$t('recipients.searchRecipients')"
          class="w-full pl-10 pr-10 py-2 sm:py-3 bg-zinc-700 border border-zinc-600 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 text-sm sm:text-base"
        />
      </IconField>
      <button
        v-if="globalFilter"
        @click="$emit('update:globalFilter', '')"
        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
      >
        <i class="pi pi-times text-sm"></i>
      </button>
    </div>
    <div class="space-y-3 sm:space-y-4">
      <div
        v-for="recipient in filteredRecipients"
        :key="recipient.id"
        class="bg-zinc-800 rounded-lg border border-zinc-600 p-3 sm:p-4"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
            <div
              class="w-8 h-8 sm:w-10 sm:h-10 bg-zinc-600 rounded-full flex items-center justify-center flex-shrink-0"
            >
              <i class="pi pi-user text-white text-xs sm:text-sm"></i>
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="text-white font-medium text-sm sm:text-lg truncate">
                {{ recipient.recipientName }}
              </h4>
              <p class="text-gray-300 text-xs sm:text-sm truncate">
                {{ recipient.to }}
              </p>
            </div>
          </div>
          <div class="flex items-center space-x-1 sm:space-x-2 ml-2 sm:ml-3">
            <button
              @click="$emit('edit', recipient)"
              class="p-1.5 sm:p-2 text-gray-400 hover:text-white transition-colors"
              :v-tooltip="$t('recipients.edit')"
            >
              <i class="pi pi-pencil text-sm sm:text-lg"></i>
            </button>
            <button
              @click="$emit('delete', recipient)"
              class="p-1.5 sm:p-2 text-red-400 hover:text-red-300 transition-colors"
              :v-tooltip="$t('recipients.delete')"
            >
              <i class="pi pi-trash text-sm sm:text-lg"></i>
            </button>
          </div>
        </div>
        <div class="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-zinc-600">
          <div class="mb-2">
            <span class="text-gray-400 text-xs uppercase tracking-wide">{{
              $t("recipients.subject")
            }}</span>
            <p class="text-white font-medium text-xs sm:text-sm break-words">
              {{ recipient.subject }}
            </p>
          </div>
          <div>
            <span class="text-gray-400 text-xs uppercase tracking-wide">{{
              $t("recipients.message")
            }}</span>
            <p class="text-gray-300 text-xs sm:text-sm break-words">
              {{ truncateText(recipient.message, 40) }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="filteredRecipients.length > 10"
      class="mt-4 sm:mt-6 flex justify-center"
    >
      <div class="flex space-x-2">
        <button
          v-for="page in Math.ceil(filteredRecipients.length / 10)"
          :key="page"
          class="px-3 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors"
        >
          {{ page }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";

import Button from "primevue/button";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import InputText from "primevue/inputtext";

interface Recipient {
  id: number;
  recipientName: string;
  subject: string;
  to: string;
  cc?: string;
  bcc?: string;
  message: string;
}

interface Props {
  recipients: Recipient[];
  globalFilter: string;
}

const props = defineProps<Props>();

defineEmits<{
  "update:globalFilter": [value: string];
  add: [];
  edit: [recipient: Recipient];
  delete: [recipient: Recipient];
}>();

const { t: $t } = useI18n();

const filteredRecipients = computed(() => {
  if (!props.globalFilter) {
    return props.recipients;
  }

  const filter = props.globalFilter.toLowerCase();
  return props.recipients.filter(
    (recipient) =>
      recipient.recipientName.toLowerCase().includes(filter) ||
      recipient.subject.toLowerCase().includes(filter) ||
      recipient.to.toLowerCase().includes(filter) ||
      (recipient.cc && recipient.cc.toLowerCase().includes(filter)) ||
      (recipient.bcc && recipient.bcc.toLowerCase().includes(filter)) ||
      recipient.message.toLowerCase().includes(filter)
  );
});

const truncateText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};
</script>