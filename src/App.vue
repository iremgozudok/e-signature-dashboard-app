<template>
  <div id="app">
    <router-view />
    <Toast class="mobile-toast" position="top-right" />
    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
</script>