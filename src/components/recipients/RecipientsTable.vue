<template>
  <div class="bg-zinc-800 rounded-lg p-4 border border-zinc-600">
    <DataTable
      :value="recipients"
      :paginator="true"
      :rows="10"
      :rowsPerPageOptions="[5, 10, 20]"
      class="modern-datatable"
      dataKey="id"
      :loading="loading"
      responsiveLayout="scroll"
    >
      <template #header>
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-4">
            <div class="bg-zinc-700 p-3 rounded-xl">
              <i class="pi pi-users text-white text-xl"></i>
            </div>
            <div>
              <h3 class="text-white font-bold text-xl">
                {{ $t("recipients.registeredRecipients") }}
              </h3>
              <p class="text-gray-400 text-sm">
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
          <div class="relative">
            <IconField iconPosition="left">
              <InputIcon class="pi pi-search text-gray-400" />
              <InputText
                :model-value="globalFilter"
                @update:model-value="$emit('update:globalFilter', $event || '')"
                :placeholder="$t('recipients.searchRecipients')"
              />
            </IconField>
          </div>
        </div>
      </template>

      <Column
        field="recipientName"
        :header="$t('recipients.recipientName')"
        sortable
      >
        <template #body="slotProps">
          <div class="flex items-center space-x-3">
            <div
              class="w-10 h-10 bg-zinc-600 rounded-full flex items-center justify-center"
            >
              <i class="pi pi-user text-white text-sm"></i>
            </div>
            <span class="text-white font-medium">{{
              slotProps.data.recipientName
            }}</span>
          </div>
        </template>
      </Column>

      <Column field="subject" :header="$t('recipients.subject')" sortable>
        <template #body="slotProps">
          <div class="bg-zinc-800 rounded-lg p-3">
            <span class="text-white font-medium">{{
              slotProps.data.subject
            }}</span>
          </div>
        </template>
      </Column>

      <Column field="to" :header="$t('recipients.email')" sortable>
        <template #body="slotProps">
          <div class="flex items-center space-x-2">
            <i class="pi pi-envelope text-zinc-400"></i>
            <span class="text-gray-300">{{ slotProps.data.to }}</span>
          </div>
        </template>
      </Column>

      <Column field="message" :header="$t('recipients.message')" sortable>
        <template #body="slotProps">
          <div class="bg-zinc-800 rounded-lg p-3 max-w-xs">
            <span class="text-gray-300 text-sm">{{
              truncateText(slotProps.data.message, 40)
            }}</span>
          </div>
        </template>
      </Column>

      <Column
        :header="$t('recipients.actions')"
        :exportable="false"
        style="min-width: 10rem"
      >
        <template #body="slotProps">
          <div class="flex space-x-2">
            <Button
              icon="pi pi-pencil"
              severity="secondary"
              size="small"
              @click="$emit('edit', slotProps.data)"
              :v-tooltip="$t('recipients.edit')"
            />
            <Button
              icon="pi pi-trash"
              severity="danger"
              size="small"
              @click="$emit('delete', slotProps.data)"
              :v-tooltip="$t('recipients.delete')"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";

import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
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
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

defineEmits<{
  "update:globalFilter": [value: string];
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

<style scoped>
.modern-datatable :deep(.p-datatable-header) {
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
}
</style>