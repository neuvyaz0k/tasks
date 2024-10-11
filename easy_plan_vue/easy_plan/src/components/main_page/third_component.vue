<script setup>
import { CheckIcon } from "@heroicons/vue/24/outline";
</script>

<script>
export default {
    name: '',
    components: {},
    props: {},
    data() {
        return {
            listItems: ["Управляй задачами", "Работай в команде", "Создавай колонки и темы", "Составляй цепочки"],
        }
    },
    computed: {},
    methods: {}
}
</script>
<template>
    <div className='third-component-body'>
        <div className='third-component-main-content-wrapper'>
            <div className='third-component-content-image-wrapper'>
                <img src="../../assets/image/Frame 21-1.png" alt="pic"
                    className='third-component-content-image-violetTicket third-component-content-image' />
                <img src="../../assets/image/Frame 22.png" alt="pic"
                    className='third-component-content-image-yellowTicket third-component-content-image' />
                <img src="../../assets/image/Frame 21.png" alt="pic"
                    className='third-component-content-image-blueTicket third-component-content-image' />
                <img src="../../assets/image/Vector 1.png" alt="pic"
                    className='third-component-content-image-vectors1 third-component-content-image' />
                <img src="../../assets/image/Vector 2.png" alt="pic"
                    className='third-component-content-image-vectors2 third-component-content-image' />
            </div>
            <div className='third-component-content-list-wrapper'>
                <div v-for="elem in listItems" className='third-component-content-list-item' key={{elem}}>
                    <p>
                    <div class="check-icon-1">
                        <CheckIcon />
                    </div>
                    {{ elem }}
                    </p>
                </div>

            </div>
        </div>
        <div className='third-component-header-wrapper'>
            <p className='third-component-header-text'>
                Нужна доска для командной работы?
            </p>
        </div>
    </div>
</template>
<style scoped></style>
