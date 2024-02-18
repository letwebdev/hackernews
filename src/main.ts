import "./assets/main.css"
import "virtual:uno.css"

import { createApp } from "vue"

import { createPinia } from "pinia"
import "vuetify/styles"
import { createVuetify } from "vuetify"

import router from "./router"

import App from "./App.vue"

const app = createApp(App)

const pinia = createPinia()
const vuetify = createVuetify({})

app.use(pinia)
app.use(vuetify)

app.use(router)
app.mount("#app")
