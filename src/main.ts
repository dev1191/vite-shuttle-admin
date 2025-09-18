import { createApp } from 'vue'

import App from '@/App.vue'
import router from '@/router'
import i18n from '@/plugins/i18n'
import pinia from "@/plugins/pinia"
import "@/styles/main.css"
import 'virtual:uno.css'
import { setupNProgress } from '@/plugins/nprogress'


async function setupApp() {
    const app = createApp(App)


    app.use(pinia)
    app.use(router)
    app.use(i18n)

    setupNProgress(router) // Nprogress 

    app.mount('#app')


}


setupApp()