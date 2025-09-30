<script setup lang="ts">
import LoginForm from "../components/auth/LoginForm.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const handleLogin = () => {
  router.push("/dashboard");
};
</script>

<template>
  <LoginForm @login="handleLogin" />
</template>
