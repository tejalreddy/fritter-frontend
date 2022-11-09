<!-- Page for account sign-in and registration -->
<!-- User should be NOT authenticated in order to see this page -->

<template>
  <main>
    <section v-if="newAccount">
      <header>
        <h2>New to Fritter?</h2>
      </header>
      <RegisterForm />
      <u 
        @click="switchMode">
          Have an account?
      </u>
    </section>
    <section v-if="!newAccount">
      <header>
        <h2>Have an account?</h2>
      </header>
      <LoginForm />
      <u 
        @click="switchMode">
          New to Fritter?
      </u>
    </section>
  </main>
</template>

<script>
import RegisterForm from '@/components/Login/RegisterForm.vue';
import LoginForm from '@/components/Login/LoginForm.vue';

export default {
  name: 'LoginPage',
  components: {
    RegisterForm,
    LoginForm
  },
  data() {
    return {
      newAccount: false
    }
  },
  methods: {
    switchMode() {
      this.newAccount = !this.newAccount;
    }
  }
};
</script>
