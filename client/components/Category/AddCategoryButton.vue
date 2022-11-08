<template>
    <article>
    <button class="button-6 addCategoryButton"
    v-if="!adding"
    @click="startAdding">
    Add a Category
    </button>
    <div class="category-adding"
    v-else-if="adding">
    <textarea
        class="content"
        :value="draft"
        @input="draft = $event.target.value"
    />
    <section class="category-button-section">
        <button class="button-6 addCategoryButton-left"
            @click="cancelAdding">
            Cancel
        </button>
        <button class="button-6 addCategoryButton-right"
            @click="stopAdding">
            Done
        </button>
    </section>
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

<style scoped>
.addCategoryButton {
    padding:8px;
}

.addCategoryButton-left {
    padding:5px;
    font-size: 15px;
    margin-right: 3px;
    height:40px;
}

.addCategoryButton-right {
    padding:5px;
    font-size: 15px;
    height:40px;
}

.content {
    height: 70px;
}

.category-adding {
    display: flex;
    margin:0px;
    padding:0px;
}

.category-button-section {
    margin-left: 5px;
    display: flex;
    margin-top: 13px;
}

</style>