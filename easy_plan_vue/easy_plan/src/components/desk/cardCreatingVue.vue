<script>
import { taskPriority } from '../../contants.js';
import { v4 as uuidv4 } from 'uuid';
import { ref } from 'vue';
export default {
    props: {
        columnIndex: {
            type: Number,
            required: true,
        },
        assigneeList: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            title: '',
            description: '',
            assignee: '',
            priority: '',
            msg: ref('hello'),
            taskPriority: taskPriority,
        }
    },
    methods: {
        // Закрыть модальное окно
        closeModal() {
            this.$emit('closed')
        },
        checkOnCorrection() {
            console.log(this.title)
            console.log(this.description)
            console.log(this.priority)
            console.log(this.assignee)

            if ((this.title === '') || (this.assignee == null) || (this.priority == null)) {
                return false
            } else {
                return true
            }
        },
        createCard() {
            this.checkOnCorrection()
            if (this.checkOnCorrection()) {
                this.$emit('cardCreated', {
                    id: uuidv4(),
                    text: this.title.trim(),
                    description: this.description.trim(),
                    assignee: this.assignee,
                    createdAt: Date.now(),
                    priority: this.priority

                }, this.columnIndex);
            }
            console.log(this.assignee)
        }
    }
};
// получение данных из полей
//обновление родительской вьюшки
//удаление задач
</script>


<template>
    <div class="modal">
        <div class="modal-content">
            <span class="close" @click="closeModal">&times;</span>
            <p>Название:</p>
            <input type="text" v-model="title" class="input-text" placeholder="Введите название задачи" />
            <p>Описание:</p>
            <textarea v-model="description" class="input-textarea" placeholder="Введите описание задачи"></textarea>
            <p>Исполнитель:</p>
            <select v-model="assignee" class="select-field">
                <option disabled value="">Select assignee</option>
                <option v-for="person in assigneeList" :key="person.id" :value="person.id">{{ person.name }}</option>
            </select>
            <p>Приоритетность:</p>
            <select v-model="priority" class="select-field">
                <option disabled value="">Select priority</option>
                <option v-for="(label, value) in taskPriority" :key="value" :value="value">{{ label }}</option>
            </select>
            <button @click="createCard" class="create-btn">Создать задачу</button>
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

h1 {
    font-size: 24px;
    margin-bottom: 10px;
}

p {
    font-weight: bold;
    margin: 8px 0;
}

.input-text,
.input-textarea,
.select-field {
    width: 100%;
    padding: 8px;
    margin-top: 5px;
    margin-bottom: 15px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.input-textarea {
    height: 100px;
    resize: none;
}

.select-field {
    cursor: pointer;
}

.close {
    color: #aaa;
    float: right;
    font-size: 28px;
    cursor: pointer;
}

.close:hover {
    color: #000;
}

.create-btn {
    background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.create-btn:hover {
    background-color: #45a049;
}
</style>
