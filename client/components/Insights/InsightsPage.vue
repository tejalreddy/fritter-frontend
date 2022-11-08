<template>
    <main>
    <div>
        <h2 class="insights-header"
        v-if="minutes !== 1"
        >You have been on Fritter for {{ minutes }} minutes today.</h2>
        <h2 class="insights-header"
        v-else
        >You have been on Fritter for {{ minutes }} minute today.</h2>
    </div>
    <InsightsChart/>
    </main>
</template>

<script>
import InsightsChart from '@/components/Insights/InsightsChart.vue'

export default {
    name: 'InsightsPage',
    components: {InsightsChart},
    data() {
        return {
            minutes: 0,
            alerts: {}
        }
    },
    created() {
        const date = new Date();
        let dateString = date.toLocaleString().split(',')[0];
        dateString = dateString.replaceAll('/', '-');
        const params = {
                method: 'GET',
                message: 'Successfully unliked freet!',
                callback: () => {
                    this.$set(this.alerts, params.message, 'success');
                    setTimeout(() => this.$delete(this.alerts, params.message), 3000);
                }
        };
        this.request(params, dateString);
    },
    methods: {
        async request(params, date) {
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
                const r = await fetch(`/api/insights/${date}`, options);
                if (!r.ok) {
                    const res = await r.json();
                    throw new Error(res.error);
                }
                
                const res = await r.json();
                this.minutes = Math.floor(res.insights.totalTime / 60000);
                params.callback();
            } catch (e) {
                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
        }
    }
}

</script>

<style scoped>
.insights-header {
    display: flex;
    justify-content: center;
}

</style>