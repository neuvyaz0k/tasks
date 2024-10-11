<script setup>
import { CheckIcon } from "@heroicons/vue/24/outline";
</script>

<script>
export default {
    name: "",
    components: {},
    props: {},
    data() {
        return {
            items: [
                {
                    id: 1,
                    header: "Планируй",
                    subItemsList: [
                        "Создавай задачи",
                        "Устанавливай сроки",
                        "Определяй приоритет",
                    ],
                    color: 'rgba(245, 232, 116, 1)',
                },
                {
                    id: 2,
                    header: "Отслеживай",
                    subItemsList: [
                        "Следи за временем",
                        "Прогресс-бары задач",
                        "Получай уведомления",
                    ],
                    color: 'rgba(116, 222, 245, 1)',
                },
                {
                    id: 3,
                    header: "Завершай",
                    subItemsList: [
                        "Статистика",
                        "История задачи",
                        "Возвращайся к задаче",
                    ],
                    color: 'rgba(226, 213, 254, 1)',
                }
            ]
        };
    },
    computed: {},
    methods: {

    },
};
</script>
<template>
    <div className="first-component-body">
        <div className='tickets-wrapper'>
            <div :style="{ backgroundColor: item.color }" v-for="item in items" className="first-component-element"
                key={{item.id}}>
                <div className="first-component-image">
                    <img src="../../assets/image/pin.png" alt='pin' />
                </div>
                <div className="first-component-element-header">
                    <p className="first-component-element-header-text">{{ item.header }}</p>
                </div>
                <div className="first-component-element-list">
                    <div v-for="subItem in item.subItemsList" className="first-component-element-list-item">

                        <p className="first-component-element-list-item-text">

                        <div class="check-icon">
                            <CheckIcon />
                        </div>
                        {{ subItem }}
                        </p>

                    </div>
                </div>
            </div>
        </div>
        <div className="first-component-header">
            <p className="first-component-header-text">Работаешь один?</p>
        </div>
    </div>
</template>
<style scoped></style>
