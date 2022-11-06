<template>
    <main>
        <header>
            <h2>@{{ $store.state.username }}'s profile</h2>
        </header>
        <div class="profile-allCategories">
            <CategoryBar
            @filterCategory="filterCategory"
            @unfilterCategory="unfilterCategory"
            v-for="category in $store.state.categories"
            :key="category.id"
            :category="category"
            :clickedCategory="clickedCategory"
            >
            </CategoryBar>
            <AddCategoryButton class="profile-addCategoryButton">
            </AddCategoryButton>
        </div>
        <div>
            <ProfileFeed
                :clickedCategory="clickedCategory">
            </ProfileFeed>
        </div>
    </main>
</template>

<script>
import FreetComponent from '@/components/Freet/FreetComponent.vue'
import CategoryBar from '@/components/Category/CategoryBar.vue'
import AddCategoryButton from '@/components/Category/AddCategoryButton.vue'
import ProfileFeed from '@/components/Profile/ProfileFeed.vue'

export default {
    name: 'ProfilePage',
    components: {FreetComponent, CategoryBar, AddCategoryButton, ProfileFeed},
    data() {
        return {
            clickedCategory: null,
            alerts: {},
        }
    },
    methods: {
        filterCategory(value) {
            this.clickedCategory = value;
        },
        unfilterCategory(value) {
            this.clickedCategory = null;
        }
    },
}
</script>

<style>
.profile-allCategories {
    overflow-x: scroll;
    display: flex;
}

.profile-addCategoryButton {
    margin-top:2em;
    margin-bottom: 2em;
}
</style>