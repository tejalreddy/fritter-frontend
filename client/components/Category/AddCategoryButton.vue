<template>
    <article>
    <button class="addCategoryButton"
    v-if="!adding"
    @click="startAdding">
    Add a Category
    </button>
    <div v-else-if="adding">
    <textarea
        class="content"
        :value="draft"
        @input="draft = $event.target.value"
    />
    <button class="addCategoryButton"
        @click="cancelAdding">
        Cancel
    </button>
    <button class="addCategoryButton"
        @click="stopAdding">
        Done
    </button>
    </div>
    </article>
</template>

<script>
export default {
    name: 'AddCategoryButton',
    data() {
        return {
            adding: false, // whether we are adding a category or not
            draft: "",
            alerts: {}
        };
    },
    methods: {
        startAdding() {
            /**
             * Enables a category to be added
             */
            this.adding = true;
        },
        stopAdding() {
            /**
             * Hit when a user finishes adding a category
             * 
             * Post to /api/categories
             */
            this.adding = false;

            if (this.$store.state.categories.map(category => category.name).includes(this.draft)) {
                const error = 'Error: Cannot add category since category already exists.';
                this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
                setTimeout(() => this.$delete(this.alerts, error), 3000);
                return;
            }
            if (this.draft === "") {
                const error = 'Error: No category name inputted.';
                this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
                setTimeout(() => this.$delete(this.alerts, error), 3000);
                return;
            }

            const params = {
                method: 'POST',
                message: 'Successfully created category!',
                body: JSON.stringify({name: this.draft}),
                callback: () => {
                    this.$set(this.alerts, params.message, 'success');
                    setTimeout(() => this.$delete(this.alerts, params.message), 3000);
                }
            };
            this.request(params, '/api/categories');
            this.draft = "";
        },
        cancelAdding() {
            this.adding = false;
            this.draft = "";
        },
        async request(params, url) {
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
                const r = await fetch(url, options);
                console.log(r);
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
        },
    }
}
</script>

<style>
.addCategoryButton {
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
}
</style>