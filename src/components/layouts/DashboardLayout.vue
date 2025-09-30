<template>
  <div class="dashboard-layout min-h-screen bg-zinc-800">
    <Topbar />
    <div class="flex">
      <Sidebar />
      <div class="main-content flex-1 lg:ml-64">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Topbar from "./Topbar.vue";
import Sidebar from "./Sidebar.vue";
</script>
