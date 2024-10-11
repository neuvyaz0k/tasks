<script>
import CardVue from './cardVue.vue';
import CardCreatingVue from './cardCreatingVue.vue';
import { taskPriority } from '../../contants.js';

export default {
    components: {
        CardVue,
        CardCreatingVue
    },
    props: {
        columnsData: {
            type: Array,
            required: true,
        },
        sectionIndex: {
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
            cardDragabilityStatus: true,
            draggedCard: null,
            draggedFromColumn: null,
            isHovered: null,  // Для отслеживания, над какой колонкой находится карточка
            isDragging: false,
            isCardVueOpen: false,
            isCardCreatatingVueOpen: false,
            selectedCard: null,
            taskPriority: taskPriority,
            menuOpenStatuses: [],
            columnCheckboxStatuses: [],
            editedColumn: null,
            currentActionColumn: null,
            columnMenuActions: [
                "Create task",
                "Select few",
                "Delete column"
            ],
        };
    },
    created() {
        for (let index = 0; index < this.columnsData.length; index++) {
            this.prioritySorting(index)
        };
        this.columnsData.forEach(() => {
            this.menuOpenStatuses.push(false)
        });
        this.columnsData.forEach(() => {
            this.columnCheckboxStatuses.push(false)
        });
    },
    mounted() {
        window.addEventListener("click", this.handleClickOutside);
    },
    beforeDestroy() {
        window.removeEventListener("click", this.handleClickOutside);
    },
    methods: {
        onDragStart(card, columnIndex, cardIndex) {
            console.log(cardIndex)
            this.isDragging = true;
            this.draggedCard = card;
            this.draggedFromColumn = columnIndex;
        },
        onDragEnd() {
            this.isDragging = false;
            this.draggedCard = null;
            this.draggedFromColumn = null;
            this.isHovered = null;
        },
        onDragOver(event) {
            // Ничего не делаем, просто позволяем дроп
        },
        onDragLeave() {
            this.isHovered = null;
        },
        onDrop(columnIndex) {
            if (this.draggedCard !== null && this.draggedFromColumn !== null) {
                const fromColumn = this.columnsData[this.draggedFromColumn].cards;
                const toColumn = this.columnsData[columnIndex].cards;

                // Удаляем карточку из исходной колонки
                fromColumn.splice(fromColumn.indexOf(this.draggedCard), 1);

                // Добавляем карточку в новую колонку
                toColumn.push(this.draggedCard);
                this.prioritySorting(columnIndex)
                this.onDragEnd();  // Очищаем состояния
            }
        },
        onDragEnter(columnIndex) {
            this.isHovered = columnIndex;  // Обновляем индекс колонки, над которой происходит перетаскивание
        },
        // Открыть модальное окно с информацией о карточке
        changeModalCardVueStatus() {
            this.isCardVueOpen = !this.isCardVueOpen;
        },
        changeModalCardCreatingVueStatus() {
            this.isCardCreatatingVueOpen = !this.isCardCreatatingVueOpen
        },
        selectCard(card) {
            this.selectedCard = card;
        },
        prioritySorting(columnIndex) {
            // Сортировка по полю priority
            this.columnsData[columnIndex].cards.sort((a, b) => b.priority - a.priority);
        },
        changeColumnMenuStatus(index) {
            this.menuOpenStatuses[index] = !this.menuOpenStatuses[index];
        },
        handleClickOutside(event) {
            const menuContainer = this.$el.querySelector(".menu-container");
            if (!menuContainer.contains(event.target)) {
                this.isMenuOpen = false;
            }
        },
        checkColumnMenuStatus(index) {
            if (this.menuOpenStatuses === []) {
                return false
            }
            return this.menuOpenStatuses[index];
        },
        changeColumnCheckboxStatus(index) {
            this.columnCheckboxStatuses[index] = !this.columnCheckboxStatuses[index];
        },
        checkColumnCheckboxStatus(index) {
            if (this.columnCheckboxStatuses === []) {
                return false
            }
            return this.columnCheckboxStatuses[index];
        },
        cardActionCall(columnIndex, actionIndex) {
            switch (actionIndex) {
                case 0:
                    this.createCard(columnIndex)
                    this.changeColumnMenuStatus(columnIndex)
                    break;
                case 1:
                    this.selectCards(columnIndex)
                    this.changeColumnMenuStatus(columnIndex)
                    break;
                case 2:
                    this.deleteColumn(columnIndex)
                    break;
                default:
                    break;
            }
        },
        createCard(columnIndex) {
            this.changeModalCardCreatingVueStatus()
            this.currentActionColumn = columnIndex
        },
        // saveCard(cardObj) {
        //     this.columnsData[cardObj.columnIndex].cards.push(cardObj.cardData)
        // },
        printCard() {
            console.log('hello')
        },
        deleteColumn(columnIndex) {
            this.columnsData.splice(columnIndex, 1);
        },
        selectCards(columnIndex) {
            this.columnCheckboxStatuses[columnIndex] = !this.columnCheckboxStatuses[columnIndex];
            this.lockDragling()
        },
        lockDragling() {
            const element = this.$refs.card;
            // Изменяем свойство draggable на противоположное
            element.draggable = !element.draggable
        },
        editColumnName(columnIndex) {
            this.editedColumn = columnIndex;
        },
        // Обрабатываем завершение редактирования названия колонки
        confirmColumnTitle(columnIndex, value) {
            const inputValue = value;
            if (inputValue === '') {
                this.columnsData[columnIndex].title = 'Без названия'; // Название по умолчанию, если поле пустое
            } else {
                this.columnsData[columnIndex].title = inputValue
            }
            this.lastSavedValue = this.columnsData[columnIndex].title
            this.editedColumn = null; // Выключаем режим редактирования
            this.$emit('update-columns', this.columnsData, this.sectionIndex);
        },
        columnIsEdited(columnIndex) {
            return this.editedColumn === columnIndex
        },
        updateCards(newCard, columnIndex){
            this.columnsData[columnIndex].cards.push(newCard)
        },
    },
}
</script>

