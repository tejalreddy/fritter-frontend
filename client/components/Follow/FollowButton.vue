<template>
    <div
        v-if="followedUsername !== $store.state.username">
        <button 
            v-if="$store.state.following.map(follow => follow.followedName).indexOf(followedUsername) < 0"
            @click="followUser">
             Follow
        </button>
        <button 
            v-else
            @click="unfollowUser">
            Unfollow
        </button>
    </div>
</template>

<script>

export default {
    name: 'FollowButton',
    props: {
        followedUsername: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            alerts: {}
        };
    },
    methods: {
        followUser() {
            /**
             * Allows user to follow another user
             */
            const params = {
                method: 'POST',
                message: 'Successfully followed user!',
                body: JSON.stringify({username: this.followedUsername}),
                callback: () => {
                    this.$set(this.alerts, params.message, 'success');
                    setTimeout(() => this.$delete(this.alerts, params.message), 3000);
                }
            };
            console.log(params);
            this.request(params);

        },
        unfollowUser() {
            /**
             * Allows user to unfollow another user
             */
             const params = {
                method: 'DELETE',
                message: 'Successfully followed user!',
                body: JSON.stringify({username: this.followedUsername}),
                callback: () => {
                    this.$set(this.alerts, params.message, 'success');
                    setTimeout(() => this.$delete(this.alerts, params.message), 3000);
                }
            };
            this.request(params);

        },
        async request(params) {
            /**
             * Submit a request to the like endpoint
             */
            const options = {
                method: params.method, headers: {'Content-Type': 'application/json'}
            };
            if (params.body) {
                options.body = params.body;
            }

            try {
                const r = await fetch('/api/follows', options);
                if (!r.ok) {
                    const res = await r.json();
                    throw new Error(res.error);
                }
                
                this.$store.commit('refreshFreets');
                this.$store.commit('refreshFollows');
                params.callback();
            } catch (e) {
                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
        }
    }
}
</script>