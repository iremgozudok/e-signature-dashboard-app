<template>
  <div class="px-6 lg:px-50 py-6">
    <div class="bg-zinc-900 rounded-lg shadow-sm p-6 border border-zinc-700">
      <h2 class="text-2xl font-bold text-white mb-6">
        {{ $t("menu.profileSettings") }}
      </h2>

      <form @submit.prevent="onSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <FloatLabel variant="on">
              <InputText
                id="firstName"
                v-model="formData.firstName"
                class="w-full"
                :class="{ 'p-invalid': errors.firstName }"
              />
              <label for="firstName">{{ $t("profile.firstName") }}</label>
            </FloatLabel>
            <small v-if="errors.firstName" class="text-red-400">{{
              errors.firstName
            }}</small>
          </div>
          <div>
            <FloatLabel variant="on">
              <InputText
                id="lastName"
                v-model="formData.lastName"
                class="w-full"
                :class="{ 'p-invalid': errors.lastName }"
              />
              <label for="lastName">{{ $t("profile.lastName") }}</label>
            </FloatLabel>
            <small v-if="errors.lastName" class="text-red-400">{{
              errors.lastName
            }}</small>
          </div>
          <div class="md:col-span-2">
            <FloatLabel variant="on">
              <InputText
                id="email"
                v-model="formData.email"
                type="email"
                class="w-full"
                :class="{ 'p-invalid': errors.email }"
              />
              <label for="email">{{ $t("profile.email") }}</label>
            </FloatLabel>
            <small v-if="errors.email" class="text-red-400">{{
              errors.email
            }}</small>
          </div>
          <div>
            <FloatLabel variant="on" class="w-full">
              <Password
                id="password"
                v-model="formData.password"
                class="w-full"
                :class="{ 'p-invalid': errors.password }"
                :feedback="false"
                toggleMask
              />
              <label for="password">{{ $t("profile.password") }}</label>
            </FloatLabel>
            <small v-if="errors.password" class="text-red-400">{{
              errors.password
            }}</small>
          </div>
          <div>
            <FloatLabel variant="on" class="w-full">
              <Password
                id="confirmPassword"
                v-model="formData.confirmPassword"
                class="w-full"
                :class="{ 'p-invalid': errors.confirmPassword }"
                :feedback="false"
                toggleMask
              />
              <label for="confirmPassword">{{
                $t("profile.confirmPassword")
              }}</label>
            </FloatLabel>
            <small v-if="errors.confirmPassword" class="text-red-400">{{
              errors.confirmPassword
            }}</small>
          </div>
        </div>
        <div class="flex justify-end mt-5">
          <Button
            type="submit"
            :label="$t('profile.update')"
            severity="primary"
            :loading="isLoading"
            class="px-8"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useUserStore } from "../stores/user";
import { useToast } from "@/composables/useToast";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import FloatLabel from "primevue/floatlabel";
import Button from "primevue/button";

const { t } = useI18n();
const userStore = useUserStore();
const { success, error: showError } = useToast();

const formData = ref({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const errors = ref({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const isLoading = ref(false);

const validateForm = () => {
  errors.value = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  let isValid = true;

  if (!formData.value.firstName.trim()) {
    errors.value.firstName = t("profile.firstNameRequired");
    isValid = false;
  }

  if (!formData.value.lastName.trim()) {
    errors.value.lastName = t("profile.lastNameRequired");
    isValid = false;
  }

  if (!formData.value.email.trim()) {
    errors.value.email = t("profile.emailRequired");
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    errors.value.email = t("profile.validEmail");
    isValid = false;
  }

  if (!formData.value.password.trim()) {
    errors.value.password = t("profile.passwordRequired");
    isValid = false;
  } else if (formData.value.password.length < 6) {
    errors.value.password = t("profile.passwordMinLength");
    isValid = false;
  }

  if (formData.value.password !== formData.value.confirmPassword) {
    errors.value.confirmPassword = t("profile.passwordsNotMatch");
    isValid = false;
  }

  return isValid;
};

const onSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  isLoading.value = true;

  try {
    userStore.updateUser({
      firstName: formData.value.firstName,
      lastName: formData.value.lastName,
      email: formData.value.email,
      password: formData.value.password,
    });

    success(t("toast.profileUpdateSuccess"));

    formData.value.password = "";
    formData.value.confirmPassword = "";
  } catch (error) {
    showError(t("toast.profileUpdateError"));
  } finally {
    isLoading.value = false;
  }
};

const loadUserData = () => {
  formData.value = {
    firstName: userStore.user.firstName,
    lastName: userStore.user.lastName,
    email: userStore.user.email,
    password: "",
    confirmPassword: "",
  };
};

onMounted(() => {
  loadUserData();
});
</script>

<style scoped>
:deep(.p-password),
:deep(.p-password .p-inputtext),
:deep(.p-password .p-password-input) {
  width: 100%;
}
</style>
