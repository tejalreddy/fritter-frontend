<template>
  <div id="app">
    <header>
      <NavBar />
    </header>
    <router-view />
  </div>
</template>

<script>
import NavBar from '@/components/common/NavBar.vue';

export default {
  name: 'App',
  components: {NavBar},
  beforeCreate() {
    // Sync stored username to current session
    fetch('/api/users/session', {
      credentials: 'same-origin' // Sends express-session credentials with request
    }).then(res => res.json()).then(res => {
      const user = res.user;
      this.$store.commit('setUsername', user ? user.username : null);
      this.$store.commit('refreshLikes');
      this.$store.commit('setBeginTime');
      this.$store.commit('refreshCategories');
      console.log('begin time is ' + this.$store.state.begin_time);
      if (this.$store.state.username != null) {
        window.addEventListener('beforeunload', () => {
          calculateTotalTime();
        });
      }
    });

    this.$store.state.alerts = {};
  },
  methods: {
    calculateTotalTime() {
      const totalTime = Date.now() - this.$store.state.begin_time
      console.log(calculateTotalTime);
    },
    async request(params) {
      /**
       * Submit an upsert to the Insights endpoint
       */
    }
  }
};
</script>

<style>
* {
  box-sizing: border-box;
}

body {
  height: 100vh;
  flex-direction: column;
  display: flex;
  padding: 0;
  margin: 0;
  font-size: 1.2em;
}

main {
  padding: 0 5em 5em;
}

.alerts {
    position: absolute;
    z-index: 99;
    bottom: 0;
    top: 100%;
    left: 50%;
    transform: translate(-50%, 10%);
    width: 100%;
    text-align: center;
}

.alerts article {
    border-radius: 5px;
    padding: 10px 20px;
    color: #fff;
}

.alerts p {
    margin: 0;
}

.alerts .error {
    background-color: rgb(166, 23, 33);
}

.alerts .success {
    background-color: rgb(45, 135, 87);
}
</style>
