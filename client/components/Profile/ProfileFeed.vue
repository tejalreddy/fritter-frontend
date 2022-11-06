<template>
    <article>
        <FreetComponent
                v-if="!clickedCategory"
                v-for="freet in $store.getters.getUserFreets"
                :key="freet.id"
                :freet="freet"
            />
        <FreetComponent
            v-if="clickedCategory"
            v-for="freet in categoryFreets"
            :key="freet.id"
            :freet="freet"
        />
    </article>
</template>

<script>
import FreetComponent from '@/components/Freet/FreetComponent.vue'

export default {
    name: 'ProfileFeed',
    components: {FreetComponent},
    props: {
        clickedCategory: {
            type: Object,
            required: false
        },
    },
    watch: {
        /**
         * Watch clickedCategory to gather freets for new selected category
         */
         clickedCategory: function(newVal, oldVal) {
            if (newVal) {
                const freetBelongings = [];
                const freetsWithCategoryNames = this.$store.getters.getUserFreets.forEach(freet => {
                    freet.categories.forEach(category => {
                        if (category.name == newVal.name) {
                            freetBelongings.push(freet);
                        }
                    });
                });
                this.categoryFreets = freetBelongings;
            }
        }
    },
    data() {
        return {
            categoryFreets: [],
            alerts: {}
        }
    },
    methods: {
        filterCategory() {
            console.log(this.clickedCategory);
        },
        getCategoryFreets(val) {
            const params = {
                    method: 'GET',
                    message: 'Successfully obtained category freets',
                    callback: () => {
                        this.$set(this.alerts, params.message, 'success');
                        setTimeout(() => this.$delete(this.alerts, params.message), 3000);
                    }
            };
            this.request(params, val.name);
        },
        async request(params, categoryName) {
            console.log(categoryName);
            /**
             * Submit a request to the category endpoint
             */
            const options = {
                method: params.method, headers: {'Content-Type': 'application/json'}
            };
            if (params.body) {
                options.body = params.body;
            }

            try {
                const r = await fetch(`/api/categories/${categoryName}/freets`, options);
                if (!r.ok) {
                    const res = await r.json();
                    throw new Error(res.error);
                }
                const res = await r.json();
                this.categoryFreets = res;
                console.log(res);
                params.callback();
            } catch (e) {
                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
        },
    }
}
</script>