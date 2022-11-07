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
      if (this.$store.state.username != null) {
        window.addEventListener('beforeunload', () => {
          this.calculateTotalTime();
        });
      }
    });

    this.$store.state.alerts = {};
  },
  data() {
    return {
      alerts: {}
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
      await this.request(params);
    },
    request(params) {
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
        const success = navigator.sendBeacon('/api/insights', options);
        console.log(success);
          // const r = fetch('/api/insights', options);
          // if (!r.ok) {
          //     const res = r.json();
          //     throw new Error(res.error);
          // }
          // const res = r.json();
          // console.log(res);
      } catch (e) {
          this.$set(this.alerts, e, 'error');
          console.log(this.alerts);
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
