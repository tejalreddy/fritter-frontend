<template>
    <div>
        <label class="typo__label">Tagging</label>
        <multiselect 
            v-model="value" 
            label="name" 
            track-by="name" 
            :options="options" 
            :multiple="true" 
            :hideSelected="true" 
            :taggable="true" 
            @select="addCategory" 
            @remove="removeCategory">
        </multiselect>
    </div>
</template>

<script>
import Multiselect from 'vue-multiselect'

export default {
    name: "AddToCategoryButton",
    components: {Multiselect},
    props: {
        // freet being added
        freet: {
            type: Object,
            required: true
        }
    },
    watch: {
        /**
         * Updates the options and value whenever freets are updated
         */
        '$store.state.freets'(val) {
            // set options based on user's categories
            this.options = []
            for (let category of this.$store.state.categories) {
                const tag = {name: category.name};
                this.options.push(tag);
            }
        
            // set values of categories already selected for a freet
            this.value = []
            for (let category of this.freet.categories) {
                const tag = {name: category.name};
                this.value.push(tag);
            }
        }
    },
    created() {
        // set options based on user's categories
        for (let category of this.$store.state.categories) {
            const tag = {name: category.name};
            this.options.push(tag);
        }
        
        // pre-set values of categories already selected for a freet
        for (let category of this.freet.categories) {
            const tag = {name: category.name};
            this.value.push(tag);
        }
    },
    data() {
        return {
        value: [],
        options: [],
        alerts: {}
    };
    },
    methods: {
        addCategory(value) {
            /**
             * Add freet to a category
             */
            const params = {
                method: 'POST',
                message: 'Successfully added freet to category',
                body: JSON.stringify({freetId: this.freet._id}),
                callback: () => {
                    this.$set(this.alerts, params.message, 'success');
                    setTimeout(() => this.$delete(this.alerts, params.message), 3000);
                }
            };
            
            this.request(params, value.name);
        },
        removeCategory(value) {
            /**
             * Remove freet from a category
             */
            const params = {
                method: 'DELETE',
                message: 'Successfully removed freet from category',
                body: JSON.stringify({freetId: this.freet._id}),
                callback: () => {
                    this.$set(this.alerts, params.message, 'success');
                    setTimeout(() => this.$delete(this.alerts, params.message), 3000);
                }
            };
            this.request(params, value.name);
        },
        async request(params, categoryName) {
            /**
             * Submits a request to the category endpoint
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

                this.$store.commit('refreshCategories');
                this.$store.commit('refreshFreets');
                params.callback();
            } catch (e) {
                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
        }
    }
}

</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>