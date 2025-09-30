<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
    <Button
      :label="$t('dashboard.signButton')"
      icon="pi pi-pencil"
      @click="$emit('navigateToSign')"
      severity="help"
      size="large"
      class="h-16 sm:h-20 text-base sm:text-lg font-semibold !rounded-2xl"
    />
    <Button
      :label="$t('dashboard.timestampButton')"
      icon="pi pi-clock"
      @click="$emit('navigateToTimestamp')"
      severity="info"
      size="large"
      class="h-16 sm:h-20 text-base sm:text-lg font-semibold !rounded-2xl"
    />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import Button from "primevue/button";

const { t: $t } = useI18n();

defineEmits<{
  navigateToSign: [];
  navigateToTimestamp: [];
}>();
</script>