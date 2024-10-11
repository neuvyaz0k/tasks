// import './assets/main.css';
import './assets/desk.css'
import router  from './router';
import MainPage from "./components/main_page/MainPage.vue";
import RegistrationPage from "./components/registration_page/RegistrationPage.vue";
import {createRouter, createWebHashHistory} from 'vue-router';
import { createApp } from 'vue';
import App from './App.vue';


// const router = VueRouter.createRouter({
//     // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
//     history: VueRouter.createWebHashHistory(),
//     routes, // short for `routes: routes`
// })

const app = createApp(App);
app.use(router);
app.mount('#app');
// createApp(App).mount('#app')
