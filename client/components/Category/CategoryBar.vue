<template>
<section>
    <div 
        class="categoryBox"
        :style="{backgroundColor: clicked ? 'rgba(158, 206, 154, 1)' : 'white'}">
        <p
            v-if="!editName" 
            @click="filterByCategory">
            {{category.name}}
        </p>
        <button
            v-if="!editName"
            @click="deleteCategory(category.name)" 
            class="button-6 deleteButton">X
        </button>
        <button
            v-if="!editName"
            @click="editCategoryName"
            class="button-6 category-edit-button">
            Edit name
        </button>
        <textarea
            v-if="editName"
            class="content bar-content"
            :value="draft"
            @input="draft = $event.target.value"
        />
        <button class="button-6 category-edit-button"
            v-if="editName"
            @click="doneEditingName(category.name)">
            Done
        </button>
    </div>
</section>
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
             if (this.clicked) {
                this.$store.commit('alert', {
                    message: 'Error: cannot edit category name while filtering on it.', status: 'error'
                });
                return;
            }
            this.editName = true;
            this.draft = this.category.name;
        },
        doneEditingName(categoryName) {
            /**
             * Submit an edit to a category name
             */
            this.editName = false;
            if (this.draft !== categoryName) {
                const params = {
                    method: 'PUT',
                    message: 'Successfully edited category name!',
                    body: JSON.stringify({name: this.draft}),
                    callback: () => {
                        this.$store.commit('alert', {
                            message: 'Successfully edited category name!', status: 'success'
                        });
                    }
                };
                this.request(params, `/api/categories/${categoryName}`);
            } else {
                this.$store.commit('alert', {
                    message: 'Error: Category name should be different than previous name.', status: 'error'
                });
            }
        },
        deleteCategory(categoryName) {
            if (this.clicked) {
                this.$store.commit('alert', {
                    message: 'Error: cannot delete category while filtering on it.', status: 'error'
                });
                return;
            }
            const params = {
                method: 'DELETE',
                message: 'Successfully deleted category!',
                body: JSON.stringify({name: this.draft}),
                callback: () => {
                    this.$store.commit('alert', {
                            message: 'Successfully deleted category!', status: 'success'
                    });
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
                this.$store.commit('alert', {
                    message: e, status: 'error'
                });
            }
        },
    }
}
</script>
<style scoped>
.categoryBox {
    border-style:dashed; 
    border: 1px solid rgba(0, 0, 0, 0.1);
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
    font-size: 12px;
    padding: 4px;
}

.category-edit-button {
    padding: 4px;
    font-size: 14px;
}

.bar-content {
    width:150px;
    height:100px;
}
</style>