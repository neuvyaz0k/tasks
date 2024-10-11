<script>
import Desk from './desk.vue';
import { v4 as uuidv4 } from 'uuid';
import 'primeicons/primeicons.css'
import { getBoardData } from '../../api.js';

export default {
    components: {
        Desk,
    },
    data() {
        return {
            emptyColumn: {
                title: 'No title',
                cards: []
            },
            sectionMenuActions: [
                'Delete section',
                'Create column',
            ],
            isButtonsShow: false,
            actionsSectionMenuStatuses: [],
            deleteCount: 10,
            testId: uuidv4(),
            isAccountWindowOpen: true,
            editableUser: {
                name: '',
                email: '',
                role: ''
            },
            roles: ['programmer', 'qa engineer', 'manager', 'devops'],
            isAccountWindowOpen: false,
            isEditingName: false,
            isEditingEmail: false,
            isEditingRole: false,
            user: {
                name: 'Ivan Ivanov',
                email: 'email@mail.su',
                role: 'programmer',
                avatar: 'https://avatars.mds.yandex.net/i?id=af323ca978c6d79c7ee6bf4400e604309a88a436-8199407-images-thumbs&n=13'
            },
            assignee: [
                {
                    id: this.testId, name: 'John', role: 'programmer'
                },
                {
                    id: uuidv4(), name: 'Liza', role: 'qa engeneer'
                },
                {
                    id: uuidv4(), name: 'Ivan', role: 'manager'
                },
                {
                    id: uuidv4(), name: 'Fedor', role: 'devops'
                }

            ],
            deskData: null
        }
    },
    created() {
        this.deskData.forEach(() => {
            this.actionsSectionMenuStatuses.push(false)
        });
    },
    async mounted() {
        try {
            const data = await getBoardData();
            this.deskData = data.desk; // Данные самой доски
        } catch (error) {
            console.error('Не удалось загрузить данные доски', error);
        }
    },
    computed: {
        isEditing() {
            return this.isEditingName || this.isEditingEmail || this.isEditingRole;
        }
    },
    methods: {
        sectionActionCall(sectionIndex, actionIndex) {
            switch (actionIndex) {
                case 0:
                    this.deleteSection(sectionIndex);
                    break;
                case 1:
                    this.createColumn(sectionIndex)
                    break;
                default:
                    break;
            }
        },
        deleteSection(sectionIndex) {
            this.deskData.splice(sectionIndex, 1);
        },
        createColumn(sectionIndex) {
            this.deskData[sectionIndex].columns.push(this.emptyColumn)
        },
        deleteSelected() { },
        changeActionMenuSectionStatus(index) {
            this.actionsSectionMenuStatuses[index] = !this.actionsSectionMenuStatuses[index];
        },
        updateColumns(newColumns, sectionIndex) {
            console.log(newColumns)
            this.deskData[sectionIndex].columns = newColumns;
        },
        toggleAccountWindow() {
            this.isAccountWindowOpen = !this.isAccountWindowOpen;
        },
        toggleEdit(field) {
            if (field === 'name') {
                this.isEditingName = !this.isEditingName;
                this.editableUser.name = this.user.name;
            } else if (field === 'email') {
                this.isEditingEmail = !this.isEditingEmail;
                this.editableUser.email = this.user.email;
            } else if (field === 'role') {
                this.isEditingRole = !this.isEditingRole;
                this.editableUser.role = this.user.role;
            }
        },
        saveChanges() {
            if (this.isEditingName) {
                this.user.name = this.editableUser.name;
                this.isEditingName = false;
            }
            if (this.isEditingEmail) {
                this.user.email = this.editableUser.email;
                this.isEditingEmail = false;
            }
            if (this.isEditingRole) {
                this.user.role = this.editableUser.role;
                this.isEditingRole = false;
            }
        },
        deleteAccount() {
            // Логика удаления аккаунта
            console.log('Аккаунт удалён');
        },
        editAvatar() {
            // Логика изменения аватара
            console.log('Редактирование аватара');
        }
    }
}
</script>

