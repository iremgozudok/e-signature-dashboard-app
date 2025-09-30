<template>
  <div class="lg:container mx-auto h-screen">
    <div class="grid lg:grid-cols-2 h-full lg:p-10">
      <div
        class="rounded-2xl bg-cover bg-center h-full overflow-hidden hidden lg:block"
        style="background-image: url('/src/assets/background.jpg')"
      >
        <div class="h-full w-full p-20 grid grid-cols-2 grid-rows-3 gap-4">
          <div class="rounded-2xl bg-black/30 backdrop-blur-md"></div>
          <div
            class="rounded-2xl bg-[#B58CFF] text-black p-6 flex flex-col justify-between"
            style="
              background-image: radial-gradient(
                circle at 10px 10px,
                rgba(255, 255, 255, 0.25) 1px,
                transparent 1px
              );
              background-size: 16px 16px;
            "
          >
            <div></div>
            <div class="text-xl xl:text-2xl font-medium">
              <p>{{ t("login.downloadSigner") }}</p>
            </div>
          </div>

          <div
            class="rounded-2xl bg-[#B58CFF] flex items-center justify-center"
          >
            <Image src="/src/assets/logo.png" alt="logo" width="100" />
          </div>

          <div
            class="rounded-2xl bg-[#F4E9A6] text-black p-6 relative content-end"
          >
            <span class="absolute left-4 top-3 text-xl">+</span>
            <div class="mt-6 text-xl leading-7 font-medium max-w-[16ch]">
              {{ t("login.activateESignature") }}
            </div>
          </div>

          <div
            class="rounded-2xl bg-[#F4E9A6] text-black p-6 relative content-end"
          >
            <span class="absolute left-4 top-3 text-xl">+</span>
            <div class="mt-10 text-2xl leading-8 font-medium max-w-[10ch]">
              {{ t("login.sign") }}
            </div>
          </div>

          <div class="rounded-2xl bg-black/30 backdrop-blur-md"></div>
        </div>
      </div>

      <div class="flex flex-col justify-center items-center h-full">
        <div class="mb-10 bg-[#B58CFF] px-10 py-5 rounded-2xl lg:hidden">
          <Image src="/src/assets/logo.png" alt="logo" width="100" />
        </div>
        <div class="card">
          <Tabs value="0">
            <TabList>
              <Tab value="0">{{ t("login.emailLogin") }}</Tab>
              <Tab value="1">{{ t("login.esignLogin") }}</Tab>
            </TabList>
            <TabPanels>
              <TabPanel
                value="0"
                class="flex flex-col justify-center items-center h-[400px]"
              >
                <h3 class="text-3xl font-light mb-10 text-white">
                  {{ t("login.login") }}
                </h3>
                <FloatLabel variant="on" class="mb-5">
                  <InputText
                    id="username"
                    v-model="username"
                    class="w-[350px]"
                  />
                  <label for="username">{{ t("login.email") }}</label>
                </FloatLabel>
                <FloatLabel variant="on" class="mb-5">
                  <InputText
                    id="password"
                    v-model="password"
                    type="password"
                    class="w-[350px]"
                  />
                  <label for="password">{{ t("login.password") }}</label>
                </FloatLabel>
                <Button
                  :label="t('login.login')"
                  severity="primary"
                  raised
                  class="w-[350px] mb-5"
                  @click="onSubmit"
                />
                <div
                  v-if="errorMessage"
                  class="text-red-500 text-sm mb-3 text-center"
                >
                  {{ errorMessage }}
                </div>
                <a class="hover:underline cursor-pointer text-sm font-light text-white">
                  {{ t("login.forgotPassword") }}
                </a>
                <p class="text-sm font-light text-white">
                  {{ t("login.notMember") }}
                  <a class="hover:underline cursor-pointer">{{
                    t("login.register")
                  }}</a>
                </p>
              </TabPanel>
              <TabPanel
                value="1"
                class="flex flex-col justify-center items-center h-[400px]"
              >
                <p class="mt-5 mb-10 font-light text-white">
                  {{ t("login.signerNotFound") }}
                </p>

                <Button
                  :label="t('login.downloadNow')"
                  severity="primary"
                  raised
                  class="w-[350px] mb-5"
                />
                <Button
                  :label="t('login.tryAgain')"
                  severity="secondary"
                  raised
                  class="w-[350px] mb-5"
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import InputText from "primevue/inputtext";
import FloatLabel from "primevue/floatlabel";
import Button from "primevue/button";
import Image from "primevue/image";
import Tabs from "primevue/tabs";
import TabList from "primevue/tablist";
import Tab from "primevue/tab";
import TabPanels from "primevue/tabpanels";
import TabPanel from "primevue/tabpanel";
import { ref } from "vue";
import { useUserStore } from "../../stores/user";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const username = ref("");
const password = ref("");
const errorMessage = ref("");

const userStore = useUserStore();
const router = useRouter();
const { t } = useI18n();

const emit = defineEmits(["login"]);

const onSubmit = () => {
  errorMessage.value = "";

  if (userStore.login(username.value, password.value)) {
    emit("login");
    router.push("/dashboard");
  } else {
    errorMessage.value = t("login.invalidCredentials");
  }
};
</script>

<style scoped>
.card .p-tabpanels,
.card .p-tablist {
  background: transparent;
}
</style>