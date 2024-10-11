<script>
import { taskPriority } from '../../contants.js';

export default {
  props: {
    // modelValue: {
    //   type: Boolean,
    //   required: true
    // },
    cardData: {
      type: Object,
      required: true
    },
    assigneeList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      taskPriority: taskPriority
    }
  },
  methods: {
    // Закрыть модальное окно
    closeModal(target) {
      this.$emit('closed')
    },
    getAssigneeNameById(id){
      const assignee = this.assigneeList.find(person => person.id === id);
      return assignee ? assignee.name : 'Not found';
    }
  }
};
</script>



<template>
  <div class="modal">
    <div class="modal-content">
      <span class="close" @click="closeModal()">&times;</span>
      <p class="out">{{ cardData.text }}</p>
      <span class="out">Description:<p class="in">{{ cardData.description }}</p></span>
      <p class="out">Created at:<p class="in"> {{ new Date(cardData.createdAt).toLocaleString() }}</p></p>
      <p class="out">Assignee:<p class="in"> {{ getAssigneeNameById(cardData.assignee) }}</p></p>
      <p class="out">Priority:<p class="in"> {{ taskPriority[cardData.priority] }}</p></p>
    </div>
  </div>
</template>

<style>
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  /* Полупрозрачный фон */
}

.modal-content {
  background-color: #fefefe;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  position: relative;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  cursor: pointer;
}

h1 {
  font-size: 24px;
  margin-bottom: 10px;
}

.out {
  font-weight: bold;
  margin: 8px 0;
}

.in{
  font-weight: normal;
}
</style>
