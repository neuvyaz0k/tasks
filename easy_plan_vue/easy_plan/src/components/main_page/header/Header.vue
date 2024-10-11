<script setup>
import { UserCircleIcon } from "@heroicons/vue/24/outline";
</script>

<script>
export default {
  name: '',
  props: {},
  data() {
    return {
      panelItems: [
        {
          id: 1,
          isOpen: false,
          title: "Продукт",
          listOfChildItems: ["О продукте", "Обучение", "Видеокурс"],
        },
        {
          id: 2,
          isOpen: false,
          title: "Тарифы",
          listOfChildItems: ["Free", "Standart", "No limits"],
        },
        {
          id: 3,
          isOpen: false,
          title: "Компания",
          listOfChildItems: ["Лицензия", "Сотрудники",],
        },
      ],
      listIsOpen: true,
    }
  },
  computed: {},
  methods: {
    changeListStatus(id) {
      this.panelItems.forEach(item => {
        if (item.id == id) {
          item.isOpen = !item.isOpen;
        }
      });
      // return this.listIsOpen = !this.listIsOpen;
    },
    getCurrentState(id) {
      this.panelItems.forEach(item => {
        if (item.id == id) {
          return (item.isOpen) ? "visible" : "hidden";
        }
      });
    },
    goToRegistrationPage() {
      console.log('reroute');
      this.$router.push('/registration');
    },
  }
}
</script>

<template>
  <header className="header">
    <div className="logo-panel-wrapper">
      <div className="logo-wrapper">
        <img className="logo" src="../../../assets/image/logo.png" alt="easy plan" />
      </div>
      <div className="action-panel-wrapper">
        <div @click="changeListStatus(item.id)" v-for="item in panelItems" className="action-panel-item" :key="item.id">
          <p className="action-panel-item-text">{{ item.title }}</p>
          <!-- {% if item.isOpen %} -->
          <div className="dropdown-menu" v-if="item.isOpen" :style="{ visibility: getCurrentState(item.id) }">
            <div>
              <div v-for="elem in item.listOfChildItems" className="dropdownmenu-item">{{ elem }}</div>
            </div>
          </div>
          <!-- {% endif %} -->
        </div>
      </div>
    </div>
    <div className="login-icon" @click="goToRegistrationPage()">
      <UserCircleIcon class="h-6 w-6 text-blue-500" />
    </div>
  </header>
</template>

<style scoped></style>