<template>
    <div class="task-board">
        <div v-for="(column, index) in columnsData" :key="index" class="column" @dragover.prevent="onDragOver"
            @dragleave="onDragLeave" @dragenter="onDragEnter(index)" @drop="onDrop(index)"
            :class="{ hovered: isHovered === index }">
            <div class="header-container">
                <div class="header-text" @dblclick="editColumnName(index)">
                    <input v-if="columnIsEdited(index)" @keyup.enter="confirmColumnTitle(index, $event.target.value)"
                         @blur="confirmColumnTitle(index, $event.target.value)" autofocus />
                    <h2 v-else>{{ column.title }}</h2>
                </div>
                <div class="menu-container">
                    <div class="menu-button" @click="changeColumnMenuStatus(index)">
                        ⋮
                    </div>
                    <div class="dropdown-menu" v-if="checkColumnMenuStatus(index)">
                        <div class="dropdown-menu-elems-wrapper">
                            <div class="dropdown-menu-elem" v-for="(action, actionIndex) in columnMenuActions"
                                @click="cardActionCall(index, actionIndex)" :key="actionIndex">
                                <p>{{ columnMenuActions[actionIndex] }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-for="(card, cardIndex) in column.cards" :key="card.id" ref="card" class="card" draggable="true"
                @dragstart="onDragStart(card, index, cardIndex)" @dragend="onDragEnd"
                @dblclick="changeModalCardVueStatus(); selectCard(card)"
                :style="{ pointerEvents: (isDragging && card.id !== draggedCard.id) ? 'none' : 'auto' }">
                <div class="card-content-wrapper">
                    <div class="card-data-wrapper">
                        {{ card.text }}
                    </div>
                    <div class="card-checkbox">
                        <label class="custom-checkbox" v-if="checkColumnCheckboxStatus(index)">
                            <input type="checkbox">
                            <span class="checkmark"></span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
        <!-- Модальное окно -->
        <CardVue v-if="isCardVueOpen" @closed="changeModalCardVueStatus(); printColData()"
            :cardData="this.selectedCard" :assigneeList="this.assigneeList"/>
        <CardCreatingVue v-if="isCardCreatatingVueOpen" @cardCreated="updateCards" :columnIndex="this.currentActionColumn" :assigneeList="this.assigneeList"
            @closed="changeModalCardCreatingVueStatus"/>

    </div>
</template>

<style scoped>
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

.task-board {
    display: flex;
    justify-content: space-between;
    gap: 10px;
}

.column {
    margin-top: 10px;
    background-color: #f0f0f0;
    border: 1px solid rgb(161, 161, 161);
    padding: 6px 3px;
    border-radius: 6px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    max-height: 100%;
    transition: transform 0.3s, background-color 0.3s;
}

.column.hovered {
    background-color: #e0f7fa;
    transform: scale(1.05);
}

h2 {
    text-align: center;
    margin-bottom: 10px;
    font-size: 18px;
    color: #333;
    user-select: none
}

.card {
    background-color: #fff;
    margin-bottom: 4px;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    color: #333;
    border: 1px solid rgba(128, 128, 128, 0.411);
    cursor: default;
    pointer-events: auto;
}

.card:hover {
    background-color: #f0f0f0;
    transition: background-color 0.3s;
}

.card:last-child {
    margin-bottom: 0;
}

.card:active {
    cursor: grabbing;
    opacity: 0.6;
}

.header-container {
    display: flex;
    justify-content: center;
    border-radius: 5px;
    align-items: center;
    position: relative;
    width: 100%;
    padding: 10px;
    background-color: #e0e0e0;
    margin-bottom: 10px;
}

h2 {
    margin: 0;
}

.menu-container {
    position: absolute;
    right: 15px;
    width: 150px;
    display: flex;
    justify-content: right;
}

.menu-button {
    border: none;
    font-size: 20px;
    cursor: pointer;
    user-select: none;
}

.dropdown-menu {
    z-index: 1;
    position: absolute;
    right: -10px;
    top: 0px;
    background-color: white;
    border: 1px solid #ccc;
    width: 160px;
}

.dropdown-menu-elems-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.dropdown-menu-elem {
    padding: 10px;
    margin-top: 5px;
    height: 40px;
    align-content: right;
}

.dropdown-menu-elem:hover {
    background-color: #f0f0f0;
}

.card-content-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

/* Стили для контейнера чекбокса */
.custom-checkbox {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    font-size: 16px;
    user-select: none;
    position: relative;
    padding-left: 30px;
    margin-bottom: 12px;
    display: flex;
    align-content: center;
}

/* Исходный чекбокс скрыт */
.custom-checkbox input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
}

/* Стиль для кастомной метки чекбокса */
.custom-checkbox .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 20px;
    width: 20px;
    background-color: #e2e2e2;
    border-radius: 4px;
    border: 0px solid #ccc;
    transition: background-color 0.3s, border-color 0.3s;
}

/* При наведении - изменения цвета */
.custom-checkbox:hover input~.checkmark {
    background-color: #e6e6e6;
    border-color: #999;
}

/* Стиль для активного состояния (при выборе) */
.custom-checkbox input:checked~.checkmark {
    background-color: #4CAF50;
    border-color: #4CAF50;
}

/* Стиль галочки (отмеченное состояние) */
.custom-checkbox .checkmark::after {
    content: "";
    position: absolute;
    display: none;
    left: 7px;
    top: 3px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
}

/* Показ галочки, если чекбокс активен */
.custom-checkbox input:checked~.checkmark::after {
    display: block;
}
</style>
