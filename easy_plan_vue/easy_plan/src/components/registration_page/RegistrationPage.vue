<script>
import { loginUser } from '../../api.js';
import { registerUser } from '../../api.js';

export default {
    name: '',
    components: {},
    props: {},
    data() {
        return {
            nameField: "",
            emailField: "",
            passwordField: "",
            nameError: "",
            emailError: "",
            passwodError: "",
            errorDict: {
                uncorrectNameErr: "Имя должно быть не короче 5 символов",
                existingNameErr: "Имя уже занято",
                uncorrectEmailFormatErr: "Некорректный формат email",
                uncorrectPasswordFormanErr: "Пароль слишком слабый",
                requiredFieldError: "Обязательное поле",
            }
        }
    },
    computed: {},
    methods: {
        nameFieldValidator() {
            if (this.nameField.trim() === '') {
                this.nameError = this.errorDict.requiredFieldError;
                return;
            }
            if (!(/^(([a-zA-Zа-яА-ЯёЁ]+\s){0,})+[a-zA-Zа-яА-ЯёЁ]+$/.test(this.nameField.trim()))) {
                this.nameError = this.errorDict.uncorrectNameErr
            } else {
                this.nameError = "";
            };
        },
        emailFieldValidator() {
            if (this.emailField.trim() === '') {
                this.emailError = this.errorDict.requiredFieldError;
                return;
            }
            if (!(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+$/.test(this.emailField.trim()))) {
                this.emailError = this.errorDict.uncorrectEmailFormatErr
            } else {
                this.emailError = "";
            };
        },
        passwordFieldValidator() {
            if (this.passwordField.trim() === '') {
                this.passwodError = this.errorDict.requiredFieldError;
                return;
            }
            if (!(/(?=.*[0-9])(?=.*[a-z]).{8,}$/.test(this.passwordField.trim()))) {
                this.passwodError = this.errorDict.uncorrectPasswordFormanErr
            } else {
                this.passwodError = "";
            };
        },
        inputFieldsValidation() {
            this.nameFieldValidator();
            this.emailFieldValidator();
            this.passwordFieldValidator();
            if (this.emailError == "" && this.nameError == "" && this.passwodError == "") {
                const userData = {
                    username: this.nameField.trim(),
                    email: this.emailField.trim(),
                    password: this.passwordField.trim(),
                };
                try {
                    const response = registerUser(userData);
                    console.log('Успешная авторизация:', response.data);
                } catch (error) {
                    console.error('Ошибка авторизации:', error);
                }
            }
        },
        async handleLogin() {
            try {
                const response = await loginUser({ username: this.username, password: this.password });
                console.log('Успешная авторизация:', response.data);
            } catch (error) {
                console.error('Ошибка авторизации:', error);
            }
        },
    }
}
</script>

<template>
    <div className="login-page-wrapper">
        <div className="login-window">
            <div className="login-window-content-wrapper">
                <div className="login-window-content-header">
                    Давай создадим аккаунт!
                </div>
                <div className="login-window-content-inputs-wrapper">
                    <div className="login-window-input-element">
                        <form className="login-form" method="post">
                            <input type="text" size="40" placeholder="Никнейм" v-model="nameField"
                                className="login-form-input" />
                        </form>
                        <div className="login-window-input-error">
                            <p>{{ nameError }}</p>
                        </div>
                    </div>
                    <div className="login-window-input-element">
                        <form className="login-form" method="post">
                            <input type="text" size="40" placeholder="E-mail" v-model="emailField"
                                className="login-form-input" />
                        </form>
                        <div className="login-window-input-error">
                            <p>{{ emailError }}</p>
                        </div>
                    </div>
                    <div className="login-window-input-element">
                        <form className="login-form" method="post">
                            <input type="password" size="40" placeholder="Password" v-model="passwordField"
                                className="login-form-input" />
                        </form>
                        <div className="login-window-input-error">
                            <p>{{ passwodError }}</p>
                        </div>
                    </div>
                </div>
                <div className="login-window-content-button">
                    <p className="login-window-content-button-text" @click="inputFieldsValidation()">Создать аккаунт</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
