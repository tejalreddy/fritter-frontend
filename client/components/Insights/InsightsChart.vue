<template>
    <canvas id="insights-chart"></canvas>
</template>
  
  <script>
  import Chart from 'chart.js'
  
  export default {
    name: 'InsightsChart',
    components: {Chart},
    data() {
        return {
            insightsChartData: {
                type: "line",
                data: {
                    labels: [],
                    datasets: [{
                        label: "Insights Data",
                        data: [],
                        backgroundColor: "rgba(116, 165, 127, .5)",
                        borderColor: "#74A57F",
                        borderWidth: 3
                    }]
                },
                options: {
                    responsive: true,
                    lineTension: 1,
                    scales: {
                        yAxes: [
                            {
                            ticks: {
                                beginAtZero: true,
                                padding: 25
                            }
                            }
                        ]
                    }
                }
            },
            alerts: {}
        }
    },
    mounted() {
        this.$store.commit('getInsightsData');
        this.insightsChartData.data.labels = this.$store.state.insightsData.map(log => log.date);
        this.insightsChartData.data.datasets[0].data = this.$store.state.insightsData.map(log => Math.floor(log.totalTime / 60000))
        const ctx = document.getElementById('insights-chart');
        new Chart(ctx, this.insightsChartData);
    },
  }
  </script>