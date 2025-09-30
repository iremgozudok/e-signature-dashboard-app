<template>
  <!-- Modal -->
  <div
    v-if="visible"
    class="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50"
    @click="handleCancel"
  >
    <div
      class="bg-zinc-900 rounded-lg p-6 max-w-md w-full mx-4 border border-zinc-700 relative"
      @click.stop
    >
      <h3 class="text-xl font-bold text-white mb-4 text-center">
        {{ computedTitle }}
      </h3>
      
      <div class="text-center mb-6">
        <div class="text-4xl text-red-500 mb-2">⚠️</div>
        <div class="text-white">
          {{ computedMessage }}
        </div>
        <div class="text-zinc-400 text-sm mt-2">
          {{ computedWarningText }}
        </div>
      </div>

      <div class="flex gap-3">
        <button
          @click="handleCancel"
          class="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white py-2 px-4 rounded-lg transition-colors"
        >
          {{ computedCancelText }}
        </button>
        <button
          @click="handleConfirm"
          class="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
        >
          {{ computedConfirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

interface Props {
  visible: boolean;
  title?: string;
  message?: string;
  warningText?: string;
  confirmText?: string;
  cancelText?: string;
}

interface Emits {
  (e: 'update:visible', value: boolean): void;
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}

const { t } = useI18n();

const props = withDefaults(defineProps<Props>(), {
  title: '',
  message: '',
  warningText: '',
  confirmText: '',
  cancelText: ''
});

const emit = defineEmits<Emits>();

const computedTitle = computed(() => 
  props.title || t('modal.deleteConfirmTitle')
);

const computedMessage = computed(() => 
  props.message || t('modal.deleteConfirmMessage')
);

const computedWarningText = computed(() => 
  props.warningText || t('modal.deleteWarning')
);

const computedConfirmText = computed(() => 
  props.confirmText || t('modal.confirmText')
);

const computedCancelText = computed(() => 
  props.cancelText || t('modal.cancelText')
);

const handleConfirm = () => {
  emit('confirm');
  emit('update:visible', false);
};

const handleCancel = () => {
  emit('cancel');
  emit('update:visible', false);
};
</script>