<template>
    <div class="desk-main-screen">
        <div class="header-main-screen">
            <div class="account-link-wrapper">
                <!-- Аватарка пользователя -->
                <div class="user-avatar" @click="toggleAccountWindow">
                    <img v-if="user.avatar" :src="user.avatar" alt="User Avatar" />
                </div>

                <!-- Окно профиля -->
                <div v-if="isAccountWindowOpen" class="user-account-vue-open">
                    <div class="user-data-wrapper">
                        <!-- Аватар с возможностью редактирования при двойном клике -->
                        <div class="user-avatar-wrapper">
                            <div class="user-avatar" @dblclick="editAvatar">
                                <img v-if="user.avatar" :src="user.avatar" alt="User Avatar" />
                            </div>
                        </div>

                        <!-- Данные пользователя -->
                        <div class="user-credits-wrapper">
                            <!-- Поле имени с возможностью редактирования -->
                            <div class="name-field">
                                <input v-if="isEditingName" v-model="editableUser.name"
                                    class="user-credits-edit-input" />
                                <p v-else>{{ user.name }}</p>
                                <div @click="toggleEdit('name')" class="edit-icon">
                                    <i class="pi pi-pencil">
                                    </i>
                                </div>
                            </div>

                            <!-- Поле почты с возможностью редактирования -->
                            <div class="email-field">
                                <input v-if="isEditingEmail" v-model="editableUser.email"
                                    class="user-credits-edit-input" />
                                <p v-else>{{ user.email }}</p>
                                <div @click="toggleEdit('email')" class="edit-icon">
                                    <i class="pi pi-pencil">
                                    </i>
                                </div>
                            </div>

                            <!-- Поле роли с селектором ролей -->
                            <div class="role-field">
                                <select v-if="isEditingRole" v-model="editableUser.role" class="user-role-select">
                                    <option v-for="role in roles" :key="role" :value="role">{{ role }}</option>
                                </select>
                                <p v-else>{{ user.role }}</p>
                                <div @click="toggleEdit('role')" class="edit-icon">
                                    <i class="pi pi-pencil">
                                    </i>
                                </div>
                            </div>
                        </div>

                        <!-- Кнопки -->
                        <div class="button-wrapper">
                            <button v-if="isEditing" @click="saveChanges" class="save-button">Сохранить</button>
                            <button v-else @click="deleteAccount" class="logout-button">Выйти</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="sections">
            <div class="section-wrapper" v-for="(section, sectionIndex) in deskData" :key="sectionIndex">
                <div class="section-header">
                    <div class="header-name">{{ section.name }}</div>
                    <div class="actions">
                        <div class="action-buttons" v-if="isButtonsShow">
                            <div class="delete-button">
                                Delete
                            </div>
                            <div class="cards-count">
                                {{ deleteCount }}
                            </div>
                        </div>
                        <div class="splitter"></div>
                        <div class="settings-wrapper">
                            <div class="setting-button" @click="changeActionMenuSectionStatus(sectionIndex)">
                                ⋮
                            </div>
                            <div class="dropdown-menu" v-if="actionsSectionMenuStatuses[sectionIndex]">
                                <div class="dropdown-menu-elems-wrapper">
                                    <div class="dropdown-menu-elem" v-for="(action, actionIndex) in sectionMenuActions"
                                        @click="sectionActionCall(sectionIndex, actionIndex)" :key="actionIndex">
                                        <p class="action-text">{{ sectionMenuActions[actionIndex] }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="taksboard-wrapper">
                    <Desk :columnsData="section.columns" :assigneeList="assignee" :sectionIndex="sectionIndex"
                        @update-columns="updateColumns" />
                    <!-- <Desk v-model="section.columns" /> -->
                </div>
            </div>
        </div>
    </div>
</template>


<style>
.sections {
    width: 100%;
}

.section-wrapper {
    padding: 20px;
    display: flex;
    flex-direction: column;
}

.section-header {
    padding: 10px;
    display: flex;
    flex-direction: row;
    background: #9e9e9e;
    border: 10px black;
    border-radius: 5px;
    justify-content: space-between;
    align-items: center;
    user-select: none;
    font-size: 24px;
    font-weight: bold;
}

.actions {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.settings-wrapper {
    padding: 3px;
}

.action-buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.setting-button {
    border: none;
    font-size: 21px;
    cursor: pointer;
    user-select: none
}

.splitter {
    width: 10px;
}

.delete-button {
    padding: 2px;
    border: 1px;
    font-weight: 500;
    font-size: 20px;
    text-decoration-color: black;
    background: rgb(231, 203, 203);
    cursor: pointer;
}

.settings-wrapper {
    width: 150px;
    display: flex;
    justify-content: right;
    position: relative;
}

.dropdown-menu {
    z-index: 1;
    position: absolute;
    margin-top: 35px;
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
    padding: 5px;
    margin: 1px;
    height: 40px;
    font-size: 17px;
    font-weight: normal;
    align-content: right;
    cursor: pointer;
}

.dropdown-menu-elem:hover {
    background: rgb(209, 209, 209);
}

.action-text {
    user-select: none
}

body {
    padding: 0px
}

.desk-main-screen {
    width: 100%;
    padding: 0px;
    margin: 0px;
    display: flex;
    flex-direction: column;
}

.header-main-screen {
    position: relative;
    width: 100%;
    padding: 5px;
    background: #cbe4cc;
    display: flex;
    flex-direction: row;
    justify-content: right;
    align-items: center;
}

.account-account-vue-wrapper {
    position: relative;
    height: 100%;
    width: 100px;
    background: #cad6cb;
}

.header-main-screen {
    display: flex;
    justify-content: flex-end;
    padding: 10px 20px 10px 0px;
}

.account-link-wrapper {
    position: relative;
}

.user-avatar {
    width: 80px;
    height: 80px;
    background-color: #ccc;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}

.user-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.user-account-vue-open {
    position: absolute;
    top: 100%;
    right: 0;
    width: 340px;
    background-color: rgb(245, 245, 245);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    padding: 20px;
    z-index: 10;
}

.user-data-wrapper {
    display: flex;
    flex-direction: column;
}

.user-avatar-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

.user-credits-wrapper {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: rgba(233, 233, 233, 0.568);
    padding: 10px;
}

.name-field,
.email-field,
.role-field {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px;
    height: 35px;
}

.user-credits-edit-input,
.user-role-select {
    width: 100%;
    padding: 5px;
    font-size: 14px;
    height: 28px;
}

.edit-icon {
    width: 20px;
    height: 20px;
    display: flex;
    align-content: center;
    background-color: #e7e7e7;
    border-radius: 50%;
    cursor: pointer;
    margin-left: 10px;
    border: 1px
}

.button-wrapper {
    margin-top: 15px;
    display: flex;
    justify-content: center;
}

.logout-button,
.save-button {
    padding: 10px 20px;
    font-size: 14px;
    border: none;
    cursor: pointer;
    color: white;
    border-radius: 5px;
}

.logout-button {
    background-color: rgb(255, 109, 109);
}

.save-button {
    background-color: green;
}
</style>
