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
      this.$store.commit('refreshFollows');
      this.$store.commit('getInsightsData');
    });

    this.$store.state.alerts = {};
  },
  mounted() {
    window.setInterval(() => {
      if (this.$store.state.username != null) {
        this.calculateTotalTime();
        this.$store.commit('setBeginTime');
      }
    }, 30000)
  },
  data() {
    return {
      alerts: {},
    }
  },
  methods: {
    async calculateTotalTime() {
      const totalTime = Date.now() - this.$store.state.begin_time
      const params = {
                method: 'PUT',
                message: 'Successfully added time!',
                body: JSON.stringify({totalTime: totalTime}),
                callback: () => {
                    this.$set(this.alerts, params.message, 'success');
                    setTimeout(() => this.$delete(this.alerts, params.message), 3000);
                }
      };
      this.request(params);
    },
    async request(params) {
      /**
       * Submit an upsert to the Insights endpoint
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };

      if (params.body) {
          options.body = params.body;
      }

      try {
          const r = await fetch('/api/insights', options);
          if (!r.ok) {
              const res = await r.json();
              throw new Error(res.error);
          }
          const res = await r.json();
          params.callback();
      } catch (e) {
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
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
  font-family: system-ui,-apple-system,system-ui,"Helvetica Neue",Helvetica,Arial,sans-serif;
  background-color: rgba(7, 113, 135, .1);
}

main {
  padding: 0 5em 5em;
}

/** Styling from: https://www.w3schools.com/css/tryit.asp?filename=trycss_form_textarea */
textarea {
  width: 100%;
  height: 150px;
  padding: 12px 20px;
  box-sizing: border-box;
  border: 2px solid #ccc;
  border-radius: 4px;
  background-color: #f8f8f8;
  font-family: system-ui,-apple-system,system-ui,"Helvetica Neue",Helvetica,Arial,sans-serif;
  font-size: 16px;
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

/* CSS from https://getcssscan.com/css-buttons-examples */
.button-6 {
  align-items: center;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: .25rem;
  box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 0;
  box-sizing: border-box;
  color: rgba(0, 0, 0, 0.85);
  cursor: pointer;
  display: inline-flex;
  font-family: system-ui,-apple-system,system-ui,"Helvetica Neue",Helvetica,Arial,sans-serif;
  font-size: 16px;
  font-weight: 400;
  justify-content: center;
  line-height: 1.25;
  margin: 0;
  min-height: .6rem;
  padding: calc(.875rem - 1px) calc(1.5rem - 1px);
  position: relative;
  text-decoration: none;
  transition: all 250ms;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: baseline;
  width: auto;
}

.button-6:hover,
.button-6:focus {
  border-color: rgba(0, 0, 0, 0.15);
  box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
  color: rgba(0, 0, 0, 0.65);
}

.button-6:hover {
  transform: translateY(-1px);
}

.button-6:active {
  background-color: #F0F0F1;
  border-color: rgba(0, 0, 0, 0.15);
  box-shadow: rgba(0, 0, 0, 0.06) 0 2px 4px;
  color: rgba(0, 0, 0, 0.65);
  transform: translateY(0);
}
</style>
