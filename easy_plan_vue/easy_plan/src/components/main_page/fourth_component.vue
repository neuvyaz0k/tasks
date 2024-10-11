<script>
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {}
  },
  computed: {},
  methods: {
    goToRegistrationPage() {
      console.log('reroute');
      // this.$router.push('/registration');
      this.$router.push({path: '/desk', replace: true});
      // this.$router.replace({ path: '/desk' })
    },
  }
}
</script>
<template>
    <div className='fourth-component-body'>
        <div className='fourth-component-content-image-wrapper'>
            <img src="../../assets/image/main_screen_fourth_component.png" alt='meeting' className='fourth-component-content-image' />
        </div>
        <div className='fourth-component-content-rigth-wrapper'>
            <div className='fourth-component-content-rigth-text-wrapper'>
                <p className='fourth-component-content-rigth-text'>
                    Попробуй Easy Plan прямо сейчас
                </p>
            </div>
            <div className='fourth-component-content-rigth-button' @click="goToRegistrationPage()">
                <p className='fourth-component-content-rigth-button-text' to="login">
                    Зарегистрироваться
                </p>
            </div>
        </div>
    </div>
</template>
<style scoped>
</style>
