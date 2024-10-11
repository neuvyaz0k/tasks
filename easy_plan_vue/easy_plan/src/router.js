import Section from "./components/desk/section.vue";
import MainPage from "./components/main_page/MainPage.vue";
import RegistrationPage from "./components/registration_page/RegistrationPage.vue";
import {createRouter, createWebHashHistory} from 'vue-router';

export default createRouter({
    history: createWebHashHistory(),
    routes : [
        { path: '/', component: MainPage, alias: "/" },
        { path: '/registration', component: RegistrationPage },
        { path: '/section', component: Section },
    ]
});
