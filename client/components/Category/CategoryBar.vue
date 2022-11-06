<template>
<article>
    <div 
        class="categoryBox"
        :style="{backgroundColor: clicked ? 'green' : 'white'}">
        <p
            v-if="!editName" 
            @click="filterByCategory">
            {{category.name}}
        </p>
        <button 
            @click="deleteCategory(category.name)" 
            class="deleteButton">X
        </button>
        <button 
            v-if="!editName"
            @click="editCategoryName">
            Edit name
        </button>
        <textarea
            v-if="editName"
            class="content"
            :value="draft"
            @input="draft = $event.target.value"
        />
        <button 
            v-if="editName"
            @click="doneEditingName">
            Done
        </button>
    </div>
</article>
</template>

<script>
export default {
    name: 'CategoryBar',
    props: {
        category: {
            type: Object,
            required: true
        },
        clickedCategory: {
            type: Object,
            required: false
        }
    },
    watch: { 
        /**
         * Watch clickedCategory to see if button should be unpressed
         */
      	clickedCategory: function(newVal, oldVal) {
        //   console.log('Prop changed: ', newVal, ' | was: ', oldVal)
          if (oldVal !== null 
            && newVal !== null 
            && oldVal._id === this.category._id 
            && newVal._id !== this.category._id) {
            this.clicked = !this.clicked
          }
        }
    },
    data() {
        return {
            editName: false,
            draft: this.category.name,
            clicked: false,
            categories: [],
            alerts: {}
        }
    },
    methods: {
        filterByCategory() {
            this.clicked = !this.clicked
            if (this.clicked) {
                this.$emit('filterCategory', this.category);
            } else {
                this.$emit('unfilterCategory', this.category);
            }
        },
        editCategoryName() {
            /**
             * Start editing a category name
             */
            this.editName = true;
            this.draft = this.category.name;
        },
        doneEditingName() {
            /**
             * Submit an edit to a category name
             */
            
            this.editName = false;
            if (this.draft !== this.category.name) {
                const params = {
                    method: 'PUT',
                    message: 'Successfully edited category name!',
                    body: JSON.stringify({name: this.draft}),
                    callback: () => {
                        this.$set(this.alerts, params.message, 'success');
                        setTimeout(() => this.$delete(this.alerts, params.message), 3000);
                    }
                };
                this.request(params, `/api/categories/${this.category.name}`);
            }
        },
        deleteCategory(categoryName) {
            const params = {
                method: 'DELETE',
                message: 'Successfully deleted category!',
                body: JSON.stringify({name: this.draft}),
                callback: () => {
                    this.$set(this.alerts, params.message, 'success');
                    setTimeout(() => this.$delete(this.alerts, params.message), 3000);
                }
            };
            this.request(params, `/api/categories/${categoryName}`);
        },
        async request(params, url) {
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
<style>
.categoryBox {
    border-style:dashed; 
    border-color:green; 
    border-radius: 10px;
    margin: .5em;
    padding: .5em;
    position: relative;
    text-align: center;
}

.deleteButton {
    position: absolute;
    top: 0;
    right: 0;
}
</style>