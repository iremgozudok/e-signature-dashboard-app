import { createApp } from "vue";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import "primeicons/primeicons.css";
import "./style.css";
import App from "./App.vue";
import Aura from '@primeuix/themes/aura';
import router from './router'
import i18n from './i18n'

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});
app.use(ToastService);
app.use(ConfirmationService);
app.use(router)
app.use(i18n)
app.mount("#app");